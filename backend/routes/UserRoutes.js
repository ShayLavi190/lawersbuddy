const express = require("express");
const User = require("../models/User");
const router = express.Router();
require("dotenv").config();
const { Configuration, OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OpenAiApiKey,
  organization:process.env.OpenAiOrganization,
  project:process.env.OpenAiProject,
});

router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }});

router.get('/allusers/Lawyer', async (req, res) => {
    try {
      const lawyers = await User.find({premission : 'lawyer'});
      res.status(200).json({ success: true, lawyers });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get("/clients/:email", async (req, res) => {
  const emailg = req.params.email; 
  try {
    const lawyerg = await User.findOne({ email: emailg });
    if (!lawyerg) {
      return res.status(404).json({ success: false, message: "Lawyer not found" });
    }

    const clients = await User.find({ lawyer: lawyerg.full_name });
    res.status(200).json({ success: true, clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/generate-message", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt is required" });
  }

  try {
    console.log("Prompt received:", prompt);

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini'
});

    console.log("API Response:", response.data);
    const firstChoice = response.choices[0]; 
    const messageContent = firstChoice.message.content; 
    console.log("Extracted Message Content:", messageContent);

    res.status(200).json({ success: true, message: messageContent.trim() });
  } catch (error) {
    console.error("Error generating AI message:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({ success: false, message: "Failed to generate message" });
  }
});

module.exports = router;
