// Platform-agnostic Mailchimp subscription endpoint
// This example can be adapted for:
// - Express.js backend
// - Vercel serverless functions
// - Netlify functions
// - AWS Lambda
// - Any Node.js environment

const client = require("@mailchimp/mailchimp_marketing");

const mailChimpAPI = process.env.MAILCHIMP_API_KEY;
const mailChimpListID = process.env.MAILCHIMP_LIST_ID;
const mailchimpServer = process.env.MAILCHIMP_SERVER || "us2"; // e.g., us1, us2, us3, etc.

// Main handler function
async function subscribeToMailchimp(email) {
  if (!email) {
    throw new Error("Email is required");
  }

  // Configure Mailchimp client
  client.setConfig({
    apiKey: mailChimpAPI,
    server: mailchimpServer,
  });

  try {
    // Add member to Mailchimp list
    await client.lists.addListMember(mailChimpListID, {
      email_address: email,
      status: "subscribed",
    });

    return {
      success: true,
      message: "Successfully subscribed to the mailing list."
    };
  } catch (err) {
    // Handle "Member Exists" error gracefully
    if (err.response && err.response.status === 400 && err.response.body.title === "Member Exists") {
      return {
        success: true,
        message: "You're already subscribed!"
      };
    }

    // Re-throw other errors
    throw err;
  }
}

// ============================================
// EXAMPLE 1: Express.js Route Handler
// ============================================
// const express = require('express');
// const app = express();
// app.use(express.json());
//
// app.post('/api/subscribe', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const result = await subscribeToMailchimp(email);
//     res.json(result);
//   } catch (error) {
//     console.error('Mailchimp subscription error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to subscribe. Please try again later.'
//     });
//   }
// });

// ============================================
// EXAMPLE 2: Vercel Serverless Function
// ============================================
// module.exports = async (req, res) => {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, error: 'Method not allowed' });
//   }
//
//   try {
//     const { email } = req.body;
//     const result = await subscribeToMailchimp(email);
//     res.json(result);
//   } catch (error) {
//     console.error('Mailchimp subscription error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to subscribe. Please try again later.'
//     });
//   }
// };

// ============================================
// EXAMPLE 3: Netlify Function
// ============================================
exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    const { email } = JSON.parse(event.body);
    const result = await subscribeToMailchimp(email);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Mailchimp subscription error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Failed to subscribe. Please try again later."
      }),
    };
  }
};

// Export the main function for use in other contexts
module.exports.subscribeToMailchimp = subscribeToMailchimp;
