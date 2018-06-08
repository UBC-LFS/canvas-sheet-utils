const editFile = require('./src/authorize')
const listCourses = require('./src/recipes/listCourses')
const listCanvasCourseCopies = require('./src/recipes/listCanvasCourseCopies')
const listXlisted = require('./src/recipes/listXlisted')
const printToPage = require('./src/recipes/printToPage')

editFile(printToPage)
