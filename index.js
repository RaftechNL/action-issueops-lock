const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/action");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const lockId = core.getInput("lock-id");
    const token = core.getInput("token");
    const mode = core.getInput("mode");
    const body = core.getInput("body");

    const octokit = new Octokit();
    const context = github.context;

    // Check if an open issue with title 'ZAZO' already exists
    const issueSearchResult = await octokit.search.issuesAndPullRequests({
      q: `repo:${context.repo.owner}/${context.repo.repo} type:issue in:title ${lockId} is:open`,
    });

    let issueExists = issueSearchResult.data.total_count > 0;

    // Create a new GitHub issue with title 'ZAZO' if it doesn't exist
    if (!issueExists) {
      console.log("Issue lock does not exsist");

      if (mode != "check") {
        core.info(`Creating issue lock with lock-id of ${lockId}`);
        const issue = await octokit.issues.create({
          ...context.repo,
          title: lockId,
          body: '** automatically created by action-issueops-lock ** ',
        });

        console.log("Issue lock created: %s", data.html_url);
        core.setOutput("exists", "true");
      }

      core.setOutput("exists", "false");
    } else {
      core.info(`Issue lock with lock-id of ${lockId} - already exists`);
      core.setOutput("exists", "true");
    }

    // // See https://developer.github.com/v3/issues/#create-an-issue
    // const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    //   ...context.repo,
    //   title: lockId,
    // });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
