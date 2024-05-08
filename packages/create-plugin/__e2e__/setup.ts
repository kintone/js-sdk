const isRunOnActions = () => !!process.env.GITHUB_ACTIONS;

if (isRunOnActions()) {
  jest.retryTimes(3, { logErrorsBeforeRetry: true });
}
