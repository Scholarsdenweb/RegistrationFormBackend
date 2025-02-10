const express = require("express");
const router = express.Router();
const axios = require('axios');

const {
  getStudents,
  addStudents,
  editStudent,
  deleteStudent,
  getStudentsById,
  getAdmitCard,
  resultDetails,
  uploadStudentResult
} = require("../controllers/Students");



const { verifyToken, checkRole } = require("../middleware/authentication");
const OtpStore = require("../models/OtpStore");

router.get('/', verifyToken("hr"), checkRole(["hr"]), getStudents);
router.post("/addStudent", verifyToken("hr", "Student"), checkRole(["hr"]), addStudents);

router.get('/getStudentsById', verifyToken("Student"), checkRole(["Student"]), getStudentsById);

router.patch("/editStudent", verifyToken(["Student"]), checkRole(["Student"]), editStudent);
router.patch("/editStudent/:student_id", verifyToken(["hr", "Student"]), checkRole(["hr"]), editStudent);
router.delete("/deleteStudent/:student_id", verifyToken("hr"), checkRole(["hr"]), deleteStudent);


router.get("/getAdmitCard", verifyToken("Student"), checkRole(["Student"]), getAdmitCard);


router.get("/getResultDetails", verifyToken("Student"), checkRole("Student"), resultDetails);


router.post("/sendVerification", async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    console.log("req.body from sendVerification", req.body)


    if (!mobileNumber) {
      return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    }

    console.log(mobileNumber);
    console.log(process.env.FAST2SMS_API_KEY);

    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    const options = {
      method: 'POST',
      url: 'https://www.fast2sms.com/dev/bulkV2',
      headers: {
        'authorization': `${process.env.FAST2SMS_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: new URLSearchParams({
        variables_values: otp,
        route: 'otp',
        numbers: mobileNumber,
      }),
    };
    let otpStoreData;
    // Make the API request to Fast2SMS
    const response = await axios.post(options.url, options.data, { headers: options.headers });

    console.log(response.data);

    // Store the OTP in the database
    const existingOtp = await OtpStore.findOne({ mobileNumber });

    if (existingOtp) {
      // Update the existing document if an OTP is already stored for this number
      existingOtp.otp = otp;
      existingOtp.createdAt = new Date();
      await existingOtp.save();
    } else {
      // Create a new document if no OTP exists for this number
      otpStoreData = await OtpStore.create({ otp, mobileNumber });
    }

    // Construct and send a custom response
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      smsResponse: response.data, // Include the response from Fast2SMS
      otpStoreData
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP.',
      error: error.message, // Include the error message for easier debugging
    });
  }
});



router.post("/verifyNumber", async (req, res) => {
  const { mobileNumber, otp } = req.body;
  try {

    const existingOtp = await OtpStore.findOne({ mobileNumber });

    if (!existingOtp) {
      return res.status(400).json({ success: false, message: 'Invalid mobile number.' });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    const currentTime = new Date();

    if (currentTime > existingOtp.createdAt + 300) {
      return res.status(400).json({ success: false, message: 'OTP has expired.' });
    }
    const deleteData = await OtpStore.deleteOne({ mobileNumber });
    return res.status(200).json({ success: true, message: 'OTP verification successful.' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Failed to verify OTP.', error: error.message });
  }
})





router.post("/uploadStudentResult", verifyToken("Hr"), checkRole(["Hr"]), uploadStudentResult);

router.post("/")

module.exports = router;
