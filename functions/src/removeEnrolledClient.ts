const  express = require("express");
const router = express.Router();
const firebase = require('../firebase/firebase.ts');
let db = firebase.db;
const utility = require('../common/utility.ts');
let removeElement = utility.removeElement;

router.get('/removeClientFromConsultation?:trainerId?:clientId?:consultationId', async (req: any , res: any ) => {

    try{

        var trainerId = req.query.trainerId;
        var clientId = req.query.clientId;
        var consultationId = req.query.consultationId;
        console.log(clientId,consultationId,trainerId);

        var batch = db.batch();
        // making write operations atomic

        var pathForTrainer = '/experts/data/uid/'+ trainerId +'/members/';
        var TrainerDocName = 'data';
    
        var trainerDataRef  = await db.collection(pathForTrainer).doc(TrainerDocName).get();
        var trainerData = trainerDataRef.data();

        var acceptedConsultationmodified = removeElement(trainerData.acceptedConsultations,"consultationId",consultationId);
        
        // update the requestedCOnusltaion for the trainer 
        var trainerref = db.collection(pathForTrainer).doc(TrainerDocName);
        batch.set(trainerref,{"acceptedConsultations":acceptedConsultationmodified},{merge:true});

        // remove the consultation from user path
        var pathForClient = '/users/'+clientId+'/user_data/data/enrolled/';
        var ClientDocName = 'data';

        var clientDataRef = await db.collection(pathForClient).doc(ClientDocName).get();
        var clientData =  clientDataRef.data();

        var enrolledClientConsultationmodified = removeElement(clientData.enrolledConsultation,"consultationId",consultationId);
        
        // update the requestedCOnusltaion for the Client 
        var clientref = db.collection(pathForClient).doc(ClientDocName)
        batch.set(clientref,{"enrolledConsultation":enrolledClientConsultationmodified},{merge:true});

        //Update the root level COnsultations
        var Consultationpath = 'consultations';
        var consultationDocName = consultationId;

        var consultationref = db.collection(Consultationpath).doc(consultationDocName);
        batch.set(consultationref,{"clientState":2},{merge:true});

        // Performing Atomic Writes
        await batch.commit();

        return res.status(200).json("Success");

    }catch (error) { return res.status(501).json(error.message); }

});


router.get('/removeClientFromClass?:trainerId?:clientId?:classId', async (req: any , res: any ) => {

    try{

        var trainerId = req.query.trainerId;
        var clientId = req.query.clientId;
        var classId = req.query.classId;
        console.log("REMOVE CLIENT FORM CLASS:");
        console.log("CLIENTID,CLASSID,TRAINERID",clientId,classId,trainerId);

        var batch = db.batch();
        // making write operations atomic

        var pathForTrainer = '/experts/data/uid/'+ trainerId +'/members/';
        var TrainerDocName = 'data';
    
        var trainerDataRef  = await db.collection(pathForTrainer).doc(TrainerDocName).get();
        var trainerData = trainerDataRef.data();

        var acceptedClientsmodified = removeElement(trainerData.acceptedClients,"classId",classId);
        
        // update the requestedCOnusltaion for the trainer 
        var trainerref = db.collection(pathForTrainer).doc(TrainerDocName);
        batch.set(trainerref,{"acceptedClients":acceptedClientsmodified},{merge:true});

        // remove the consultation from user path
        var pathForClient = '/users/'+clientId+'/user_data/data/enrolled/';
        var ClientDocName = 'data';

        var clientDataRef = await db.collection(pathForClient).doc(ClientDocName).get();
        var clientData =  clientDataRef.data();

        var enrolledClientClassesmodified = removeElement(clientData.enrolledClasses,"classId",classId);
        
        // update the requestedCOnusltaion for the Client 
        var clientref = db.collection(pathForClient).doc(ClientDocName)
        batch.set(clientref,{"enrolledClasses":enrolledClientClassesmodified},{merge:true});

        //Update the root level COnsultations
        var Classroompath = 'classrooms/'+classId+'/members/';
        var classroomDocName = 'data';

        var classroomRef = db.collection(Classroompath).doc(classroomDocName);

        var classroomDataRaw = await classroomRef.get();
        var classroomData = classroomDataRaw.data();
        console.log("ClassroomData",classroomData.enrolledMembers);

        var modifiedenrolledMembers = removeElement(classroomData.enrolledMembers,"uid",clientId);
        batch.set(classroomRef,{"enrolledMembers":modifiedenrolledMembers},{merge:true});


        // Performing Atomic WritesclassroomDataRaw
        await batch.commit();

        return res.status(200).json("Success");

    }catch (error) { return res.status(501).json(error.message); }

});

export { router as removeClient};