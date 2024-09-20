/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });





// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp(functions.config().firebase);

// exports.myFunc = functions.https.onRequest(function(req, resp) {
//          admin.auth()
//   .getUser('999cy8x4JHgLFbGmQWBhVZpJ68D3')
//   .then((userRecord) => {
//     // See the UserRecord reference doc for the contents of userRecord.
//     console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
//   })
//   .catch((error) => {
//     console.log('Error fetching user data:', error);
//   });
//     });







// const functions = require("firebase-functions");
// const { initializeApp, applicationDefault } = require("firebase-admin/app");
// const { getAuth } = require("firebase-admin/auth");
// const { getDatabase } = require("firebase-admin/database");

// const app = initializeApp();

// exports.myFunc = functions.https.onRequest(function(req, resp) {
//     getAuth()
//     .getUser('999cy8x4JHgLFbGmQWBhVZpJ68D3')
//     .then((userRecord) => {
//       // See the UserRecord reference doc for the contents of userRecord.
//       console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
//     })
//     .catch((error) => {
//       console.log('Error fetching user data:', error);
//     });
//     });




// var admin = require("firebase-admin");
// const functions = require("firebase-functions");
// const { initializeApp, applicationDefault } = require("firebase-admin/app");
// const { getAuth } = require("firebase-admin/auth");

// var serviceAccount = require("/home/gahan/Downloads/titan.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://titan-49df0-default-rtdb.firebaseio.com"
// });

// exports.myFunc = functions.https.onRequest(function(req, resp) {
//     getAuth()
//     .getUser('999cy8x4JHgLFbGmQWBhVZpJ68D3')
//     .then((userRecord) => {
//       // See the UserRecord reference doc for the contents of userRecord.
//       console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
//     })
//     .catch((error) => {
//       console.log('Error fetching user data:', error);
//     });
//     });


// const {onCall, HttpsError} = require("firebase-functions/v2/https");
// const {logger} = require("firebase-functions/v2");

// // Dependencies for the addMessage function.
// const {getDatabase} = require("firebase-admin/database");
// const sanitizer = require("./sanitizer");

// const functions=require("firebase-functions");

// const cors = require('cors')({ origin: true });

// exports.sayHello = functions.https.onRequest((req, res) => {
//   // Enable CORS using the cors middleware
//   cors(req, res, () => {
//     res.status(200).send('Hello from Firebase Functions!');
//   });
// });


// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



const functions = require("firebase-functions");

const { getAuth } = require("firebase-admin/auth");

var admin = require("firebase-admin");

const { initializeApp} = require("firebase-admin/app");
const {onSchedule} = require("firebase-functions/v2/scheduler");

admin.initializeApp();





exports.deleteUserFn = functions.https.onCall(async (data, context)=>{
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



exports.adminReminder = onSchedule("36 20 * * 0",async(event)=>{
  console.log('function executed'); 
  
  const adminUsers = [];

  const PendingUsers = [];

  try{
    const usersnapShot = await admin.firestore().collection('Users').get();
    
    usersnapShot.forEach((doc)=>{
      const userData =doc.data();

      if(userData.admin===true)
        {
          adminUsers.push(userData.email);
        }
      if(userData.verified === false)
        {
          PendingUsers.push(userData.email);
        }
    })

    console.log('Admin Users:', adminUsers);

  }
  catch(error){
    console.error('Error retrieving users:', error);
  }

  if(adminUsers.length > 0)
    {
      await admin.firestore().collection('adminUsers').doc('adminList').set({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        admins: adminUsers
      });
    }

  if(PendingUsers.length > 0){
    emailDoc={
      toUids:['ZAecpU0FFabs3rJN11ND7rxrhTR2','8RvlKpkyhvRZnIzjdz8bKK14Ro62','QKL0tbpl4VZ9BUbaClDrIFrX1Cw2'],
      template: {
        name: 'adminReminder',
        data:{
          newUsers: PendingUsers.length,
          userList: PendingUsers,
        }
    
       }
    }

    await admin.firestore().collection('email').add(emailDoc);
  }



    console.log('Admin users list written to Firestore:', adminUsers);
  
})

exports.UserRenewalStatusUpdateFn=onSchedule("07 15 * * 4",async(event)=>{

  try{
    const currentDate = new Date();
     
    const usersnapShot = await admin.firestore().collection('testUsers').get();

    for(const doc of usersnapShot.docs)
      {
        const userData=doc.data();
        const renewalDate = new Date(userData.renewalDate);
        const isAdmin = userData.admin;
        if(!isAdmin && currentDate>renewalDate)
          {
            await admin.firestore().collection('testUsers').doc(userData.uid).set({
              requiresRenewal:true,
            },{merge:true});
          }
      }
  }
  catch(error){
    console.log("Error retriving Users:",error);
  }

})

exports.tempFunction=onSchedule("30 10 * * 5", async(event)=>{
  try{
        
    const usersnapShot = await admin.firestore().collection('Users').get();
    for(const doc of usersnapShot.docs)
      {
        const userData=doc.data();
        const accessLevel=userData.fullAccess;
        if(accessLevel)
          {
             await admin.firestore().collection('Users').doc(userData.uid).update({
              role:"FullAccess"
             })
          }
          else{
            await admin.firestore().collection('Users').doc(userData.uid).update({
              role:"LimitedAccess"
             })
          }
      }

  }
  catch(error)
  {
    console.log("error executing temp function:",error);
  }
})