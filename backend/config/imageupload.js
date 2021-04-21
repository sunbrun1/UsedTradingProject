const multer = require('multer');

const storage = multer.diskStorage({ 
	destination: (req, res, cb) => {
		cb(null, "images/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
	 fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		if (ext !== ".jpeg" || ".png" || ".jpg"){
			return cb(null, false);
		}
		cb(null, true); 
	}, 
	limits: { fileSize: 20 * 1024 * 1024 },
});
module.exports = multer({ storage }).single("files");

