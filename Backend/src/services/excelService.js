const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');

class excelService {
    parseExcel(filePath) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(worksheet);
    };

    parseCSV(filePath, callback) {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                callback(results);
            });
    };
}

module.exports = new excelService()