const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
  try {
    const contextPullRequest = github.context.payload.pull_request;
    if (!contextPullRequest) {
      throw new Error(
        "This action can only be invoked in `pull_request` events. Otherwise the pull request can't be inferred."
      );
    }

    console.log('PR title: ', contextPullRequest.title);
  }
  catch (error) {
    core.setFailed(error.message);
  }
};

run().catch(console.error);
