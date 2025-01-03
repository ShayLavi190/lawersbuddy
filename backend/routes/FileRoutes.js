const express = require("express");
const User = require("../models/User");
const File = require("../models/File");
const router = express.Router();
const multer = require("multer");
const { Dropbox } = require("dropbox");
const upload = multer({ storage: multer.memoryStorage() });
const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;

router.get("/clients/:email", async (req, res) => {
    const emailg = req.params.email; 
    try {
      const lawyerg = await User.findOne({ email: emailg });
      if (!lawyerg) {
        return res.status(404).json({ success: false, message: "Lawyer not found" });
      }
  
      const files = await File.find({ lawyer: lawyerg.id }); 
      res.status(200).json({ success: true, files });
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  router.get("/files/:email", async (req, res) => {
    const email = req.params.email;
    try {
      const lawyer = await User.findOne
        ({ email: email });
      if (!lawyer) {
        return res.status(404).json({ success: false, message: "Lawyer not found" });
      }
      const files = await File.find({ lawyer: lawyer.id });
      res.status(200).json({ success: true, files });
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  router.get("/filesClient/:email", async (req, res) => {
    const email = req.params.email;
    try {
      const client
        = await
        User.findOne({ email: email });
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      const files = await File.find({ clientId: client.id });
      res.status(200).json({ success: true, files });
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  router.get("/files/case/:caseId", async (req, res) => {
    const { caseId } = req.params;
  
    try {
      const file = await File.findOne({ caseId });
  
      if (!file) {
        return res.status(404).json({ success: false, message: "File not found" });
      }
  
      res.status(200).json({ success: true, file });
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  router.get("/getuser/:email", async (req, res) => {
    const email = req.params.email;
    try {
      const user = await User
        .findOne({ email: email })
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  router.get("/files/share-links/:caseId", async (req, res) => {
    const { caseId } = req.params;
    const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });
  
    try {
      const file = await File.findOne({ caseId });
      if (!file || !file.files || file.files.length === 0) {
        return res.status(404).json({ success: false, message: "No documents found for this file" });
      }
  
      const tempLinks = await Promise.all(
        file.files.map(async (doc) => {
          const tempLinkResponse = await dbx.filesGetTemporaryLink({ path: doc.dropboxPath });
          return {
            fileName: doc.fileName,
            link: tempLinkResponse.result.link,
          };
        })
      );
  
      res.status(200).json({ success: true, links: tempLinks });
    } catch (error) {
      console.error("Error fetching shareable links:", error);
      res.status(500).json({ success: false, message: "Failed to fetch shareable links" });
    }
  });  
  router.put("/files/:caseId", async (req, res) => {
    const { caseId } = req.params;  
    try {
      const file = await File.findOne({ caseId });
      if (!file) {
        return res.status(404).json({ success: false, message: "File not found" });
      }
  
      const updatedFile = await File.findOneAndUpdate({ caseId }, req.body, {
        new: true, 
        runValidators: true, 
      });
  
      res.status(200).json({ success: true, updatedFile });
    } catch (error) {
      console.error("Error updating file:", error);
  
      if (error.name === "ValidationError") {
        res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to update file" });
      }
    }
  });
  router.put("/files/:caseId/missions", async (req, res) => {
    const { caseId } = req.params;
    const { date, mission } = req.body;
  
    try {
      const file = await File.findOne({ caseId });
      if (!file) {
        return res.status(404).json({ success: false, message: "File not found" });
      }
  
      const importantDate = file.importantDates.find(
        (importantDate) => new Date(importantDate.date).toISOString() === new Date(date).toISOString()
      );
  
      if (!importantDate) {
        return res.status(404).json({ success: false, message: "Important date not found" });
      }
  
      importantDate.missions.push({ text: mission, completed: false });
  
      await file.save();
      res.status(200).json({ success: true, file });
    } catch (error) {
      console.error("Error updating missions:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  router.post("/files", upload.array("files", 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }
  
    const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });
  
    try {
      const dropboxFileData = [];
  
      for (const file of req.files) {
        const dropboxPath = `/cases/${file.originalname}`;
        const dropboxResponse = await dbx.filesUpload({
          path: dropboxPath,
          contents: file.buffer,
        });
  
        dropboxFileData.push({
          dropboxPath: dropboxResponse.result.path_display,
          dropboxId: dropboxResponse.result.id,
          fileName: file.originalname,
          fileSize: file.size,
          uploadDate: new Date(),
        });
      }
  
      const newFile = new File({
        clientId: req.body.clientId,
        caseId: req.body.caseId,
        lawyer: req.body.lawyer,
        caseTitle: req.body.caseTitle,
        openDate: req.body.openDate,
        status: req.body.status,
        caseType: req.body.caseType,
        plaintiff: req.body.plaintiff,
        defendant: req.body.defendant,
        courtName: req.body.courtName,
        judges: req.body.judges.split(",").map((judge) => judge.trim()),
        attorneys: {
          plaintiff: req.body.plaintiff,
          defendant: req.body.defendant,
        },
        importantDates: req.body.importantDates || [],
        finalDecision: req.body.finalDecision || null,
        costs: req.body.costs || null,
        payed: req.body.payed || 0,
        files: dropboxFileData, 
      });
  
      await newFile.save();
  
      res.status(201).json({
        success: true,
        message: "Files uploaded and saved successfully",
        file: newFile,
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).json({ success: false, message: "Failed to upload and save files" });
    }
  });
  router.post("/files/delete-document", async (req, res) => {
    const { dropboxPath, caseId } = req.body;
    const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });
  
    try {
      await dbx.filesDeleteV2({ path: dropboxPath });
      await File.updateOne(
        { caseId },
        { $pull: { files: { dropboxPath } } }
      );
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ success: false, message: "Failed to delete document" });
    }
  });
  router.post("/files/upload-documents", upload.array("files"), async (req, res) => {
    const { caseId } = req.body;
    const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });
  
    try {
      const uploadedFiles = [];
  
      for (const file of req.files) {
        const dropboxPath = `/cases/${file.originalname}`;
        const response = await dbx.filesUpload({
          path: dropboxPath,
          contents: file.buffer,
        });
  
        uploadedFiles.push({
          fileName: file.originalname,
          fileSize: file.size,
          dropboxPath,
          dropboxId: response.result.id,
          uploadDate: new Date(),
        });
      }
  
      await File.updateOne(
        { caseId },
        { $push: { files: { $each: uploadedFiles } } }
      );
  
      res.status(200).json({ success: true, files: uploadedFiles });
    } catch (error) {
      console.error("Error uploading documents:", error);
      res.status(500).json({ success: false, message: "Failed to upload documents" });
    }
  });    
  
  router.put("/files/:caseId/missions/update", async (req, res) => {
    const { caseId } = req.params;
    const { date, mission, action } = req.body;
  
    try {
      const file = await File.findOne({ caseId });
  
      if (!file) {
        return res.status(404).json({ success: false, message: "File not found" });
      }
  
      const importantDate = file.importantDates.find(
        (importantDate) => new Date(importantDate.date).toISOString() === new Date(date).toISOString()
      );
  
      if (!importantDate) {
        return res.status(404).json({ success: false, message: "Important date not found" });
      }
  
      if (action === "mark") {
        const missionToMark = importantDate.missions.find((m) => m.text === mission);
        if (missionToMark) {
          missionToMark.completed = !missionToMark.completed; 
        }
      } else if (action === "delete") {
        importantDate.missions = importantDate.missions.filter((m) => m.text !== mission);
      }
  
      await file.save();
      res.status(200).json({ success: true, file });
    } catch (error) {
      console.error("Error updating missions:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  router.delete("/file/:caseId", async (req, res) => {
    const { caseId } = req.params;
    const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN }); 
    try {
      const file = await File.findOne({ caseId });
      if (!file) {
        return res.status(404).json({ success: false, message: "File not found" });
      }
      if (file.files && file.files.length > 0) {
        for (const fileItem of file.files) {
          if (fileItem.dropboxPath) {
            try {
              await dbx.filesDeleteV2({ path: fileItem.dropboxPath });
              console.log(`Deleted from Dropbox: ${fileItem.dropboxPath}`);
            } catch (error) {
              console.error(`Error deleting ${fileItem.dropboxPath} from Dropbox:`, error);
            }
          }
        }
      }
      await File.deleteOne({ caseId });
      res.status(200).json({ success: true, message: "File and associated images deleted" });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ success: false, message: "Failed to delete file" });
    }
  });
  

module.exports = router;