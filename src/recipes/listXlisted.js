const { google } = require('googleapis')

function listXlisted (auth) {
  const sheets = google.sheets({ version: 'v4', auth })
  sheets.spreadsheets.values.get({
    spreadsheetId: '1Df4TF67exj3_6H9B53sIp5lbRS_3FBt011sGRJ-zVAg',
    range: '2018W1!A2:N'
  }, (err, { data }) => {
    if (err) return console.log('The API returned an error: ' + err)
    const rows = data.values
    if (rows.length) {
      console.log('Dept, Course, Instructor, Email')
      rows.map((row) => {
        if (row[11] === 'Y') {
          console.log(`${row[2]}, ${row[3]}, ${row[5]}, ${row[8]}`)
        }
      })
    } else {
      console.log('No data found.')
    }
  })
}

module.exports = listXlisted
