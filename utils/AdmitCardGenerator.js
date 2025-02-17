const fs = require("fs");

const cloudinary = require("cloudinary").v2;

require("dotenv").config();
const puppeteer = require('puppeteer');
const puppeteerCore = require("puppeteer-core");
const chromium = require("@sparticuz/chromium-min");
const path = require('path');


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to check if the file is valid (non-empty)
const isFileValid = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size > 0;
  } catch (error) {
    console.error("Error checking file size:", error);
    return false;
  }
};

const generateAdmitCardPDF = async (data, filePath) => {



  console.log("data form generateAdmitCardPDF", data);


  let browser = null;
  try {
    if (process.env.NODE_ENV === 'production') {
      // Configure the version based on your package.json (for your future usage).
      const executablePath = await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar')
      browser = await puppeteerCore.launch({
        executablePath,
        // You can pass other configs as required
        args: chromium.args,
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport
      })
    } else {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    }

    const page = await browser.newPage();
    const logoPath = path.resolve(__dirname, 'SDATLogo.png');
    const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
    const logoDataUrl = `data:image/png;base64,${logoBase64}`;

    const htmlContent =
      `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background-color: #f7f7f7;
        }
        .admit-card {
          width: 800px;
          margin:  auto;
          padding: 20px 40px;
          background-color: #c61d23;
          color: white;
          border: 2px solid #000;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          font-family: "Arial", sans-serif;
          font-weight: 100;
          letter-spacing: 1px;
        }
  
        .admit-card .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 28px;
          font-weight: bold;
        }
  
        .admit-card .stream-section,
        .admit-card .class-section {
          display: flex;
          font-style: oblique;
          gap: 20px;
          align-items: center;
        }
  
        .admit-card .stream-section input,
        .admit-card .class-section input {
          height: 20px;
          width: 20px;
          outline: 1px solid black;
        }
  
        .mainStream input[type="checkbox"],
        .mainClass input[type="checkbox"] {
          margin-left: 6px;
        }
  
        .admit-card .stream-section .mainStream,
        .admit-card .class-section .mainClass {
          display: flex;
          margin: 10px 0;
          justify-content: center;
          align-items: center;
        }
  
        .admit-card .details-section {
          margin-top: 20px;
          font-style: oblique;
        }
  
        .admit-card .details-section label {
          display: inline-block;
          width: 200px;
          margin-bottom: 10px;
        }
  
        .admit-card .photo-section {
          border: 2px dashed white;
          padding: 10px;
          width: 150px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 100;
          color: gray;
          text-align: center;
          background-color: #ffffff;
        }
  
        .admit-card .footer {
          font-size: 13px;
          line-height: 1.1rem;
          text-align: center;
          margin-top: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
          word-spacing: 2px;
        }
  
        .mainSection {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 20px;
        }
        .logo {
          width: 20%;
          height: 20%;
        }
      </style>
    </head>
    <body>
      <div class="admit-card">
        <div class="header">
         <img class="logo" src="${logoDataUrl}" alt="Logo" />
          <h5>ACKNOWLEDGEMENT SLIP / ADMIT CARD</h5>
        </div>
        <div class="mainSection">
          <div class="info">
            <div class="stream-section">
              <label>Stream:</label>
              <div class="mainStream">
                <label> Medical </label>
                <input type="checkbox" id="medical" ${data.stream === 'Medical' ?
        'checked' : ''}/>
              </div>
  
              <div class="mainStream">
                <label>Engineering</label> 
                <input type="checkbox" id="engineering"
                ${data.stream === 'Engineering' ? 'checked' : ''}/>
              </div>
              <div class="mainStream">
                <label>Foundation</label>
                <input type="checkbox" id="foundation" ${data.stream ===
        'Foundation' ? 'checked' : ''}/>
              </div>
            </div>
            <div class="class-section">
            <label>Class:</label>
              ${['V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map(classLevel => `
                <div class="mainClass">
                <label
                >${classLevel}</label>
                 <input type="checkbox"
                id="class-${classLevel.toLowerCase()}" ${data.class === classLevel
            ? 'checked' : ''}/>
                </div>
                
                
              `).join('')}
            </div>
            <div class="details-section">
             <label>Registration No:</label>
              <span>${data.Registration}</span>
              <br />
              <label>Student's Name:</label>
              <span>${data.studentName}</span>
              <br />
              <label>Father Name: </label>
              <span> ${data.fatherName}</span>
              <br />
              <label>Exam Date:</label>
              <span>${data.examDate}</span>
              <br />
              <label>Exam Time:</label>
              <span>${data.examTime}</span>
              <br />
             <label>Center Name:</label>
              <span>${data.CenterName}</span>
              <br />
              <label>Center Address:</label>
              <span>${data.CenterAddress}</span>
              <br />
              
            </div>
          </div>
          <div class="photo-section">
            <span>Paste a Recent Photograph</span>
          </div>
        </div>
        <div class="footer">
          SD House (Corporate Office): Sai Mandir Road, Building 1, Building 2,
          and Building 4: Near Qila, Kanth Road.
          <br />
          Contact: +91 8126555222 / 333 | www.scholarsden.in / scholarsden
        </div>
      </div>
    </body>
  </html>
  `



    await page.setContent(htmlContent);
    await page.pdf({ path: filePath, printBackground: true });
  } catch (error) {
    console.log({ error });
  } finally {
    await browser.close();

  }
};


const uploadToCloudinary = async (filePath, rollNumber) => {
  try {
    const folder = "admit_cards"; // Folder name in Cloudinary
    const publicId = `${folder}/${rollNumber}`; // Store the file with the student's roll number as the name

    console.log(`Uploading ${filePath} to Cloudinary...`);
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw", // Specify 'raw' for non-image files like PDFs
      public_id: publicId,  // Set custom public ID for the file

    });
    console.log(`Uploaded to Cloudinary: ${result.url}`);
    return result.url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

// Function to process CSV data and generate admit cards
const processHTMLAndGenerateAdmitCards = async (student) => {
  console.log("student form processCSVAndGenerateAdmitCards", student);


  const pdfFilePath = `./admit_card_${student.studentId}.pdf`;
  // const date = new Date(student.dob);

  // // Format the date to dd-mm-yy
  // const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
  // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  // const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year

  // const formattedDate = `${day}-${month}-${year}`;

  // console.log(formattedDate);

  const studentData = {
    studentName: student.name,
    Registration: student.studentId,
    class: student.class,
    stream: student.stream,
    fatherName: student.FatherName,
    examDate: student.examDate,
    examTime: student.examTime,
    CenterName: student.CenterName,
    CenterAddress: student.CenterAddress,


  };
  console.log("studentData after the function", studentData);

  try {
    // Choose between generating the PDF from HTML or PDFKit

    await generateAdmitCardPDF(studentData, pdfFilePath); // HTML-to-PDF example

    console.log(`Generated admit card for Roll Number: ${student.studentId}`);

    // Ensure that the file is valid before uploading
    if (isFileValid(pdfFilePath)) {
      // Upload the admit card to Cloudinary
      const url = await uploadToCloudinary(pdfFilePath, student.studentId);
      console.log(`Admit card URL for ${student.studentId}: ${url}`);
      return url;
    } else {
      console.log(`Generated PDF for ${student.studentId} is empty or invalid.`);

    }


    // Optionally, delete the local file after upload

  } catch (error) {
    console.error(`Error processing admit card for Roll Number: ${student.studentId}`, error);
    resizeBy.status(500).json({ message: "Error processing admit card", error });
  } finally {
    if (fs.existsSync(pdfFilePath))
      fs.unlinkSync(pdfFilePath);

  }

};







module.exports = processHTMLAndGenerateAdmitCards;