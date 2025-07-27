const {
  getLanguageById,
  submitToken,
  submitBatch,
} = require("./problemUtility");

const validateReferenceSolutions = async (referenceSolution, visibleTestCases) => {
  for (const { language, completeCode } of referenceSolution) {
    const languageId = getLanguageById(language);

    const submissions = visibleTestCases.map(({ input, output }) => ({
      source_code: completeCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    for (const test of testResult) {
      if (test.status_id !== 3) {
        return res.status(400).json({ message: test.status.description });
      }
    }
  }
};

module.exports = validateReferenceSolutions;
