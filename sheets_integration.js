const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();
const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
async function connect() {
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
}
async function loadInfo(client_name) {
    // console.log(client_name);
    await doc.loadInfo(); // loads document properties and worksheets
    // console.log(doc.title);

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
    // console.log(sheet.title);
    // console.log(sheet.rowCount);

    await sheet.loadCells('A2:C1000');
    var matched_client = false;
    const matched_cells = [];
    for (cell_index = 1; cell_index < sheet.cellStats.nonEmpty; cell_index++) {
        var temp_cell = sheet.getCell(cell_index, 0);
        if (temp_cell.value === client_name) {
            matched_client = true;
            matched_cells.push(temp_cell.rowIndex);
        }
    }
    if (matched_client === false) {
        return null;
    }
    var target_cells = {};
    for (i = 0; i < matched_cells.length; i++) {
        var target_name = (sheet.getCell(matched_cells[i], 1).value);
        var target_value = (sheet.getCell(matched_cells[i], 2).value);
        target_cells[target_name] = target_value;
    }
    return target_cells;
}

module.exports = { connect, loadInfo }
