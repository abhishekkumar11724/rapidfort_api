const express = require("express");

const formidable = require("formidable");

// const fileUpload = require("express-fileupload");
const { exec } = require("child_process");

const app = express();
// app.use(fileUpload({ useTempFiles: false }));

const port = 5000;

app.get("/", (req, res) => {
  res.send(`
    <h2>With <code>"express"</code> npm package</h2>
    <form action="/upload" enctype="multipart/form-data" method="post">
      <div>File: <input type="file" name="myFile" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});

app.post("/upload", (req, res, next) => {
  const form = new formidable.IncomingForm({});

  let details = [];

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error processing file upload" });
    }

    const inputFile = files.myFile;
    // for (let index = 0; index < files.myFile.length; index++) {
    exec(
      `file -`,
      { input: inputFile, encoding: "buffer" },
      (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error });
        }

        const temp = stdout.toString().trim();
        console.log("hello world:", temp);
        details.push(temp);
        return res
          .status(200)
          .json({ message: "File uploaded successfully", details });
      }
    );
    // }

    // res.json({ fields, files });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// exec(
//   `file -`,
//   { input: inputFile, encoding: "buffer" },
//   (error, stdout, stderr) => {
//     if (error) {
//       return res
//         .status(500)
//         .json({ error: "Error processing the file", error });
//     }
//     const fileInfo = stdout.toString().trim();
//     return res.json({ message: "File uploaded successfully", fileInfo });
//   }
// );
