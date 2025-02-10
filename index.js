const express = require("express");
 const app = express();
 const cors = require('cors')

const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended: true}));
// SQL Server configuration
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Connected to MongoDB");
});


app.use("/api/auth", require("./routes/auth"));

app.use("/api/students", require("./routes/students"));
// app.use("/api/admitCard", require("./routes/AdmitCardGenerator"));

app.use("/api/form", require("./routes/form"));

app.use("/api/employees", require("./routes/employes"));

app.use("/api/candidates", require("./routes/candidate"));

app.use("/api/tasks", require("./routes/task"));

app.use("/api/attendence", require("./routes/attendence"));

app.use("/api/board", require("./routes/Board"));
app.use("/api/payment", require("./routes/payment"));



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
