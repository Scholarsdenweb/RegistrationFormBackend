const fs = require("fs");
const puppeteer = require('puppeteer');
const puppeteerCore = require("puppeteer-core");
const chromium = require("@sparticuz/chromium-min");
const csv = require("csv-parser");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const path = require('path');


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to check if the file is valid (non-empty)
const isFileValid = (pdfFilePath) => {
  try {
    const stats = fs.statSync(pdfFilePath);
    return stats.size > 0;
  } catch (error) {
    console.error("Error checking file size:", error);
    return false;
  }
};





const 
generateReportCardPDF = async (data, pdfFilePath) => {




console.log("Generating Report Card PDF...", pdfFilePath);

  // const subjects = data.subjects.filter((subject) => subject !== undefined);





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
    console.log("Generating Report Card PDF...", page);


    // Convert images to base64 for embedding
    const getImageAsBase64 = (imagePath) => {
      const logoPath = path.resolve(__dirname, imagePath);
      const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
      return `data:image/png;base64,${logoBase64}`;

    };

    const logoBase64 = getImageAsBase64("../assets/scholarsden.png");
    const scholarsDenBase64 = getImageAsBase64("../assets/scholarsden.png");
    const callIconBase64 = getImageAsBase64("../assets/callIcon.png");
    const websiteIconBase64 = getImageAsBase64("../assets/website.png");
    const facebookIconBase64 = getImageAsBase64("../assets/facebook.png");
    const youtubeIconBase64 = getImageAsBase64("../assets/youtube.png");
    const twitterIconBase64 = getImageAsBase64("../assets/twitter.png");
    const socialIconBase64 = getImageAsBase64("../assets/social.png");

    const allSubjectName = await data.subjects.map((subject) => subject.name);
    const allSubjectMarks = await data.subjects.map((subject) => subject.obtained);
    const allSubjectFullMarks = await data.subjects.map((subject) => subject.fullMarks);
    const allSubjectAverageMarks = await data.subjects.map((subject) => subject.average);
    const subjectWiseRank = await data.subjects.map((subject) => subject.subjectWiseRank);

    const allSubjectHighestMarks = await data.subjects.map((subject) => subject.highestScore);




    const percentage = ((data.totalMarks[0].value / data.totalMarks[0].obtainedMarks) * 100).toFixed(1);
    const scholarship = ((percentage / 10).toFixed(1) * 10) + 10;




    const tableRows = await data.subjects
      .map(
        (subject) => `
    <tr>
      <td>${subject.name}</td>
      <td>${subject.obtained}</td>
      <td>${subject.fullMarks}</td>
    </tr>`
      )
      .join('');

    const htmlContent = ` 
      <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Report Card</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-3d"></script>
    
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f8f8f8;
        }
    
        .hr {
          border-top: 2px dashed white;
    
          border-bottom: none;
        }
    
    
        .report-card {
          margin: auto;
          background-color: #c91717;
          border: 3px solid #c91717;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          padding: 10px 20px 0px 20px;
          box-sizing: border-box;
        }
    
        .line-text {
        display: flex;
        align-items: center;
        position: relative;
        /* font-family: 'Courier New', Courier, monospace; */
    
        top: 13px;
        /* justify-content: center; */
        color: #c91717;
        font-weight: bold;
        font-size: 24px;
      }
    
      .line-text::before,
      .line-text::after {
        content: '';
        flex: 1;
        height: 2px;
        background-color: #c91717;
      }
    
        .inner-container {
          background-color: white;
          padding: 5px 20px;
        }
    
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .student-info-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0px 10px;
          border: 2px solid #c91717;
          border-top: 0px;
          border-bottom: 0px;
        }
    
        // .header img {
        //   height: 60px;
        // }
    
        .header h1 {
          font-size: 24px;
          color: #c91717;
          text-align: center;
          flex-grow: 1;
        }
    
        .header .paperLogo{
          display: flex;  
          align-items: end;
        }
    
       .logo{
          height: 100px;
        }
    
        .header .exam-date {
          font-size: 14px;
          letter-spacing: 0.5px;
          word-spacing: 0.3px;
          padding-left: 10px;
          padding-bottom: 5px;
          font-style: oblique;
          color: white;
        }
        .yellow-text{
          color: #ffdd00;
        }
    .brand-logo{
    display: flex;
    gap: 20px;
    }
    
        .brand-logo img{
          height: 100px;
          /* display: inline;
          height: 100px; */
        }
    
        .student-details {
          display: flex;
          justify-content: space-between;
        }
    
        .student-info {
          font-size: 14px;
          line-height: 0.7;
        }
    
      
    
        .student-info b{
          color: #c91717;
    
        }
    
        .name{
          font-size: 28px;
          color: #c91717;
          font-weight: 900;
         
    
        }
    
        .black-text-name{
          position: relative;
          border: none;
          color: black;
    
        }
        /* .name span {
          
        } */
        .black-text-name::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 70%;
        height: 0%; /* Covers only the top half */
        border: 2px solid black;
        border-top: none; /* Remove the bottom border */
        box-sizing: border-box;
      }
    
    
        .student-photo {
          width: 100px;
          height: 150px;
          letter-spacing: 1px;
          word-spacing: 2px;
          border: 1px solid rgb(207, 203, 203);
          display: flex;
          background-color: rgb(238, 237, 237);
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 600;
          padding: 20px;
          color: rgb(182, 181, 181);
          text-align: center;
        }
    
        .marks-table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #c91717;
    
          font-size: 12px;
        }
    
       
        .marks-table td {
          text-align: center;
          padding: 6px;
          
          border-top: 1px solid rgb(92, 87, 87);
        }
    
    
    
        .marks-table th {
          text-align: center;
          padding: 6px;
          border-bottom: 1px solid black;
          background-color: white;
          color: #c91717;
          font-weight: 900;
        }
    
        .graphs {
          display: flex;
          flex-wrap: wrap;
          /* gap: 20px; */
          justify-content: center;
          /* margin-top: 10px; */
        }
    
        .graph-container-doughnut{
          display: flex;
          gap: 60px;
          justify-content: center;
          width: 100%;
        }
        .graph-container-bar{
          display: flex;
           gap: 60px;
          justify-content: center;
          width: 100%;
        }
    
    
         .headingAndGraph{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    
        gap: 2px;
      }
    
      .headingAndGraph h4{
      margin-bottom: 0px;
      padding: 0px;
        text-align: center;
        width: 100%
      }
    
    
        .graph-container-pie {
          width: 70%;
          height: 145px;
        }
        .graph-container {
          // width: 48%;
          height: 200px;
        }
    
    
        .social-media-icons{
          display: flex;
          /* justify-content: space-around; */
        }
        .social-media-div{
        width: 100%;
          color: white;
          font-weight: 900;
          padding: 10px 17px;
          display: flex;
    
          align-items: center;
          justify-content: center;
          border-right: 1px dashed rgb(184, 121, 121);
          border-bottom: 1px dashed rgb(184, 121, 121);
          
        }
        .social-media-div span{
          display: flex;
          align-items: center;
          justify-content: center;
          /* gap: 10px; */
        }
        .social-media-div-last{
          border-right: none;
        }
    
    .social-media-div img{
    width: 20px;
    height: 20px;
    margin-right:5px;
    }
    
        .redText{
          color:#c91717;
          font-size: 14px;
          font-weight: 900;
        }
    
        .footer {
          font-size: 12px;
          display: flex;
          margin-top: 6px;
          margin-bottom: 3px;
          justify-content: center;
          line-height: 1rem;
          color: white;
          text-align: center;
          font-weight: 700;
          letter-spacing: 0.1px;
          /* word-spacing: px; */
        }
      </style>
    </head>
    <body>
      <div class="report-card">
        <!-- Header -->
        <div class="header">
          <div class="paperLogo">
            <img class="logo" src=${logoBase64} alt="Logo" />
            <div class="exam-date">
              Examination Date<br><span class="yellow-text"> 20<sup>th</sup> October '24</span>
            </div>
          </div>
          <div class="brand-logo">
            <img src=${scholarsDenBase64} alt="Logo" />
            <img src=${scholarsDenBase64} alt="Logo" />
          </div>
        </div>
    
        <!-- Student Details -->
        <div class="student-details">
          <div class="inner-container">
              <div class="line-text">
                REPORT CARD 2024
              </div>
           <div class="student-info-container">
              <div class="student-info">
                <p class="name"><span class="black-text-name">${data.studentFirstName}</span>  ${data.studentLastName}</p>
                <p><b>Registration No.:</b> ${data.Registration}</p>
                <p><b>Father's Name:</b>${data.Father}</p>
                <p><b>Class:</b> ${data.Class}</p>
                <p><b>Scholarship:</b> ${scholarship}% (Valid till 25th Nov '25)</p>
                <p><b>Rank:</b> 1</p>
                <p><b>Percentage:</b>${percentage}%</p>
              </div>
              <div class="student-photo">PHOTO NOT AVAILABLE</div>
            </div>
    
            <!-- Marks Table -->
            <table class="marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Full Marks</th>
                </tr>
              </thead>
              <tbody>
               ${tableRows}
                <tr class="redText">
                  <td><b>Total</b></td>
                  <td><b>${data.totalMarks[0].value}</b></td>
                  <td><b>${data.totalMarks[0].obtainedMarks}</b></td>
                </tr>
              </tbody>
            </table>
    
            <!-- Graphs Section -->
            <div class="graphs">
              <div class="graph-container-doughnut">
    
          
          <div class="headingAndGraph">
                <h4>
                  Subjectwise Breakup of Full Marks
                </h4>
    
    
    
              <div class="graph-container-pie">
                <canvas id="fullMarksChart">
                
                </canvas>
    
                </div>
              </div>
              <div class="headingAndGraph">
           <h4>
             Subjectwise Breakup of Full Marks
           </h4>
              <div class="graph-container-pie">
                <canvas id="obtainedMarksChart"></canvas>
                </div>
              </div>
            </div>
    
            <div class="graph-container-bar">
    
               <div class="headingAndGraph">
                <h4>
                  Subjectwise Breakup of Full Marks
                </h4>
    
    
              <div class="graph-container">
                <canvas id="comparisonChart"></canvas>
              </div>
              </div>
    
                 <div class="headingAndGraph">
                <h4>
                  Subjectwise Breakup of Full Marks
                </h4>
              <div class="graph-container">
                <canvas id="rankChart"></canvas>
              </div>
              </div>
    
            </div>
    
            </div>
          </div>
        </div>
    
        <!-- Social Media Information -->
        <div class="social-media-info">
            <div class="social-media-icons">
              <div class="social-media-div">
                
                  <!-- <img src="https://via.placeholder.com/50x50" alt="Facebook" /> -->
                  <span>
                    <img src=${callIconBase64} alt="">
                    
                    +91 8126555222/333</span>
              
              </div>
              <div class="social-media-div">
                <span>
                  
                 <img src=${websiteIconBase64} alt=""> 
                  www.scholarsden.in</span>
              </div>
              <div class="social-media-div social-media-div-last">
                
                
                <img src=${facebookIconBase64} alt="">
                <img src=${youtubeIconBase64} alt="">
                <img src=${twitterIconBase64} alt="">
                <img src=${socialIconBase64} alt="">
                
                <span>
                  
                  scholarsden</span>
              </div>
            </div>
          </div>
            
    
    
        <!-- Footer -->
        <div class="footer">
        <div>
          BUILDING 1, 2 & 4: Near Qila, Kanth Road, Moradabad (UP) 244001<br />
          SD House (Corporate Office): Sai Mandir Road, Deen Dayal Nagar-I,
          Moradabad (UP) 244001
        </div>
        </div>
      </div>
    </div>
    
    
       <script>
    
       const allSubjectName = ${JSON.stringify(allSubjectName)};
       const allSubjectMarks = ${JSON.stringify(allSubjectMarks)};
       const allSubjectFullMarks = ${JSON.stringify(allSubjectFullMarks)};
       const allSubjectAverageMarks = ${JSON.stringify(allSubjectAverageMarks)};
       const subjectWiseRank = ${JSON.stringify(subjectWiseRank)};
    
      
    
    // Full Marks 3D Ring Chart
    const fullMarksCtx = document.getElementById("fullMarksChart").getContext("2d");
    new Chart(fullMarksCtx, {
    type: "doughnut",
    data: {
      labels: allSubjectName,
      datasets: [
        {
          data: allSubjectFullMarks,
          backgroundColor: [
            "#c61d23",
            "#302e2f",
            "#e6e7e8",
            "#ffdd00",
            "#FFCE56",
            "#FF9F40",
          ],
        },
      ],
    },
    options: {
      cutout: "40%",
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.8, // Adjusted aspect ratio to make the chart smaller
      plugins: {
        chartJsPlugin3d: {
          enabled: true,
          perspective: 60,
          depth: 15,
        },
        legend: {
          position: "right",
          labels: {
            boxWidth: 12,
          },
        },
      },
    },
    });
    
    // Obtained Marks 3D Ring Chart
    const obtainedMarksCtx = document
    .getElementById("obtainedMarksChart")
    .getContext("2d");
    new Chart(obtainedMarksCtx, {
    type: "doughnut",
    data: {
      labels: allSubjectName,
      datasets: [
        {
          data: allSubjectMarks,
          backgroundColor: [
            "#c61d23",
            "#302e2f",
            "#e6e7e8",
            "#ffdd00",
            "#FFCE56",
            "#FF9F40",
          ],
        },
      ],
    },
    options: {
      cutout: "40%",
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.8, // Adjusted aspect ratio to make the chart smaller
      plugins: {
        chartJsPlugin3d: {
          enabled: true,
          perspective: 60,
          depth: 15,
        },
        legend: {
          position: "right",
          labels: {
            boxWidth: 12,
            padding: 10,
          },
        },
      },
    },
    });
    
    
    
    
    // Comparison Chart (3D Bar)
    const comparisonCtx = document.getElementById("comparisonChart").getContext("2d");
    new Chart(comparisonCtx, {
    type: "bar",
    data: {
      labels: allSubjectName,
      datasets: [
        {
          label: "Marks Obtained",
          data: allSubjectMarks,
          backgroundColor: "#c61d23",
        },
        {
          label: "Full Marks",
          data: allSubjectFullMarks,
          backgroundColor: "#ffdd00",
        },
        { 
          label: "Average Marks",
          data: allSubjectAverageMarks,
          backgroundColor: "#e6e7e8clear",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.5, // Adjust the chart's height-width ratio
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 12,
            padding: 10,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 10,
          },
        },
      },
    },
    });
    
    // Rank Chart (Line Chart Example)
    const rankCtx = document.getElementById("rankChart").getContext("2d");
    new Chart(rankCtx, {
    type: "line",
    data: {
      labels: allSubjectName,
      datasets: [
        {
          label: "Rank Progression",
          data: subjectWiseRank,
          borderColor: "#c61d23",
          backgroundColor: "rgba(198, 29, 35, 0.5)",
          fill: true,
          tension: 0.4, // Smooth curves
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
    });
    
    
      </script>
    </body>
    </html>
    
    
    
    
      `;






    await page.setContent(htmlContent, { waitUntil: 'networkidle2' });

    // Wait for charts to render
    await page.waitForFunction(() => {
      const canvas = document.getElementById('comparisonChart');
      return canvas && canvas.getContext('2d') && canvas.toDataURL();
    });

    await page.evaluate(() => {
      return new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
    });

    // await page.waitForTimeout(2000); // Additional delay for rendering


    // Capture a screenshot for debugging
    // await page.screenshot({ path: 'debug_screenshot.png', fullPage: true });

    // Generate the PDF
    await page.pdf({ path: pdfFilePath, format: 'A4', printBackground: true });
    console.log("PDF generated successfully.");
    await browser.close();
  } catch (error) {
    console.log("Error generating PDF:", error);
  }

};




// Function to upload a file to Cloudinary
const uploadToCloudinary = async (pdfFilePath, rollNumber) => {
  try {
    const folder = "report_cards"; // Folder name in Cloudinary
    const publicId = `${folder}/${rollNumber}`; // Store the file with the student's roll number as the name

    console.log(`Uploading ${pdfFilePath} to Cloudinary...`);
    const result = await cloudinary.uploader.upload(pdfFilePath, {
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

// Function to process CSV data and generate report cards
const processCSVAndGenerateReportCards = async (csvFilePath) => {
  const students = [];

  // Read CSV file and parse data
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      students.push(row);
    })
    .on("end", async () => {


      for (const student of students) {
        const pdfFilePath = `./reportCards/report_card_${student["Roll No"]}.pdf`;



        const allKeys = Object.keys(student);


        // Prepare student data for report card




        // console.log("Rank", student['Rank']);

        const studentData = {
          'Rank': '1',
          'Class': '8th',
          'Roll No': '202508004',
          'Candidate Name': 'Sharanya Kulkarni',
          'Father Name': 'Mr. Guru Raj Kulkarni',
          'Phy(10)': '5',
          'Phy Average': '5',
          'Phy_Highest Score': '7',
          'Phy_Subjectwise_Rank': '3',
          'Chem(10)': '6',
          'Chem Average': '5',
          'Chem_Highest Score': '6',
          'Chem_Subjectwise_Rank': '1',
          'Bio(10)': '6',
          'Bio Average': '4',
          'Bio_Highest Score': '6',
          'Bio_Subjectwise_Rank': '1',
          'Math(15)': '13',
          'Math Average': '9',
          'Math_Highest Score': '13',
          'Math_Subjectwise_Rank': '1',
          'SST(15)': '11',
          'SST Average': '8',
          'SST_Highest Score': '13',
          'SST_Subjectwise_Rank': '2',
          'MAT(50)': '29',
          'MAT Average': '23',
          'MAT_Highest Score': '29',
          'MAT_Subjectwise_Rank': '1',
          'Total(150)': '70'
        };

        // Function to extract names and numbers
        function extractData(studentData) {
          let names = [];
          let numbers = [];
          let totalMarks = [];

          // Iterate through the data object
          for (let key in studentData) {
            let value = studentData[key];

            // Check if the key contains a number in parentheses (indicating marks/subjects)
            const match = key.match(/\((\d+)\)/);

            if (key === 'Total(150)') {
              totalMarks.push({ key: key.split("(")[0], obtainedMarks: match[1], value });
            }

            else if (match) {
              // If the key contains a number in parentheses, extract the number and store it as a number
              numbers.push({ key: key.split("(")[0], number: match[1], value });
            } else {
              // If it's not one of the excluded keys, store it as a name
              names.push({ key, value });
            }
          }

          return { names, numbers, totalMarks };
        }

        // Extracted studentData
        const { names, numbers, totalMarks } = await extractData(studentData);

        // Output names


        // names.forEach(item => console.log(`${item.key}: ${item.value}`));



        // Output numbers
        // numbers.forEach(item => console.log(`${item.key} -> Number: ${item.number}, Value: ${item.value}`));



        // numbers [
        //   { key: 'Phy(10)', number: '10', value: '5' },
        //   { key: 'Chem(10)', number: '10', value: '6' },
        //   { key: 'Bio(10)', number: '10', value: '6' },
        //   { key: 'Math(15)', number: '15', value: '13' },
        //   { key: 'SST(15)', number: '15', value: '11' },
        //   { key: 'MAT(50)', number: '50', value: '29' },
        //   { key: 'Total(150)', number: '150', value: '70' }
        // ]

        // names [
        //   { key: 'Rank', value: '1' },
        //   { key: 'Class', value: '8th' },
        //   { key: 'Roll No', value: '202508004' },
        //   { key: 'Candidate Name', value: 'Sharanya Kulkarni' },
        //   { key: 'Father Name', value: 'Mr. Guru Raj Kulkarni' },
        //   { key: 'Phy Average', value: '5' },
        //   { key: 'Phy_Highest Score', value: '7' },
        //   { key: 'Phy_Subjectwise_Rank', value: '3' },
        //   { key: 'Chem Average', value: '5' },
        //   { key: 'Chem_Highest Score', value: '6' },
        //   { key: 'Chem_Subjectwise_Rank', value: '1' },
        //   { key: 'Bio Average', value: '4' },
        //   { key: 'Bio_Highest Score', value: '6' },
        //   { key: 'Bio_Subjectwise_Rank', value: '1' },
        //   { key: 'Math Average', value: '9' },
        //   { key: 'Math_Highest Score', value: '13' },
        //   { key: 'Math_Subjectwise_Rank', value: '1' },
        //   { key: 'SST Average', value: '8' },
        //   { key: 'SST_Highest Score', value: '13' },
        //   { key: 'SST_Subjectwise_Rank', value: '2' },
        //   { key: 'MAT Average', value: '23' },
        //   { key: 'MAT_Highest Score', value: '29' },
        //   { key: 'MAT_Subjectwise_Rank', value: '1' }
        // ]




        let checkMarksData = await numbers.map((item, index) => {

          return {
            name: item.key,
            obtained: item.value,
            average: student[item.key + " Average"],
            highestScore: student[item.key + "_Highest Score"],
            subjectWiseRank: student[item.key + "_Subjectwise_Rank"],
            fullMarks: item.number,
          }
        })


        let data = {
          studentFirstName: student['Candidate Name'].split(" ")[0],
          studentLastName: student['Candidate Name'].split(" ")[1],
          Registration: student['Roll No'],
          Rank: student['Rank'],
          Scholarship: student.Scholarship,
          Father: student['Father Name'],
          Class: student["Class"],
          Rank: student[allKeys[0]],
          subjects: checkMarksData,
          totalMarks: totalMarks,


          // [
          //   // student.Math && { name: "Mathematics", obtained: student.Math, Average: student['Math Average'], highestScore: student['Math_Highest Score'], fullMarks: 25 },
          //   // student.Phy && { name: "Science", obtained: student.Phy,  Average: student['Math Average'], highestScore: student['Math_Highest Score'],  fullMarks: 25 },
          //   // student.Eng && { name: "English", obtained: student.Eng,  Average: student['Math Average'], highestScore: student['Math_Highest Score'], fullMarks: 25 },
          //   // student.His && { name: "History", obtained: student.His,  Average: student['Math Average'], highestScore: student['Math_Highest Score'], fullMarks: 25 },
          //   // student.SST && { name: "Social Science", obtained: student.SST,  Average: student['Math Average'], highestScore: student['Math_Highest Score'], fullMarks: 25 },
          //   // student.Chem && { name: "Chemistry", obtained: student.Chem,  Average: student['Math Average'], highestScore: student['Math_Highest Score'], fullMarks: 25 },
          //   // student.Bio && { name: "Biology", obtained: student.Bio,  Average: student['Math Average'], highestScore: student['Math_Highest Score'], fullMarks: 25 },
          //   // student.MAT && { name: "MAT", obtained: student.MAT,  Average: student['Math Average'], highestScore: student['Math_Highest Score'], fullMarks: 25 },

          // ]
        }











        try {


          console.log(`Processing report card for pdfFilePath`, pdfFilePath);

          await generateReportCardPDF(data, pdfFilePath);


console.log(`Generated PDF check pdfFilePath`, pdfFilePath);
          // Ensure that the file is valid before uploading
          if (isFileValid(pdfFilePath)) {
            try {
              // Upload the report card to Cloudinary

              const url = await uploadToCloudinary(pdfFilePath, student["Roll No"]);
              console.log("Report card uploaded to Cloudinary:", url);
            } catch (error) {
              console.error(`Error uploading report card for Roll Number: ${student["Roll No"]}`, error);
            }
          } else {
            console.log(`Generated PDF for ${student["Roll No"]} is empty or invalid.`);
          }

          // Optionally, delete the local file after upload
        } catch (error) {
          console.error(`Error processing report card for Roll Number: `, error);
        }
        // finally {
        //   if (fs.existsSync(pdfFilePath)) {
        //     console.log(`Deleting ${pdfFilePath}...`);

        //     fs.unlinkSync(pdfFilePath);
        //   }

        // }
      }
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
    });
};

// Run the script
const csvFilePath = "./SDATResult.csv"; // Path to your CSV file
// const csvFilePath = "./Jatin.csv"; // Path to your CSV file
// processCSVAndGenerateReportCards(csvFilePath);


module.export = processCSVAndGenerateReportCards;
 