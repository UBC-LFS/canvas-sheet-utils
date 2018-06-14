const { google } = require('googleapis')

function listNonEmailResponse (auth) {
  const sheet1 = []
  const sheet2 = []
  const sheets = google.sheets({ version: 'v4', auth })
  sheets.spreadsheets.values.get({
    spreadsheetId: '1Df4TF67exj3_6H9B53sIp5lbRS_3FBt011sGRJ-zVAg',
    range: '2018W1!A2:N'
  }, (err, { data }) => {
    if (err) console.log(err)
    const rows = data.values
    if (rows.length) {
      rows.forEach((row) => {
        if (row[15] !== '' && row[16] !== 'Y') {
          sheet1.push([row[2], row[3], row[5], row[7], row[6], row[8]])
        }
      })
    }
    sheet1.map(rows => sheet2.push({
      courses: rows[0] + ' ' + rows[1],
      instructor: rows[2],
      firstName: rows[3],
      surname: rows[4],
      email: rows[5]}))
    const newSheet = sheet2.reduce((acc, cur) => {
      const index = acc.findIndex(rows => rows.instructor === cur.instructor)
      if (index > -1) {
        acc[index].courses += ', ' + cur.courses
      } else {
        acc.push(cur)
      }
      return acc
    }, [])
    const newSheetArr = newSheet.map(object => Object.values(object))
    sheets.spreadsheets.values.update({
      spreadsheetId: '1hWQFrYRV745PYkznCqIPRVtD5z7faapKvkelf7ukkMw',
      range: 'Sheet1!A2:E',
      valueInputOption: 'RAW',
      resource: {values: newSheetArr}
    }, (err, result) => {
      if (err) console.log(err)
      const rows = data.values
      if (rows.length) {
        console.log('Copied complete! Check at https://docs.google.com/spreadsheets/d/1hWQFrYRV745PYkznCqIPRVtD5z7faapKvkelf7ukkMw/edit#gid=0')
      }
      // do something here
      // console.log(newSheetArr)
    })
  })
}

module.exports = listNonEmailResponse
