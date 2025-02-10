const mongoose = require('mongoose');

const batchRelatedDetailsSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    classForAdmission: {type: String, required: true},
    preferredBatch: { type: String, required: true },
    subjectCombination: { type: String},
});

const BatchRelatedDetails = mongoose.model('BatchRelatedDetails', batchRelatedDetailsSchema);
module.exports = BatchRelatedDetails;
