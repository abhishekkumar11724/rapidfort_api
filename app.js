const express = require("express");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");

const upload = multer({});
dotenv.config({ path: "config.env" });

const app = express();

const stylesForDetails = `
<style>
body {
  margin: 100px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  background-color: rgb(208, 208, 208);
  text-align: center;
}

h3 {

}

.individualFile {
  background: rgb(57, 206, 255);
  margin: 0 100px 20px 100px;
  border: solid 5px;
  border-radius: 10px;

}
</style>
`;

app.get("/", (req, res) => {
  const indexFile = path.join(__dirname, "index.html");
  res.sendFile(indexFile);
});

app.post("/", upload.array("myFile"), (req, res, next) => {
  let details = [];

  if (!req.files) {
    return res.status(200).json("no file uploaded");
  }

  req.files.forEach((element) => {
    details.push({
      encoding: element.encoding,
      mime: element.mimetype,
      size: element.size,
      filename: element.originalname,
    });
  });
  let str = "";

  if (!req.files) {
    str += "<h1>No file was Uploaded! please return and try again</h1>";
  }
  str += `<a href="../"><button onClick=>return </button></a>`;

  if (req.files) {
    str += `<h2>Details of Uploaded files :</h2>`;
  }
  details.forEach((element) => {
    str += `
    ${stylesForDetails}
    
    <div class="individualFile">
        <h3> file name : ${element.filename}</h3> 
        <h3> mime : ${element.mime}</h3> 
        <h3> encoding : ${element.encoding}</h3>
        <h3> size : ${element.size / 1024} MB</h3>
    </div> `;
  });

  return res.status(200).send(str);
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
