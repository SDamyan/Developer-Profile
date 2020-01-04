const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require('html-pdf');
const generateHTML = require ('./generateHTML');

const questions = [
  {
    type: 'input',
    name: 'colors',
    message: "What is your favorite color (Green, Blue, Pink, or Red)?",
    options: ["Green", "Blue", "Pink", "Red"]
  },

  {
    type: 'input',
    name: 'github',
    message: "What's your Github username?"
  }
];


async function askQuestions() {
  return await inquirer.prompt(questions);
}

async function queryURL(username) {
    const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    return axios.get(queryUrl);
}

async function queryGithubProfileURL(username) {
    const queryUrl = `https://github.com/${username}/`;
    const response = await axios.get(queryUrl);
    return response.data;
}

function writeFile(data) {
    fs.writeFileSync('./response.txt', data);
}

async function writePdfFile(html) {
  var options = { format: 'Letter' };
  await pdf.create(html, options).toFile('./githubprofile.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });
}
  
async function init() {
  var answers = await askQuestions();
  console.log(answers);
  // var response = await queryURL(answers.github);
  var data = await queryGithubProfileURL(answers.github);
  console.log (data);
  const htmlTemplate = generateHTML(data);
  await writePdfFile(htmlTemplate);
}

init();
