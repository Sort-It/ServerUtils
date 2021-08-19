const axios = require('axios');
const firebase = require('../firebase/firebase.ts');
var serviceAccount = require('../firebase/serviceAccountKey.json');
let admin = firebase.admin;

var sendNotification = function(fcmId,title,body,channelID){

    var message = {
        "token":fcmId,
        "android":{
            "notification":{
                "channelId":channelID,
                "clickAction":"FLUTTER_NOTIFICATION_CLICK"
            }
        },
        "notification":{
            "title":title,
            "body":body,
        }
    };

    return admin.messaging().send(message);    
};
// sendNotification('dygKIPxBQpCXxPAopcgEyX:APA91bEtSVoOxSU0MbsGeWbPz9mrikJCP0QsTgqCmX_WsG85my-aOV_qbR62FPgMDyzcxOQqstXmBV8jnXwcbh-Sae8WuymIH3PQI7_AC0nBcLCsUawpsHdO979Vs8sNIOMnCm_oyJzP'
// , 'Testing 103','This is me testing notification LOL','sortitpro_importance_channel').then(function(resp){
//     console.log(resp.data);
// });
// sortit_importance_channel

exports.sendNotification = sendNotification;