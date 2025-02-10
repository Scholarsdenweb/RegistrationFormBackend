const Employee = require("../models/Employee");
const { verifyToken, checkRole } = require("../middleware/authentication");
const multer = require('multer');
const storage = multer.memoryStorage(); // Storing file in memory, you can use diskStorage if needed
const express = require("express");
const processCSVAndGenerateResulrCards = require("../utils/ResultGenerator");
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
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const filetypes = /csv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only CSV files are allowed!'));
  },
});

// Helper function to validate file
const isFileValid = (file) => {
  return file && file.mimetype === 'text/csv';
};

// Helper function to upload file to Cloudinary

// Helper function to generate PDFs


// Route: Generate result cards
router.post('/generateResult', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!isFileValid(file)) {
      return res.status(400).json({ error: 'Invalid file format. Only CSV files are allowed.' });
    }

    processCSVAndGenerateResulrCards(file);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;