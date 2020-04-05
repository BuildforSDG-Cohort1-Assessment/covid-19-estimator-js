const core = require('@actions/core');
const propertiesReader = require('properties-reader');

const run = async () => {
    try {     
        const propsLoc = core.getInput('src');
        const properties = propertiesReader(`${propsLoc}app.properties`);
        const frontendURL = properties.get('frontend.url');
        const backebdAPI = properties.get('backend.rest');
      
        core.setOutput('frontend', frontendURL);
        core.setOutput('backend', backebdAPI);

      } catch (error) {
        core.setFailed(error.message);
      }
};

run();
