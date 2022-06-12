const route = require('express').Router();
const Files = require('../controllers/Files');

// this route will be used to upload file
route.post('/' , Files.uploadFile);

// this route will be used to get file download page
route.get("/:uuid" , Files.show);

// this route will be used to download page
route.get("/download/:uuid" , Files.download);

module.exports = route;