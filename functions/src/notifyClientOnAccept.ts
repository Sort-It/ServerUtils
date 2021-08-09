const  express = require("express");
const router = express.Router();
const firebase = require('../firebase/firebase.ts');
let db = firebase.db;
const notificationService = require('../notification/sendNotification.ts');

router.get('/notifyClientForNewEnrollment?:expertId?:type', async (req: any , res: any ) => {

    try{
        var expertId = req.query.expertId;
        var type = req.query.type; // 0 refers to Class and 1 for Consultation
        console.log(type);
        console.log(expertId);

        var pathForAcceptedClient = '/experts/data/uid/'+expertId+'/members/';
        var docName = 'data';

        var clientDataAssociatedtoExpert = await db.collection(pathForAcceptedClient).doc(docName).get();

        if(!(clientDataAssociatedtoExpert)){
            return res.status(501).json("Unable to confirm client's association with ExpertId");
        }

        var clientId ;
        var  clientName ;
        var joinedEventName;

        if(type ===0 ){

            var acceptedConsultationsArray = clientDataAssociatedtoExpert.data().acceptedClients;
            var latestAcceptedConsultation = acceptedConsultationsArray[acceptedConsultationsArray.length-1];
            clientId = latestAcceptedConsultation.clientId;
            clientName = latestAcceptedConsultation.clientName;
            joinedEventName = latestAcceptedConsultation.className;

        }
        else{
            var acceptedConsultationsArray = clientDataAssociatedtoExpert.data().acceptedConsultations;            ;
            var latestAcceptedConsultation = acceptedConsultationsArray[acceptedConsultationsArray.length-1];
            clientId = latestAcceptedConsultation.clientId;
            clientName = latestAcceptedConsultation.clientName;
            joinedEventName = latestAcceptedConsultation.className;
        }
       

        //var className = latestAcceptedClient.className;

        console.log("Client Name:",clientName);
        console.log("Client Id:",clientId);
        console.log("Pcakage/ClasName:",joinedEventName);

        // Fetching the tokenID of the Client Device
        var clientCollectionName = '/users/'+clientId+'/user_data/data/private/';
        var clientDocName = 'token';

        var clientref = await db.collection(clientCollectionName).doc(clientDocName).get();

        if(!(clientref)){
            return res.status(501).json("Unable to find client's information");
        }

        var tokenArray = clientref.data().token;
        var currentToken = tokenArray[tokenArray.length-1];

        console.log("Token:",currentToken);

        // send Notification to client for his accepted class

        var Notificationtitle = "Request to join Class/Package Approved" ;
        var Notificationbody = "Your Request to join " + (type===0?"Class":"Package")+ ' : '+joinedEventName +" is approved";
        var response = await notificationService.sendNotification(currentToken,Notificationtitle,Notificationbody,"sortit_importance_channel");
        
        console.log(response);

        if(!(response)){
            return res.status(111).json("Unable to send Notification");
        }

        return res.status(200).json("Success");

    }catch (error) { return res.status(501).json(error.message); }
});

export {router as clientNotification};