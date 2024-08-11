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

const functions=require("firebase-functions");

exports.sayHello=functions.https.onCall((data,context)=>{
    return `Hello from firebase functions`
});