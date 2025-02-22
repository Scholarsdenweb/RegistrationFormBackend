const Employee = require("../models/Employee");
const { verifyToken, checkRole } = require("../middleware/authentication");
const multer = require('multer');
const storage = multer.memoryStorage(); // Storing file in memory, you can use diskStorage if needed
const express = require("express");
const processCSVAndGenerateReportCards = require("../utils/ResultGenerator");
const router = express.Router();
const path = require('path');


// Initialize express app


const cloudinary = require('cloudinary').v2;
require('dotenv').config();

router.get("/", verifyToken("hr"), checkRole(["hr"]), async (req, res) => {
    const employees = await Employee.find().select("-password");
    res.send(employees);
});
router.post("/addEmployee", verifyToken, checkRole(["hr"]), async (req, res) => {
    const { name, email, role, password } = req.body;
    const employee = await Employee.findOne({ email: email });

    if (employee) {
        return res.status(400).send("Employee already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployee = await new Employee({
        name,
        email,
        role,
        password: hashedPassword
    });

    const token = jwt.sign({ _id: newEmployee._id, role: newEmployee.role }, JWT_SECRET);

    res.status(200).send({
        token, employee: {
            name: newEmployee.name,
            email: newEmployee.email,
            role: newEmployee.role,
            task: newEmployee.task,
            profile: newEmployee.profile
        }
    });


})


router.patch("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    console.log("ID", id)
    const employee = await Employee.findById(id);

    if (!employee) {
        return res.status(400).send("Employee not found");
    }

    employee.name = name ? name : employee.name;
    employee.email = email ? email : employee.email;
    employee.role = role ? role : employee.role;
    employee.password = password ? password : employee.password;

    const updatedEmployee = await employee.save();

    res.send(updatedEmployee);
})

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
        return res.status(400).send("Employee not found");
    }

    res.send({ name: employee.name, email: employee.email });
})

// Configure Cloudinary


// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Renaming file
    },
  }),
  fileFilter: (req, file, cb) => {
    const filetypes = /csv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only CSV files are allowed!"));
  },
});


// Helper function to validate file
const isFileValid = (file) => {
  return file && file.mimetype === 'text/csv';
};

// Helper function to upload file to Cloudinary

// Helper function to generate PDFs


// Route: Generate result cards

// app.post("/api/employees/generateResult", upload.single("csvFile"), (req, res) => {
//   console.log("Uploaded File:", req.file);
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded!" });
//   }
//   res.json({ message: "File uploaded successfully!", file: req.file.filename });
// });


router.post("/generateResult", upload.single("csvFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploaded File:", req.file);

    // ✅ Pass the correct file path to the processing function
    const filePath = req.file.path;

    await processCSVAndGenerateReportCards(filePath);

    res.status(200).json({ message: "Result cards generated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.post('/generateResult', upload.single('csvFile'), async (req, res) => {
//     console.log("Uploaded File:", req.file);

//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const filePath = req.file; // Correct way to get the file path

//     console.log('Uploaded File:', req.file);

//     await processCSVAndGenerateReportCards(filePath);

//     res.status(200).json({ message: 'Result cards generated successfully' });

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// router.post('/generateResult', upload.single('file'), async (req, res) => {
//   try {
//     const file = req.body.path;

//     console.log('File: qqq', file);
//     console.log('File qqq :', req.body);

//     // if (!isFileValid(file)) {
//     //   return res.status(400).json({ error: 'Invalid file format. Only CSV files are allowed.' });
//     // }

//     await processCSVAndGenerateReportCards(file);

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


module.exports = router;