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
// sendNotification('czsJwAMyR5alhtgMNGtk7-:APA91bEdBojCgRtXBGI32e_2cyximOG12E2pjjYualfAKwfgWBeKvIpK-dTkQNKEew5sPrB95oPURIvr3mPakAdXolfbrcW2BRMW0h7U6ZRZHFDk_wg0QZsNv1gwt_WQt7wu4Gu2c4kS'
// , 'Testing 103','This is me testing notification LOL','sortitpro_importance_channel').then(function(resp){
//     console.log(resp.data);
// });
// sortit_importance_channel

exports.sendNotification = sendNotification;