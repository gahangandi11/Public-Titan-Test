

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



exports.adminReminder = onSchedule("35 10 * * 1",async(event)=>{
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
      to:adminUsers,
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

exports.UserRenewalStatusUpdateFn=onSchedule("30 9 1 * *",async(event)=>{

  try{
    const currentDate = new Date();
     
    const usersnapShot = await admin.firestore().collection('Users').get();

    for(const doc of usersnapShot.docs)
      {
        const userData=doc.data();
        const renewalDate = new Date(userData.renewalDate);
        const isAdmin = userData.admin;
        if(!isAdmin && currentDate>renewalDate)
          {
            await admin.firestore().collection('Users').doc(userData.uid).update({
              requiresRenewal:true,
            })
          }
      }
  }
  catch(error){
    console.log("Error retriving Users:",error);
  }

})

// exports.tempFunction=onSchedule("30 10 * * 5", async(event)=>{
//   try{
        
//     const usersnapShot = await admin.firestore().collection('Users').get();
//     for(const doc of usersnapShot.docs)
//       {
//         const userData=doc.data();
//         const accessLevel=userData.fullAccess;
//         if(accessLevel)
//           {
//              await admin.firestore().collection('Users').doc(userData.uid).update({
//               role:"FullAccess"
//              })
//           }
//           else{
//             await admin.firestore().collection('Users').doc(userData.uid).update({
//               role:"LimitedAccess"
//              })
//           }
//       }

//   }
//   catch(error)
//   {
//     console.log("error executing temp function:",error);
//   }
// })