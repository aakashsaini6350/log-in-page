const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // ✅ JSON ke liye required
app.use(express.static('public'));

// Google Sheets Setup
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SHEET_ID = '1-N50-wO6PpCvEcvK-ONX6D1QKToOefK9UrgUuitg-_E';

app.post('/submit', async (req, res) => {
  const { name, phone, dob } = req.body;

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, phone, dob]],
      },
    });

    res.status(200).json({ message: '✅ Data sent to Google Sheet!' }); // ✅ FIX
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Something went wrong' }); // ✅ JSON error
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
