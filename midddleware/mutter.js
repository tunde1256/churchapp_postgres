const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'your_folder_name', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'], // Allowed file formats
  },
});

const upload = multer({ storage });

module.exports = upload;
