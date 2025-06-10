

const functions = require("firebase-functions");

const {getAuth} = require("firebase-admin/auth");

var admin = require("firebase-admin");

const {initializeApp} = require("firebase-admin/app");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {th} = require("date-fns/locale");

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

