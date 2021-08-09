
const  express = require("express");
const router = express.Router();
const firebase = require('../firebase/firebase.ts');
let db = firebase.db;
const notificationService = require('../notification/sendNotification.ts');

router.get('/notifySuccessfulTransaction?:transactionId', async (req: any , res: any ) => {

    try{

        var transactionId = req.query.transactionId;
        console.log("TransactionId",transactionId);
        var collectionName = 'Transactions';

        var transactionRef =await db.collection(collectionName).doc(transactionId).get();
        if(!(transactionRef)){
            res.status(501).json("Unable to fetch Transaction Details");
        }

        var transactionData = transactionRef.data();

        var clientId = transactionData.clientId;
        var expertId = transactionData.trainerId;
        var amount = transactionData.amount;
        var clientName = transactionData.clientName;

        console.log("ClientID",clientId);
        console.log("ExpertId",expertId);

        // Fetch Client Token
        var clientCollectionName = '/users/'+clientId+'/user_data/data/private/';
        var clientDocName = 'token';

        var clientref = await db.collection(clientCollectionName).doc(clientDocName).get();

        if(!(clientref)){
            return res.status(501).json("Unable to find client's information");
        }

        var tokenArray = clientref.data().token;
        var currentClientToken = tokenArray[tokenArray.length-1];

        //Fetch Expert Token

        var pathForExpertToken = '/experts/data/uid/'+expertId+'/private/';
        var docNameforExpertToken = 'token';

        var tokenDocResponse = await db.collection(pathForExpertToken).doc(docNameforExpertToken).get();

        if(!(tokenDocResponse)){
            return res.status(501).json("No token found for the Expert");
        }

        var tokenList = tokenDocResponse.data().token;
        var currentExpertToken = tokenList[tokenList.length-1];

        // send Notification to client 
        var NotificationtitleClient = 'Your Payment is Successful';
        var NotificationbodyClient = 'Your payment of Rs. '+amount+' is successful.';
        
        var response = await notificationService.sendNotification(currentClientToken,NotificationtitleClient,NotificationbodyClient,"sortit_importance_channel");

        if(!(response)){
            return res.status(111).json("Unable to send Notification");
        }

        var Notificationtitle = 'Recieved Payment';
        var Notificationbody = 'You have recieved a payment of Rs. '+ amount + ' from '+ clientName;
        
        var response1 = await notificationService.sendNotification(currentExpertToken,Notificationtitle,Notificationbody,"sortitpro_importance_channel");
        
        if(!(response1)){
            return res.status(111).json("Unable to send Notification");
        }

        return res.status(200).json("Success");
    }catch (error) { return res.status(501).json(error.message); }

});

export {router as paymentNotification };