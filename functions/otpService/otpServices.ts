const axios = require('axios');
const  express = require("express");
 //import {otpVendorRequest} from "../Models/OtpModels";

var sendOtpToClient =function(postData){

    
    var clientServerOptions = {
        url: 'https://api.mylogin.co.in/api/v2/SendSMS',
        data: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    return axios(clientServerOptions);

}

var createOtpRequestBody = function(phone,otp){

    var requestBody =
    {
        "ApiKey":"fs3NSo3YfB0kkEoaa+G0y3gD45CMuxJaOdUQI+1O9Zw=",
        "ClientId": "208026c5-ff69-45cf-8032-e644a4d28d18",
        "SenderId": "SORTLF",
        "MobileNumbers": phone,
        "Message":"Welcome to sort it family, your OTP is "+ otp+", don't share this to outsiders"
    };
    console.log(requestBody);
    return requestBody;
    
}

exports.createOtpRequestBody = createOtpRequestBody;
exports.sendOtpToClient = sendOtpToClient;
