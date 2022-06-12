const ResponseHandler = require('../utils/ResponseHandler');
const multer = require('multer');
const path = require('path');
const FilesModel = require('../models/FileModel');
const { v4: uuid4 } = require('uuid');
// initializing response handler
const Response = new ResponseHandler(400);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9 * 200)}${path.extname(file.originalname)}`;

        cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1000000 * 100 }
}).single("file");

class Files {
    // this function will be used to uplaod file and save data to the database
    uploadFile(req, res) {
        // Storing in Storage
        upload(req, res, async (err) => {
            Response.setResponseObject(res);
            if (err) {
                return Response.NeedError(err.message);
            }

            // validation
            if (!req.file) {
                return Response.NeedError("All feilds required");
            }
            console.log(1);

            // store into database
            let savedfile;
            try {
                savedfile = await FilesModel({
                    filename: req.file.filename,
                    uuid: uuid4(),
                    path: req.file.path,
                    size: req.file.size
                }).save();

                if (!savedfile) {
                    return Response.NeedError("File couldn't be saved");
                }
                console.log(2);

            } catch (error) {
                return Response.NeedError(error.message, 500);
            }

            return Response.NeedExec("Your File Uploaded Successfully", {
                file: `${process.env.BASE_APP_URL}/files/${savedfile.uuid}`
            })
        });
    };

    // this function will be used to show download page
    async show(req, res) {
        try {
            const file = await FilesModel.findOne({ uuid: req.params.uuid });
            // Link expired
            if (!file) {
                return res.render('download', { error: 'Link has been expired.' });
            }
            return res.render('download', { uuid: file.uuid, fileName: file.filename, fileSize: file.size, downloadLink: `${process.env.BASE_APP_URL}/files/download/${file.uuid}` });
        } catch (err) {
            return res.render('download', { error: 'Something went wrong.' });
        }
    };

    // this function will be used to download th file
    async download(req , res) {
        // Extract link and get file from storage send download stream 
        const file = await FilesModel.findOne({ uuid: req.params.uuid });
        // Link expired
        if (!file) {
            return res.render('download', { error: 'Link has been expired.' });
        }

        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);
    }

}

module.exports = new Files();