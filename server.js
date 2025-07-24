const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // ✅ CORS import

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS setup — allow frontend origin (Netlify)
app.use(cors({
  origin: 'https://classy-cassata-c8bbdc.netlify.app', // ← tumhara Netlify URL
}));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

    res.status(200).json({ message: '✅ Data sent to Google Sheet!' });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server started at http://localhost:${port}`);
});
