const express = require("express");
const multer = require("multer");
const ResumeParser = require("./src");
const path = require('path');

const app = express();
const cors = require("cors");
const PORT = 8080;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
 });
 
const upload = multer({ storage: storage });

app.use(cors());

app.post("/api/extract-resume", upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const resume = new ResumeParser(file.path);
    const data = await resume.parseToJSON();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error parsing resume' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});