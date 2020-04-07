const fs = require('fs');
const axios = require('axios');
const xml2json = require("xml2json");
const core = require('@actions/core');
const { context } = require('@actions/github');

const CHALLENGES = {
  'ch-1': 'challenge-01',
  'ch-2': 'challenge-02',
  'ch-3': 'challenge-03',
  'ch-4': 'challenge-04',
  'ch-5': 'challenge-05'
};

const getStatsFor = (lang, task) => {
  let stats = {};

  if (lang === 'javascript' || ['ch-4', 'ch-5'].includes(task)) {
    // const payload = require(`../../../audits/${task}.json`);
    const json = fs.readFileSync(`${process.cwd()}/audits/${task}.json`, 'utf8');
    const payload = JSON.parse(json);
    stats.totalTests = payload.numTotalTests;
    stats.passedTests = payload.numPassedTests;
  }

  if (lang === 'python') {
    // JSON:: report > summary > passed | num_tests
    const json = fs.readFileSync(`${process.cwd()}/audits/${task}.json`, 'utf8');
    const data = JSON.parse(json);
    console.log(data);

    const payload = data.report.summary;
    stats.totalTests = payload.num_tests;
    stats.passedTests = payload.passed;
  }

  if (lang === 'php') {
    const xml = fs.readFileSync(`${process.cwd()}/audits/${task}.xml`, 'utf8');
    const data = xml2json.toJson(xml, { object: true });
    
    // HINT: how data looks.
    // {
    //   testsuites: {
    //     testsuite: {
    //       name: './audits/ch-1',
    //       tests: '3',
    //       assertions: '36',
    //       errors: '0',
    //       warnings: '0',
    //       failures: '3',
    //       skipped: '0',
    //       time: '0.350120',
    //       testsuite: [Object]
    //     }
    //   }
    // }

    const payload = data.testsuites.testsuite;
    stats.totalTests = payload.tests;
    stats.passedTests = parseInt(payload.tests, 10) - parseInt(payload.failures, 10);
  }

  return stats;
};

const run = async () => {
  try {
    const task = core.getInput('challenge');
    const language = core.getInput('lang');
    const challenge = CHALLENGES[task];
    const stats = getStatsFor(language, task);

    const { repo, owner } = context.repo;
    const report = {
      repo,
      owner,
      ...stats,
      language,
      source: 'unit-tests',
      type: challenge
    };

    const server = core.getInput('server');
    await axios.post(`${server}/entry-tests`, { report });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
