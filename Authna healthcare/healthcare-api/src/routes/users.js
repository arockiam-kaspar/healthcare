import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
let fileData = [];
var myData = fs.createReadStream(path.join(__dirname, '../records.json'), 'utf8');
myData.on('data', function(chunk) {
    fileData = chunk;
});
router.get('/', (req, res) => {

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(fileData);

});

export default router;