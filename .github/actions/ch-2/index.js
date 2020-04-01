const core = require('@actions/core');
const { context } = require("@actions/github");
const axios = require('axios');
const stats = require('../../../audits/ch-2.json');

const run = async () => {
    try {     
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
          repo, owner,
          numTotalTests, 
          numPassedTests, 
          numPendingTests,
          numTotalTestSuites, 
          numPassedTestSuites,
          type: 'challenge-02'
        };

        if(stats.testResults) {
          report.assertions = [];
          for({assertionResults} of stats.testResults) {
            const {status, title} = assertionResults; 
            report.assertions.push({status, title});
          }
        }

        const apiBase = core.getInput('api-base');
        const { result } = await axios.post(`${apiBase}/entry-tests`, {report});
        core.info(result);

      } catch (error) {
        core.setFailed(error.message);
      }
};

run();
