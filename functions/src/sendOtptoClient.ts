const  express = require("express");
const router = express.Router();
const otpService = require('../otpService/otpServices.ts');

router.post('/sendOtp/', async (req: any , res: any ) => {
    
    try{

        var phoneNo = req.body.phoneNo as string;
        if(!(phoneNo.length === 12 && isNumeric(phoneNo))){
            return res.status(400).json({"message":"Invalid Phone Number","otp":""});
        }
        if(!(phoneNo.substring(0,2)==='91')){
            return res.status(400).json({"message":"Invalid Country Code","otp":""});
        }

        var otp = "";
        //create an otp of 6 letters
        for(var i=0;i<6;i++){
            otp = otp + Math.floor(Math.random() * 10);
        }

        console.log(otp);

        var Rawresult = await otpService.sendOtpToClient(otpService.createOtpRequestBody(phoneNo,otp));
        var result = Rawresult.data;
         //console.log(result);
        if(result.Data[0].MessageErrorCode === 0){
            // Sucess Scenario
            return res.status(200).json({"message":result.Data[0].MessageErrorDescription,"otp":otp});
        }
        else{
            return res.status(500).json({"message":result.Data[0].MessageErrorDescription,"otp":""});
        }   
        

    }catch (error) { return res.status(501).json({"message":error.message,"otp":""}); }


});


function isNumeric(num: any){
    return !isNaN(num);
  }

export { router as sendOtp };