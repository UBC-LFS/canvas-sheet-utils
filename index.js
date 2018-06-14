const editFile = require('./src/authorize')
const listCourses = require('./src/recipes/listCourses')
const listCanvasCourseCopies = require('./src/recipes/listCanvasCourseCopies')
const listXlisted = require('./src/recipes/listXlisted')
const printToPage = require('./src/recipes/printToPage')
const listNonEmailResponse = require('./src/recipes/listNonEmailResponse')
const prompts = require('prompts')

async function initPrompt () {
  const response = await prompts({
    type: 'number',
    name: 'value',
    message: 'How old are you?'
  })

  if (response.value === 1) {
    console.log('You are obviously not 1 year old, you liar liar pants on fire')
  } else {
    console.log(response.value + ' years old. WOW you are old!')
  }
}

initPrompt()
