const sheets = require('./sheets_integration');

require('dotenv').config();

'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 3000, () => { console.log('Express server listening on port %d', server.address().port); });

var fs = require('fs');
fs.writeFile(process.env.CREDS_FILE, process.env.GOOGLE_CREDS, (err) => { });
app.post('/', (req, res) => {
    async function connectSheets(callback) {
        // console.log('connecting to sheets');
        await sheets.connect();
        callback(true);

    }

    async function getSheetData(text, callback) {
        // console.log('getting sheets data');
        const sheet_data = await sheets.loadInfo(text)
        callback(sheet_data);

    }

    function formatMessage(matched_cells) {

        var message = '';
        for (const property in matched_cells) {
            message += property + ':\n' + matched_cells[property] + '\n\n'
        }
        return (message.slice(0, -1)); //removes last newline
    }
    let text = req.body.text;
    // connectSheets();
    // sheet_data = getSheetData(text);
    // console.log(sheet_data)
    // res.send(JSON.stringify(sheet_data));


    function getDeathMessage() {
        let weapons = ['candlestick', 'dagger', 'lead pipe', 'revolver', 'rope', 'wrench'];
        let rooms = ['kitchen', 'ballroom', 'conservatory', 'dining room', 'billiard room', 'library', 'study', 'hall', 'lounge']
        var death = '';
        var random_weapon = weapons[Math.floor(Math.random() * weapons.length)];
        var random_room = rooms[Math.floor(Math.random() * rooms.length)];
        death = '```' + `You were killed in the ${random_room} with a ${random_weapon}. Try a different query!` + '```';
        return death;
    }


    connectSheets(function (result) {
        if (result) {
            getSheetData(text, function (matched_cells) {
                if (matched_cells === null) {
                    death_message = getDeathMessage();
                    res.send({
                        "response-type": "ephemeral",
                        "text": death_message
                    });
                } else {

                    if (Object.keys(matched_cells.length !== 0)) {
                        corrected_message = formatMessage(matched_cells)
                        res.send('*' + text + '*\n' + '```' + corrected_message + '```');
                    }
                }
            });
        }
    });

    // if (text !== null) {
    //     // res.send('bingo')
    // }


    // matched_cells = await sheets.loadInfo(text)
    // console.log(matched_cells)
    // for (i = 0; i < matched_cells.length; i++) {
    //     // console.log(matched_cells[i]);
    //     var target_name = sheet.getCell(matched_cells[i], 1).value;
    //     var target_value = sheet.getCell(matched_cells[i], 2).value;
    //     console.log(`${target_name}\n${target_value}\n`)
    // }
    // console.log('received message')
    //implement app here
});
