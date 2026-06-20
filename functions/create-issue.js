const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body || "{}");

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "缺少字段" })
      };
    }

    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "没有配置 GITHUB_TOKEN" })
      };
    }

    const issue = {
      title: `💬 来自 ${name} 的留言`,
      body:
`**Name:** ${name}
**Email:** ${email}

**Message:**
${message}`,
      labels: ["message"]
    };

    const payload = JSON.stringify(issue);

    return new Promise((resolve) => {
      const req = https.request({
        hostname: "api.github.com",
        path: "/repos/weiwenjun196/mysite/issues",
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "User-Agent": "Netlify-Function",
          "Content-Type": "application/json"
        }
      }, (res) => {
        let data = "";

        res.on("data", (chunk) => data += chunk);

        res.on("end", () => {
          if (res.statusCode === 201) {
            resolve({
              statusCode: 200,
              body: JSON.stringify({ success: true })
            });
          } else {
            resolve({
              statusCode: 500,
              body: JSON.stringify({
                error: "GitHub 创建失败",
                detail: data
              })
            });
          }
        });
      });

      req.on("error", (err) => {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: err.message })
        });
      });

      req.write(payload);
      req.end();
    });

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
