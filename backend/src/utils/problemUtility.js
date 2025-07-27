const axios = require("axios");

const getLanguageById = (lang) => {
  const languages = {
    cpp: 105,
    java: 91,
    javascript: 102,
  };

  if (typeof lang !== "string") {
    throw new Error("Language must be a string");
  }

  const key = lang.trim().toLowerCase();

  if (!(key in languages)) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  return languages[key];
};

const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: process.env.JUDGE0_URL,
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": process.env.REPID_API_KEY,
      "x-rapidapi-host": process.env.REPID_API_HOST,
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(
        "Error:while submitBatch the fetching data from judge0",
        error
      );
    }
  }

  return await fetchData();
};

const waiting = (timer) => new Promise((resolve) => setTimeout(resolve, timer));

const submitToken = async (resultToken) => {
  try {
    const options = {
      method: "GET",
      url: process.env.JUDGE0_URL,
      params: {
        tokens: resultToken.join(","),
        base64_encoded: "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": process.env.REPID_API_KEY,
        "x-rapidapi-host": process.env.REPID_API_HOST,
      },
    };

    async function fetchData() {
      try {
        const response = await axios.request(options);
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.error(
            "Rate limit exceeded. Try again later or upgrade your plan."
          );
        } else {
          console.error("Error while submitting batch to Judge0:", error);
        }
        throw error;
      }
    }
    while (true) {
      const result = await fetchData();
      const isResultObtained = result.submissions.every(
        (res) => res.status_id > 2
      );
      if (isResultObtained) {
        return result.submissions;
      }
      await waiting(1000);
    }
  } catch (error) {
    console.error("While Submit Token to Judge0 and got Error", error);
  }
};

module.exports = { getLanguageById, submitBatch, submitToken };
