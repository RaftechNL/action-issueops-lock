const core = require('@actions/core');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const lockId = core.getInput('lock-id');
    core.info(`Our lock-id is ${lockId}`);

    // core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    // await wait(parseInt(ms));
    // core.info((new Date()).toTimeString());

    core.setOutput('exists', "false");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
