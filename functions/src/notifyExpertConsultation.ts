const  express = require("express");
const router = express.Router();
const firebase = require('../firebase/firebase.ts');
let db = firebase.db;
const notificationService = require('../notification/sendNotification.ts');

router.get('/notifyExpertforNewConsultation?:expertId', async (req: any , res: any ) => {

    try{

        var expertId = req.query.expertId;
        console.log(expertId);
        if(!(expertId)){
            return res.status(400).json("Enter Valid expertId");
        }

        var pathForNewClient = '/experts/data/uid/'+ expertId+'/members/';
        var docName = 'data';
        var clientDataAssociatedtoExpert = await db.collection(pathForNewClient).doc(docName).get();

        //console.log(clientDataAssociatedtoExpert);

        if(!(clientDataAssociatedtoExpert)){
            return res.status(501).json("Unable to confirm client's association with ExpertId");
        }

        var requestedConsultationArray = clientDataAssociatedtoExpert.data().requestedConsultations;
        var latestConsultation = requestedConsultationArray[requestedConsultationArray.length-1];

        var clientName = latestConsultation.clientName;
        var packageName = latestConsultation.packageName;

        console.log(clientName,packageName);
        
        // Using clientName and packageName to populate the Notification Title

        var pathForExpertToken = '/experts/data/uid/'+expertId+'/private/';
        var docNameforExpertToken = 'token';

        var tokenDocResponse = await db.collection(pathForExpertToken).doc(docNameforExpertToken).get();

        if(!(tokenDocResponse)){
            return res.status(501).json("No token found for the Expert");
        }

        var tokenList = tokenDocResponse.data().token;
        var latestToken = tokenList[tokenList.length-1];

        console.log(latestToken);   

        var Notificationtitle = 'New Request to join Package '+packageName;
        var Notificationbody = clientName+ ' is requesting to join '+packageName +' Consulation Package';
        
        try{
        var response = await notificationService.sendNotification(latestToken,Notificationtitle,Notificationbody,"sortitpro_importance_channel");
        }catch(error){
            console.log("UNable to send Notification", latestToken);
        }
        
        
        console.log(response);
        if (!(response)) {
            return res.status(111).json("Error Sending the Notifcation: Debug Info" + response.data.results);
        }

        return res.status(200).json("Success");
    }catch (error) { return res.status(501).json(error.message); }


});

router.get('/notifyExpertforNewClass?:expertId', async (req: any , res: any ) => {

    try{

        var expertId = req.query.expertId;
        console.log(expertId);
        if(!(expertId)){
            return res.status(400).json("Enter Valid expertId");
        }

        var pathForNewClient = '/experts/data/uid/'+ expertId+'/members/';
        var docName = 'data';
        var clientDataAssociatedtoExpert = await db.collection(pathForNewClient).doc(docName).get();

        //console.log(clientDataAssociatedtoExpert);

        if(!(clientDataAssociatedtoExpert)){
            return res.status(501).json("Unable to confirm client's association with ExpertId");
        }

        var requestedClientsArray = clientDataAssociatedtoExpert.data().requestedClients;
        var latestClient = requestedClientsArray[requestedClientsArray.length-1];

        var clientName = latestClient.clientName;
        var className = latestClient.className;

        console.log(clientName,className);
        
        // Using clientName and packageName to populate the Notification Title

        var pathForExpertToken = '/experts/data/uid/'+expertId+'/private/';
        var docNameforExpertToken = 'token';

        var tokenDocResponse = await db.collection(pathForExpertToken).doc(docNameforExpertToken).get();

        if(!(tokenDocResponse)){
            return res.status(501).json("No token found for the Expert");
        }

        var tokenList = tokenDocResponse.data().token;
        var latestToken = tokenList[tokenList.length-1];

        console.log(latestToken);   

        var Notificationtitle = 'New Request to join the Class '+className;
        var Notificationbody = clientName+ ' is requesting to join '+className +' Classroom';
        try{
        var response = await notificationService.sendNotification(latestToken,Notificationtitle,Notificationbody,"sortitpro_importance_channel");
        }catch(error){
            console.log("UNable to send Notification", latestToken);
        }
        console.log(response);
        if (!(response)) {
            return res.status(111).json("Error Sending the Notifcation: Debug Info" + response.data.results);
        }

        return res.status(200).json("Success");
    }catch (error) { return res.status(501).json(error.message); }


});

export{ router as notifyExpert};