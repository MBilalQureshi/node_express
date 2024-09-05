const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/bulk-upload');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `region-bulk-upload-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
 
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};
 
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { files: 1 }, // Only one file is allowed
}).single('regionFile');
 
const fileError = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: resMsgError.files.maxFIleLimit,
        });
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: 'regionFile field is required',
        });
      } else {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
    } else if (err) {
      // An unknown error occurred when uploading
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
 
    // Check if no file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: resMsgError.files.fileRequired,
      });
    }
 
    // Check if the file field name is not 'regionFile'
    if (req.file.fieldname !== 'regionFile') {
      return res.status(400).json({
        success: false,
        message: 'regionFile field is required',
      });
    }
 
    // Everything went fine, proceed to the next middleware
    next();
  });
};
 
router.post('/region/uploadCSV', AuthJWT, fileError, uploadRegionCSV);