const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "缺少必填字段" })
      };
    }

    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GITHUB_TOKEN 未配置" })
      };
    }

    const issueTitle = `💬 新留言来自 ${name}`;
    const issueBody =
      `**姓名:** ${name}\n` +
      `**邮箱:** ${email}\n\n` +
      `**留言:**\n${message}`;

    const payload = JSON.stringify({
      title: issueTitle,
      body: issueBody,
      labels: ["message"]
    });

    return new Promise((resolve) => {
      const req = https.request(
        {
          hostname: "api.github.com",
          path: "/repos/weiwenjun196/mysite/issues",
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "User-Agent": "Netlify-Function",
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload)
          }
        },
        (res) => {
          let data = "";

          res.on("data", (chunk) => (data += chunk));

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
                  error: "GitHub 创建 Issue 失败",
                  detail: data
                })
              });
            }
          });
        }
      );

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
