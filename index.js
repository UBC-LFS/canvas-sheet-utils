const editFile = require('./src/authorize')
const listCourses = require('./src/recipes/listCourses')
const listCanvasCourseCopies = require('./src/recipes/listCanvasCourseCopies')
const listXlisted = require('./src/recipes/listXlisted')
const printToPage = require('./src/recipes/printToPage')
const listNonEmailResponse = require('./src/recipes/listNonEmailResponse')
const prompts = require('prompts')

async function initPrompt () {
  const response = await prompts({
    type: 'text',
    name: 'meaning',
    message: `What would you like to do today? (type the following commands to do any actions) 
    get courses: gets all lecture courses that are not on Canvas nor X listed
    get courses on Canvas: gets all courses that are empty shells on Canvas
    get X listed courses: gets all courses that require X listing
    print to spreadsheet: prints canvas shell courses onto the google sheet; https://docs.google.com/spreadsheets/d/1hWQFrYRV745PYkznCqIPRVtD5z7faapKvkelf7ukkMw/edit#gid=0`
  })

  switch (response.meaning) {
    case 'get courses':
      editFile(listCourses)
      break
    case 'get courses on Canvas':
      editFile(listCanvasCourseCopies)
      break
    case 'get X listed courses':
      editFile(listXlisted)
      break
    case 'print to spreadsheet':
      editFile(printToPage)
      break
    default:
      console.log(response.meaning + '? Unable to understand. Please type again (commands are case sensitive)')
  }
}

initPrompt()
