const axios = require("axios");
const FormData = require("form-data");

const awesomeFunction = (req, res, next) => {
  res.json("Awesome Name!");
};

const shorten = async (req, res, next) => {
  try {
    const { url } = req.body;

    // Validate URL
    if (!url || !url.trim()) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      });
    }

    // Prepare form data for CleanURI
    const formData = new FormData();
    formData.append("url", url.trim());

    // Make request to CleanURI
    const response = await axios.post(
      "https://cleanuri.com/api/v1/shorten",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    // Return the shortened URL
    return res.status(200).json({
      success: true,
      shortUrl: response.data.result_url,
      originalUrl: url,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);

    // Handle CleanURI API errors
    if (error.response && error.response.data) {
      return res.status(error.response.status || 400).json({
        success: false,
        error: error.response.data.error || "Failed to shorten URL",
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while shortening the URL",
    });
  }
};

module.exports = {
  shorten,
  awesomeFunction,
};
