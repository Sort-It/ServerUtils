const axios = require('axios');

var sendNotification = function(fcmId,title,body,click_action){

    var url = 'https://fcm.googleapis.com/fcm/send';
    var serverKey ='AAAA48lDk14:APA91bFr3AB7Zbp9zUxdGK0_0tIpftHw0cgT-Cl92zmiOy64OWiUX9fwNQZ5MF0tSf5YNy8zzT5HRQ3sBRq1VCx78dp9WZJRpCokqGuEiUwLjD5jF7h2mvh3XoIFme1gR2NHlOPdEhBR';

    var headers ={
        "Authorization": 'key='+serverKey,
        "Content-Type": 'application/json'
    };

    var reqbody = {
        "to":fcmId,
        "data":{
            "title":title,
            "body":body,
            "click_action":click_action
        }
    };

    return axios.post(url,reqbody,{
        headers:headers
    });
};
// sendNotification('d0KlrbmcSh-wmRtJ09IF2H:APA91bG5U5AK5lVzHQwXWH44rJYD56SlhWAm54VJaKkoSGPQkwuPMSG7xkrRWe8E4zfy5qKBlHrLku5ego1Oo9e7kZ6B2UyYTVkoXcaJC2OUuIbcbr9RlA5h9ltH_YMOP3sOpOtoqMAr'
// , 'Testing 102','This is me testing notification LOL','I choose you pikachu click action').then(function(resp){
//     console.log(resp.data);
// });

exports.sendNotification = sendNotification;