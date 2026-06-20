const https = require("https");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  // ❌ 只允许 POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body || "{}");

    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Missing GitHub token" })
      };
    }

    const payload = JSON.stringify({
      title: `💬 ${name}`,
      body: `Email: ${email}\n\n${message}`
    });

    return new Promise((resolve) => {
      const req = https.request({
        hostname: "api.github.com",
        path: "/repos/weiwenjun196/mysite/issues",
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "User-Agent": "netlify",
          "Content-Type": "application/json"
        }
      }, (res) => {
        let data = "";

        res.on("data", chunk => data += chunk);

        res.on("end", () => {
          resolve({
            statusCode: 200,
            headers,
            body: JSON.stringify({ ok: true })
          });
        });
      });

      req.on("error", (err) => {
        resolve({
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: err.message })
        });
      });

      req.write(payload);
      req.end();
    });

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
