const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const TOKEN_PATH = 'credentials.json'

// Load client secrets from a local file.
const editFile = (actionFunct) => {
  fs.readFile('client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), actionFunct)
  })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1Df4TF67exj3_6H9B53sIp5lbRS_3FBt011sGRJ-zVAg/edit#gid=2097143836
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listCourses(auth) {
  const sheets = google.sheets({ version: 'v4', auth })
  sheets.spreadsheets.values.get({
    spreadsheetId: '1Df4TF67exj3_6H9B53sIp5lbRS_3FBt011sGRJ-zVAg',
    range: '2018W1!A2:N',
  }, (err, { data }) => {
    if (err) return console.log('The API returned an error: ' + err)
    const rows = data.values
    if (rows.length) {
      console.log('Dept, Course, Instructor, Email')
      rows.map((row) => {
        if ((row[13] !== 'Y') && (row[11] !== 'Y') && (row[10] === 'Lecture')) {
          console.log(`${row[2]}, ${row[3]}, ${row[5]}, ${row[8]}`)
        }
      })
    } else {
      console.log('No data found.')
    }
  })
}

function listCanvasCourseCopies(auth) {
  const sheets = google.sheets({ version: 'v4', auth })
  sheets.spreadsheets.values.get({
    spreadsheetId: '1Df4TF67exj3_6H9B53sIp5lbRS_3FBt011sGRJ-zVAg',
    range: '2018W1!A2:N',
  }, (err, { data }) => {
    if (err) return console.log('The API returned an error: ' + err)
    const rows = data.values
    if (rows.length) {
      console.log('Dept, Course, Instructor, Email')
      rows.map((row) => {
        if (row[13] === 'Y') {
          console.log(`${row[2]}, ${row[3]}, ${row[5]}, ${row[8]}`)
        }
      })
    } else {
      console.log('No data found.')
    }
  })
}

function listXlisted(auth) {
  const sheets = google.sheets({ version: 'v4', auth })
  sheets.spreadsheets.values.get({
    spreadsheetId: '1Df4TF67exj3_6H9B53sIp5lbRS_3FBt011sGRJ-zVAg',
    range: '2018W1!A2:N',
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

function testFunct(auth) {
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
        if (row[13] === 'Y') {
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
    sheets.spreadsheets.values.get({
      spreadsheetId: '1Df4TF67exj3_6H9B53sIp5lbRS_3FBt011sGRJ-zVAg',
      range: 'Instructor Contact!A2:N'
    }, (err, { data }) => {
      if (err) console.log(err)
      const rows = data.values
      if (rows.length) {
        // rows.forEach((row) => sheet2.push([row[0], row[1], row[2], row[3]]))
      }
      // do something here
      console.log(newSheetArr)
    })
  })
}

// editFile(listCanvasCourseCopies)

editFile(testFunct)
