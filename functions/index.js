const functions = require("firebase-functions");

const {getAuth} = require("firebase-admin/auth");

var admin = require("firebase-admin");

const {initializeApp} = require("firebase-admin/app");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
// const {th} = require("date-fns/locale");
const { Firestore } = require("firebase-admin/firestore");
admin.initializeApp();



//function called when adim deletes user
//this function removes the user from firebase authentication using admin sdk

exports.deleteUserFn = functions.https.onCall(async (data, context) => {
  const {uid} = data;
  await admin.auth()
    .deleteUser(uid)
    .then(() => {
      console.log('Successfully deleted user');
      return "user deleted";
    })
    .catch((error) => {
      console.log('Error deleting user:', error);
      return "error deleting user"
    });
});



//this function runs every moday at 10:35 am and checks if there are any new users
//and send an reminder email to adim if there are new users waiting for approval

exports.adminReminder = onSchedule("35 10 * * 1", async (event) => {
  console.log('function executed');
  

  const adminUsers = [];

  const PendingUsers = [];

  try {
    const usersnapShot = await admin.firestore().collection('Users').get();

    usersnapShot.forEach((doc) => {
      const userData = doc.data();

      if (userData.admin === true) {
        adminUsers.push(userData.email);
      }
      if (userData.verified === false) {
        PendingUsers.push(userData.email);
      }
    })

    console.log('Admin Users:', adminUsers);

  }
  catch (error) {
    console.error('Error retrieving users:', error);
  }

  if (adminUsers.length > 0) {
    await admin.firestore().collection('adminUsers').doc('adminList').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      admins: adminUsers
    });
  }

  if (PendingUsers.length > 0) {
    emailDoc = {
      to: adminUsers,
      template: {
        name: 'adminReminder',
        data: {
          newUsers: PendingUsers.length,
          userList: PendingUsers,
        }

      }
    }

    await admin.firestore().collection('email').add(emailDoc);
  }
  console.log('Admin users list written to Firestore:', adminUsers);

})


//this function runs on first of every month and checks is there are any users that are past renewal date 
//and remove thier access to the application. The admin needs to reverify them and set the access.


exports.UserRenewalStatusUpdateFn = onSchedule("30 9 1 * *", async (event) => {

  try {
    const currentDate = new Date();

    const usersnapShot = await admin.firestore().collection('Users').get();

    for (const doc of usersnapShot.docs) {
      const userData = doc.data();
      const renewalDate = new Date(userData.renewalDate);
      const isAdmin = userData.admin;
      if (!isAdmin && currentDate > renewalDate) {
        await admin.firestore().collection('Users').doc(userData.uid).update({
          requiresRenewal: true,
        })
      }
    }
  }
  catch (error) {
    console.log("Error retriving Users:", error);
  }

})


exports.userSignUpFn = functions.https.onCall(async (data, context) => {

  // if(!context.app)
  //   {
  //     throw new functions.https.HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
  //   }


  const {email, password, checkPassword, firstName, middleName, lastName, phoneNumber, companyName, shortDescription, } = data;

  if (!email || !firstName || !lastName || !phoneNumber || !companyName || !shortDescription) {
    throw new functions.https.HttpsError('invalid-argument', 'Required fields are missing.');
  }

  try {

    //create user in firebase authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    //create user in firestore database
    const userDocRef = admin.firestore().collection('Users').doc(userRecord.uid);

    const date = new Date();
    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const formattedRenewalDate = oneYearFromNow.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const newUserProfile = {
      uid: userRecord.uid,
      admin: false,
      applied: false, // Assuming this maps to a step in the process
      verified: false,
      role: "", // Default role is empty, to be set by logic or admin
      email: email,
      displayName: `${firstName} ${lastName}`,
      subscriptions: [],
      requiresRenewal: false,
      registeredDate: formattedDate,
      renewalDate: formattedRenewalDate,
      shortDescription: shortDescription,
      firstName: firstName,
      middleName: middleName || '', // Use empty string if middleName is not provided
      lastName: lastName,
      phoneNumber: phoneNumber,
      companyName: companyName,
      fullAccess: false,
    };

    // Apply special logic for @modot.mo.gov emails
    if (/@modot.mo.gov\s*$/.test(email)) {
      newUserProfile.verified = true;
      newUserProfile.fullAccess = true;
      newUserProfile.role = "FullAccess";
    }

    await userDocRef.set(newUserProfile);

    // Step 3: Define settings for the verification link.
    const actionCodeSettings = {
      // IMPORTANT: Replace this with the URL of your login page.
      url: 'https://missouri-titan.com/login',
      handleCodeInApp: false // This should be false for web apps.
    };

    const verificationLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

    const verificationEmail = {
      to: [email],
      template: {
        name: 'verifyEmail', // You must create an email template with this name.
        data: {
          verificationLink: verificationLink,
        },
      },
    };

    await admin.firestore().collection('email').add(verificationEmail);


    return {message: 'User created successfully. Please check your email for verification.', uid: userRecord.uid};
  }
  catch (error) {
    console.error('Error creating new user:', error);
    const authError = error;
    let code = 'internal';
    let message = 'An unknown error occurred.';
    if (authError && authError.code) {

      message = authError.message;

      switch (authError.code) {
        case 'auth/email-already-exists':
          code = 'already-exists';
          break;
        case 'auth/invalid-password':
        case 'auth/invalid-email':
          code = 'invalid-argument';
          break;
        default:
          code = 'internal';
          break;
      }
    }
    throw new functions.https.HttpsError(code, message, authError);
  }
});


exports.getUserStatus = functions.https.onCall(async (data, context) => {
  const email = data.email;

  if (!email || typeof email !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a valid email string.'
    );
  }

  try {
    // Step 1: Check if the user exists in Firebase Authentication.
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // User exists in Auth, now check their Firestore document for admin verification.
    const userDocRef = admin.firestore().collection('Users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();

    let adminVerified = false;

    if (userDoc.exists) {
      // Check the 'verified' field from the Firestore document.
      adminVerified = userDoc.data().verified === true;
    }

    const isMfaEnabled = userRecord.multiFactor?.enrolledFactors.length > 0;

    // Return the complete status.
    return {
      userExists: true,
      emailVerified: userRecord.emailVerified,
      isAdminVerified: adminVerified,
      isMfaEnabled: isMfaEnabled,
    };

  } catch (error) {
    // Check if the error is specifically because the user was not found in Auth.
    if (error.code === 'auth/user-not-found') {
      // This is a valid case; the user simply doesn't exist.
      return {
        userExists: false,
        emailVerified: false,
        isAdminVerified: false,
      };
    }
    
    // For any other type of error, log it and re-throw a more specific error.
    console.error("Error in getUserStatus function:", error);

    let code = 'internal';
    let message = 'An unexpected error occurred while checking user status.';

    // Check if the caught error is a Firebase error with code/message
    if (error && error.code) {
        message = error.message; // Preserve the original message
        
        // Map specific Firebase Auth error codes to standard HttpsError codes
        switch(error.code) {
            case 'auth/invalid-email':
                code = 'invalid-argument';
                break;
            // You can add more specific anticipated error codes here.
            // For example, if a Firestore permission was denied:
            // case 'permission-denied':
            //     code = 'permission-denied';
            //     break;
            default:
                code = 'internal'; // Fallback for any other unhandled codes
        }
    }

    // Re-throw a new HttpsError with the mapped code and original message.
    throw new functions.https.HttpsError(code, message, error);
  }
});


// this will run 5 AM every day and revoke sessions for users who have been inactive for more than 6 hours
exports.revokeInactiveSessions = onSchedule("0 5 * * *",async (request, response) => {
  console.log("Starting job to revoke inactive user sessions...");

  // Calculate the cutoff time: 6 hours ago from now.
  const twelveHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
  
  const errors = [];
  let totalRevokedCount = 0;
  
  try {
    // Step 1: Fetch all user documents from the 'Users' collection.
    const usersSnapshot = await admin.firestore().collection('Users').get();
    const allUserDocs = usersSnapshot.docs;
    const processedUserCount = allUserDocs.length;
    

    // Step 2: Identify potentially inactive users based on Firestore data and the new logic.
    const potentialUidsToRevoke = [];
    for (const userDoc of allUserDocs) {
      const userData = userDoc.data();
      const lastActiveTimestamp = userData.lastInactive; // Firestore Timestamp or undefined
      const lastRevokedTimestamp = userData.lastRevoked; // Firestore Timestamp or undefined

      // Condition to check if a user is a candidate for revocation.
      let shouldRevoke = false;

      if (!lastActiveTimestamp) {
        // If lastActive doesn't exist, they are inactive.
        // We only revoke them if they haven't been revoked before.
        if (!lastRevokedTimestamp) {
          shouldRevoke = true;
        }
      } else {
        // lastActive exists, compare it to the cutoff time and the lastRevoked time.
        const lastActiveDate = lastActiveTimestamp.toDate();
        if (lastActiveDate < twelveHoursAgo) {
          // User has been inactive for more than 12 hours.
          // Now, check if we've already revoked them since their last activity.
          if (!lastRevokedTimestamp || lastActiveDate > lastRevokedTimestamp.toDate()) {
            // Revoke if lastRevoked doesn't exist OR if their last activity
            // was more recent than the last time we revoked them.
            shouldRevoke = true;
          }
        }
      }

      if (shouldRevoke) {
        potentialUidsToRevoke.push({ uid: userDoc.id });
      }
    }
    
    if (potentialUidsToRevoke.length === 0) {
        const message = `Job finished. Processed ${processedUserCount} users. No new inactive users to revoke.`;
        console.log(message);
        return response.status(200).send(message);
    }

    // Step 3: Process the potentially inactive users in chunks of 100.
    const chunkSize = 100;
    for (let i = 0; i < potentialUidsToRevoke.length; i += chunkSize) {
      const chunk = potentialUidsToRevoke.slice(i, i + chunkSize);
      console.log(`Processing a chunk of ${chunk.length} users...`);

      const getUsersResult = await admin.auth().getUsers(chunk);
      
      const uidsToRevokeInChunk = new Set();
      getUsersResult.users.forEach(userRecord => {
          if (userRecord.metadata.lastSignInTime) {
              uidsToRevokeInChunk.add(userRecord.uid);
          }
      });

      if (uidsToRevokeInChunk.size > 0) {
        const uniqueUids = Array.from(uidsToRevokeInChunk);
        totalRevokedCount += uniqueUids.length;
        console.log(`Attempting to revoke sessions and update doc for ${uniqueUids.length} users in this chunk.`);
        
        const allPromises = uniqueUids.map(uid => {
          return admin.auth().revokeRefreshTokens(uid)
            .then(() => {
              const userDocRef = admin.firestore().collection('Users').doc(uid);
              return userDocRef.update({ lastRevoked: Firestore.FieldValue.serverTimestamp() });
            })
            .catch(err => {
              errors.push(`Failed process for ${uid}: ${err.message}`);
            });
        });
        await Promise.all(allPromises);
      }
    }

    const responseMessage = `Job finished. Processed ${processedUserCount} users. Attempted revocation for ${totalRevokedCount} users. Encountered ${errors.length} errors.`;
    console.log(responseMessage);
    if (errors.length > 0) {
      console.error("Errors during process:", errors);
    }
    response.status(200).send(responseMessage);

  } catch (error) {
    const errorMessage = `A critical error occurred: ${error.message}`;
    console.error(errorMessage, error);
    response.status(500).send(errorMessage);
  }
});



exports.sendEmailReverification = functions.https.onCall(async (data, context) => {
  const { email } = data;

  if (!email || typeof email !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a valid email string.'
    );
  }

  try {
    // Step 1: Check if the user exists in Firebase Authentication.
    const userRecord = await admin.auth().getUserByEmail(email);

    // Step 2: Generate a new email verification link.
    const actionCodeSettings = {
      url: 'https://missouri-titan.com/login',
      handleCodeInApp: false
    };

    const verificationLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

    // Step 3: Create the email document and add it to Firestore.
    const verificationEmail = {
      to: [email],
      template: {
        name: 'verifyEmail',
        data: {
          verificationLink: verificationLink,
        },
      },
    };

    await admin.firestore().collection('email').add(verificationEmail);

    return { message: 'Re-verification email sent successfully.' };
  } catch (error) {
    console.error('Error sending re-verification email:', error);
    throw new functions.https.HttpsError('internal', 'An error occurred while sending the re-verification email.', error);
  }
}
);


// exports.addNewFieldToAllUsers = functions.https.onRequest(async (req,res) => {
 
//   try {
//     const usersSnapshot = await admin.firestore().collection('Users').get();

//     const updatePromises = usersSnapshot.docs.map(async (doc) => {
//       const userData = doc.data();
//       if (!userData.hasOwnProperty('lastMfaVerified')) {
//         const userDocRef = admin.firestore().collection('Users').doc(doc.id);
//         return userDocRef.update({ lastMfaVerified: null });
//       }
//     });

//     await Promise.all(updatePromises);
//     return res.status(200).json({ message: 'Field added to all users successfully.' });
//   } catch (error) {
//     console.error('Error adding field to users:', error);
//     return res.status(500).json({ error: 'An error occurred while adding the field.' });
  
//   }
// });





