const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const _ = require('lodash');


const run = async () => {
  try {
    const contextPullRequest = github.context.payload.pull_request;
    if (!contextPullRequest) {
      throw new Error(
        "This action can only be invoked in `pull_request` events. Otherwise the pull request can't be inferred."
      );
    }

    // Read the contents of the CHANGELOG.md file.
    const changelogFile = 'CHANGELOG.md';

    if (!fs.existsSync(changelogFile)) {
      throw new Error(`${changelogFile} CHANGELOG.md does not exist.`);
    }

    const content = fs.readFileSync(changelogFile, 'utf-8');
    const lines = _.split(content, '\n');

    // Find the first title with the Unreleased string, and insert the PR title on the next line. .
    const titleIndex = _.findIndex(lines, (line) => /^#.*Unreleased/.test(line));
    if (titleIndex > 0) {
      lines.splice(titleIndex + 1, 0, contextPullRequest.title);
    }

    // Write back to the CHANGELOG.md file.
    const fileContent = _.join(lines, '\n');
    fs.writeFileSync(changelogFile, fileContent, 'utf-8');
  }
  catch (error) {
    core.setFailed(error.message);
  }
};

run().catch(console.error);
