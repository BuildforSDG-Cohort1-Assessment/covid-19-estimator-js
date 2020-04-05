const fs = require('fs');
const axios = require('axios');
const core = require('@actions/core');
const { context } = require("@actions/github");

const run = async () => {
    try {    
        const repo = context.repo.repo;
        const owner = context.repo.owner;
        const language = core.getInput('lang');

        const dir = './.lighthouseci';
        const [file] = fs.readdirSync(dir).filter(f => f.startsWith('lhr-') && f.endsWith('.json'));
        const lhr = JSON.parse(fs.readFileSync(`${dir}/${file}`, 'utf8'));
        
        const { categories } = lhr;
        const stats = Object.keys(categories)
          .filter(key => key !== 'pwa')
          .reduce((props, key) => {
            props[ key.replace('-', '') ] = categories[key].score;
            return props;
          }, {});

        const report = {
          repo, 
          owner,
          language,
          ...stats,    
          type: 'challenge-04',
          source: 'lighthouse'
        };

        const server = core.getInput('server');
        await axios.post(`${server}/entry-tests`, {report});
        
      } catch (error) {
        core.setFailed(error.message);
      }
};

run();
