// Follow this setup guide to integrate the Node.js environment with your editor:
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Node.js APIs
console.log("Starting send-confirmation-email server...");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Express server to send confirmation email using Resend
const app = express();
app.use(express.json());
app.use(cors());

// You need to set this in your .env file
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "helloquillandbloom@gmail.com"; // Updated sender address

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

app.options("/", (req, res) => {
  res.set(corsHeaders);
  res.send("ok");
});

app.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }

    // Send the email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Quill & Bloom <${FROM_EMAIL}>`,
        to: email,
        subject: "Welcome to Quill & Bloom!",
        html: `<p>Thank you for subscribing to Quill & Bloom!</p>`
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(500).json({ error: errText });
      return;
    }

    res.set(corsHeaders);
    res.status(200).json({ message: "Confirmation email sent" });
  } catch (err: any) {
    console.error("Error in POST / handler:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
try {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err: any) {
  console.error("Error starting Express server:", err);
}

/* To invoke locally:

  1. Run `node index.js` (see: https://nodejs.org/en/docs/guides/getting-started-guide/)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:3000/' \
  // //    --header 'Content-Type: application/json' \
    --data '{"email":"your-email@example.com"}'

*/
