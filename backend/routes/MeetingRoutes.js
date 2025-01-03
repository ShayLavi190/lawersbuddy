const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");
const User = require("../models/User");

router.get("/meetings/:email", async (req, res) => {
  const emailg = req.params.email;
  const lawyerg = await User.findOne({ email: emailg });
  if (!lawyerg) {
    return res.status(404).json({ success: false, message: "Lawyer not found" });
  }
  try {
    const meetings = await Meeting.find({
      lawyer:lawyerg.full_name,
    });
     res.status(200).json({ success: true, meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
);
router.get("/meetingsClient/:email", async (req, res) => {
  const email = req.params.email;
  const client = await User
    .findOne({ email: email });
  if (!client) {
    return res.status(404).json({ success: false, message: "Client not found" });
  }
  try {
    const meetings = await Meeting.find({
      client: client.id,
    });
    res.status(200).json({ success: true, meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/meet/:_id", async (req, res) => {
  const _id = req.params._id;
  try {
    const meeting = await Meeting.findById(_id);
    res.status(200).json({ success: true, meeting });
  } catch (error) {
    console.error("Error fetching meeting:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
);

router.post("/meeting", async (req, res) => {
  const { client, date, time, location, info, lawyer } = req.body;

  try {
    const newMeeting = new Meeting({
      client,
      date,
      time,
      location,
      info,
      lawyer,
    });

    await newMeeting.save();
    res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
      meeting: newMeeting,
    });
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/meet/:_id", async (req, res) => {
  const _id = req.params._id;
  const { client, date, time, location, info, lawyer } = req.body;
  try {
    await Meeting.findByIdAndUpdate(_id, { client, date, time, location, info, lawyer });
    res.status(200).json({ success: true, message: "Meeting updated successfully" });
  } catch (error) {
    console.error("Error updating meeting:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
);

router.delete("/meet/:_id", async (req, res) => {
  const _id = req.params._id;

  try {
    await Meeting.findById
    await Meeting.findByIdAndDelete(_id);
    res.status(200).json({ success: true, message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
);

module.exports = router;
