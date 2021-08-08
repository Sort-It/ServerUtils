import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const  express = require("express");
const  cors = require("cors");
import { sendOtp } from "./sendOtptoClient";
import { notifyExpert } from "./notifyExpertConsultation";

const app = express();
app.use(cors({origin: true }));
app.use(sendOtp);
app.use(notifyExpert);
exports.serverutility = functions.https.onRequest(app);
