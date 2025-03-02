const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const FormData = require("form-data");

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("URL Shortener API is running");
});

/**
 * URL Shortening endpoint
 * Takes a URL and returns a shortened version using CleanURI
 */
app.post("/api/shorten", async (req, res) => {
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
});

// Start the server
app.listen(PORT, () => {
  console.log(`URL Shortener server running on port ${PORT}`);
});

// Error handling for unhandled promises
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error);
});
