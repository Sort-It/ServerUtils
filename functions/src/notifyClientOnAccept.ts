const  express = require("express");
const router = express.Router();
const firebase = require('../firebase/firebase.ts');
let db = firebase.db;
const notificationService = require('../notification/sendNotification.ts');

router.get('/notifyClientForNewEnrollment?:expertId?:type', async (req: any , res: any ) => {

    try{
        var expertId = req.query.expertId;
        var type = req.query.type; // 0 refers to Class and 1 for Consultation
        console.log("TYPE:",type);
        console.log("EXPERTID:",expertId);

        var pathForAcceptedClient = '/experts/data/uid/'+expertId+'/members/';
        var docName = 'data';

        var clientDataAssociatedtoExpert = await db.collection(pathForAcceptedClient).doc(docName).get();

        if(!(clientDataAssociatedtoExpert)){
            return res.status(501).json("Unable to confirm client's association with ExpertId");
        }

        var clientId ;
        var  clientName ;
        var joinedEventName;


        if(type ==='0' ){

            var acceptedConsultationsArray = clientDataAssociatedtoExpert.data().acceptedClients;
            var latestAcceptedConsultation = acceptedConsultationsArray[acceptedConsultationsArray.length-1];
            clientId = latestAcceptedConsultation.clientId;
            clientName = latestAcceptedConsultation.clientName;
            joinedEventName = latestAcceptedConsultation.className;

        }
        else{
            var acceptedConsultationsArray = clientDataAssociatedtoExpert.data().acceptedConsultations;            
            var latestAcceptedConsultation = acceptedConsultationsArray[acceptedConsultationsArray.length-1];
            clientId = latestAcceptedConsultation.clientId;
            clientName = latestAcceptedConsultation.clientName;
            joinedEventName = latestAcceptedConsultation.packageName;
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
        var Notificationbody = "Your Request to join " + (type==='0'?"Class":"Package")+ ' : '+joinedEventName +" is approved";
        try{
            var response = await notificationService.sendNotification(currentToken,Notificationtitle,Notificationbody,"sortit_importance_channel");
        }
        catch(error){
            console.log("UNable to send Notification", currentToken);
        }
        
        console.log(response);

        if(!(response)){
            return res.status(111).json("Unable to send Notification");
        }

        return res.status(200).json("Success");

    }catch (error) { return res.status(501).json(error.message); }
});


router.get('/notifyClientWhenClassisLive?:classId', async (req: any , res: any ) => {

    try{
        var classId = req.query.classId;
        console.log("ClassID:",classId);

        var pathForClass = '/classrooms/'+classId+'/members/';
        var docName = 'data';

        var classDataRef = await db.collection(pathForClass).doc(docName).get();

        if(!(classDataRef)){
            return res.status(501).json("Unable to find the class");
        }

        var classData = classDataRef.data();
        var clientIdArray = [];

        var pathforClassMetaData = '/classrooms/';
        var classMetaDataREf = await db.collection(pathforClassMetaData).doc(classId).get();
        var classMetaData = classMetaDataREf.data();

        var n = classData.enrolledMembers.length;
        if(n==0){
            return res.status(501).json("No clients enrolled for the class");
        }

        for(let ind =0;ind<n;ind++){
            var member = classData.enrolledMembers[ind];
            clientIdArray.push(member["uid"]);
        }
       
        //Fetch tokenId of each of the client and ens notify to them all

        console.log("CLIENTIDS:",clientIdArray);

        for(let ind = 0;ind<n;ind++){

            try{

                var clientId = clientIdArray[ind];

                var clientPath = '/users/'+clientId+'/user_data/data/private/';
                var clientDocName = "token";

                var clientDataRef = await db.collection(clientPath).doc(clientDocName).get();
                var clientData = clientDataRef.data();

                var deviceTokenArray = clientData.token;
                var currentDeviceToken = deviceTokenArray[deviceTokenArray.length-1];

                console.log("DEVICE TOKEN:",currentDeviceToken)

                var Notificationtitle = "Enrolled Classroom "+ classMetaData.name+ " is Live";
                var Notificationbody = "Enrolled Class : "+classMetaData.name + " by Expert : "+classMetaData.coachName+ " is currently live" ;
    
                var resp =await notificationService.sendNotification(currentDeviceToken,Notificationtitle,Notificationbody,"sortit_importance_channel");
                console.log("NOTIFICATION REF:",resp);
            }catch(error){
                console.log("UNable to send Notification",currentDeviceToken );
            }
        }

              
        return res.status(200).json("Success");

    }catch (error) { return res.status(501).json(error.message); }
});


export {router as clientNotification};