const core = require('@actions/core');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const lockId = core.getInput('lock-id');
    const token = core.getInput("token");

    const actionToken = token == "undefined" ? process.env.GITHUB_TOKEN : token;


    core.info(`Our lock-id is ${lockId}`);

    const octokit = new github.GitHub(token);
    const context = github.context;

    // core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    // await wait(parseInt(ms));
    // core.info((new Date()).toTimeString());

    // Check if an open issue with title 'ZAZO' already exists
    const issueSearchResult = await octokit.search.issuesAndPullRequests({
      q: `repo:${context.repo.owner}/${context.repo.repo} type:issue in:title ${lockId} is:open`
    });

    let issueExists = issueSearchResult.data.total_count > 0;

    // Create a new GitHub issue with title 'ZAZO' if it doesn't exist
    if (!issueExists) {
      const issue = await octokit.issues.create({
        ...context.repo,
        title: lockId,
        body: 'This is the issue body. Describe your issue here.',
      });
    }

    
    core.setOutput('exists', "false");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
