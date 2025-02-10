const express = require("express");

const router = express.Router();
const Result = require("../models/Result");
const processCSVAndGenerateAdmitCards = require("../controllers/result");


router.post("/addResult", async (req, res) => {
    try {

        const {file} =  req.body;
        if(!file){
            return res.status(400).send("File not found");
        }
        if(!isFileValid(file)){
            return res.status(400).send("File is empty");
        }
        processCSVAndGenerateAdmitCards(file);

        
        const result = await Result.create(req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})






module.exports = router;