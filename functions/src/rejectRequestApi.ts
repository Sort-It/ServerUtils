const  express = require("express");
const router = express.Router();
const firebase = require('../firebase/firebase.ts');
const utility = require('../common/utility.ts');
let db = firebase.db;
let removeElement = utility.removeElement;

router.get('/rejectConsultationRequest?:trainerId?:clientId?:consultationId', async (req: any , res: any ) => {

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

        var requestedConsultationmodified = removeElement(trainerData.requestedConsultations,"consultationId",consultationId);
        
        // update the requestedCOnusltaion for the trainer 
        var trainerref = db.collection(pathForTrainer).doc(TrainerDocName);
        batch.set(trainerref,{"requestedConsultations":requestedConsultationmodified},{merge:true});

        // remove the consultation from user path
        var pathForClient = '/users/'+clientId+'/user_data/data/enrolled/';
        var ClientDocName = 'data';

        var clientDataRef = await db.collection(pathForClient).doc(ClientDocName).get();
        var clientData =  clientDataRef.data();

        var requestedClientConsultationmodified = removeElement(clientData.requestedConsultation,"consultationId",consultationId);
        
        // update the requestedCOnusltaion for the Client 
        var clientref = db.collection(pathForClient).doc(ClientDocName)
        batch.set(clientref,{"requestedConsultation":requestedClientConsultationmodified},{merge:true});

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

router.get('/rejectClassRequest?:trainerId?:clientId?:classroomId', async (req: any , res: any ) => {

    try{

        var trainerId = req.query.trainerId;
        var clientId = req.query.clientId;
        var classroomId = req.query.classroomId;
        console.log(clientId,classroomId,trainerId);

        var batch = db.batch();
        // making write operations atomic

        var pathForTrainer = '/experts/data/uid/'+ trainerId +'/members/';
        var TrainerDocName = 'data';
    
        var trainerDataRef  = await db.collection(pathForTrainer).doc(TrainerDocName).get();
        var trainerData = trainerDataRef.data();

        var requestedClassmodified = removeElement(trainerData.requestedClients,"classId",classroomId);
        
        // update the requestedCOnusltaion for the trainer 
        var trainerref = db.collection(pathForTrainer).doc(TrainerDocName);
        batch.set(trainerref,{"requestedClients":requestedClassmodified},{merge:true});

        // remove the consultation from user path
        var pathForClient = '/users/'+clientId+'/user_data/data/enrolled/';
        var ClientDocName = 'data';

        var clientDataRef = await db.collection(pathForClient).doc(ClientDocName).get();
        var clientData =  clientDataRef.data();

        var requestedClientClassmodified = removeElement(clientData.requestedClasses,"classId",classroomId);
        
        // update the requestedCOnusltaion for the Client 
        var clientref = db.collection(pathForClient).doc(ClientDocName)
        batch.set(clientref,{"requestedClasses":requestedClientClassmodified},{merge:true});

        //Update the root level classroom
        var Classroompath = 'classrooms/'+classroomId+'/members/';
        var classroomDocName = 'data';

        var classroomref = db.collection(Classroompath).doc(classroomDocName);

        var classroomDataRaw = await classroomref.get();
        var classroomData = classroomDataRaw.data();

        var requestedMembersModified = removeElement(classroomData.requestedMembers,"uid",clientId);
        batch.set(classroomref,{"requestedMembers":requestedMembersModified},{merge:true});

        // Performing Atomic Writes
        await batch.commit();

        return res.status(200).json("Success");

    }catch (error) { return res.status(501).json(error.message); }


});



export {router as rejectRequest};