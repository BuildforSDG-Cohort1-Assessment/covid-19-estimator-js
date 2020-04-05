const axios = require('axios');
const core = require('@actions/core');
const { context } = require("@actions/github");

const CHALLENGES = {
  'ch-1': 'challenge-01',
  'ch-2': 'challenge-02',
  'ch-3': 'challenge-03',
  'ch-4': 'challenge-04',
  'ch-5': 'challenge-05'
};

const run = async () => {
    try {     
        const task = core.getInput('challenge');
        const language = core.getInput('lang');
        const challenge = CHALLENGES[task];
        const stats = require(`../../../audits/${task}.json`);
      
        const repo = context.repo.repo;
        const owner = context.repo.owner;
        
        const {
          numTotalTestSuites, 
          numPassedTestSuites, 
          numTotalTests, 
          numPassedTests, 
          numPendingTests
        } = stats;

        const report = {
          repo, 
          owner,
          language,
          numTotalTests, 
          source: 'jest',
          numPassedTests,
          type: challenge,
          numPendingTests,
          numTotalTestSuites, 
          numPassedTestSuites
        };

        if(stats.testResults) {
          report.assertions = [];
          for({assertionResults} of stats.testResults) {
            const {status, title} = assertionResults; 
            report.assertions.push({status, title});
          }
        }

        const server = core.getInput('server');
        await axios.post(`${server}/entry-tests`, {report});

      } catch (error) {
        core.setFailed(error.message);
      }
};

run();
