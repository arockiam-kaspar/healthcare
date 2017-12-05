import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
let totalRecords= [];
var myData = fs.createReadStream(path.join(__dirname, '../records.json'), 'utf8');
myData.on('data', function(chunk) {
    totalRecords = JSON.parse(chunk).data;
});


router.get('/:id', (req, res) => {
	const { id, page }= req.params;
	const recordsPerPage = page ? page : 5;

	const startIndex = id==1 ? 0 : ((id-1)*recordsPerPage);
	const endIndex = (totalRecords.length > (id*recordsPerPage)) ? (id*recordsPerPage) : (totalRecords.length);
	const pagingData = totalRecords.slice(startIndex, endIndex);
	//console.log(startIndex, endIndex);
	const obj = {
		totalRecords : totalRecords.length,
		data: pagingData
	}
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(obj));

});

export default router;