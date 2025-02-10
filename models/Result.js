const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    studentsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    examName: {
        type: String,
        required: true,
    },
    examDate: {
        type: Date,
        required: true,
    },
    subject: [{
        type: String,
        required: true,
    }],
    
    totalMarks: {
        type: Number,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
});


const Result = mongoose.model("Result", resultSchema);
module.exports = Result;