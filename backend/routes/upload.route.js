const express = require('express');
const router = express.Router();
const { upload, uploadBase64Image } = require('../config/cloudinary-setup');

// Upload single image (multipart/form-data)
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        public_id: req.file.filename,
        originalName: req.file.originalname
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// Upload multiple images
router.post('/multiple', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      originalName: file.originalname
    }));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: uploadedImages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

// Upload base64 image
router.post('/base64', async (req, res) => {
  try {
    const { image, folder = 'chefkart' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No base64 image provided'
      });
    }

    const result = await uploadBase64Image(image, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        originalName: result.original_filename
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading base64 image',
      error: error.message
    });
  }
});

// Delete image
router.delete('/delete', async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const { deleteImage } = require('../config/cloudinary-setup');
    const result = await deleteImage(public_id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
});

module.exports = router;
