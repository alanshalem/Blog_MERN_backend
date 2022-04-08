const express = require("express");
const router = express.Router();
const { cloudinary } = require("../utils/cloudinary");

// @desc    Upload an image to cloudinary
// @route   POST /api/cloudinary/upload
// @access  Public
router.post("/upload", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const fileName = req.body.file_name;

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "blog",
      use_filename: true,
      unique_filename: false,
      filename_override: fileName,
    });
    res.json({ uploadedResponse, msg: "Successfully uploaded the image!" });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

// @desc    Get images from cloudinary
// @route   GET /api/cloudinary/
// @access  Public
router.get("/", async (req, res) => {
  try {
    const images = await cloudinary.api.resources({
      type: "upload",
      prefix: "blog",
      max_results: 20,
    });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

module.exports = router;
