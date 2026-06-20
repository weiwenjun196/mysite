const https = require('https');

exports.handler = async (event, context) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    // 验证必填字段
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '缺少必填字段' })
      };
    }

    // 验证数据长度
    if (name.length < 2 || name.length > 50) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '昵称长度不符合要求' })
      };
    }
    if (message.length < 5 || message.length > 1000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '留言长度不符合要求' })
      };
    }

    // 获取 GitHub Token
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'GitHub token not configured' })
      };
    }

    // 创建 Issue
    const issueBody = `**姓名**: ${name}\n**邮箱**: ${email}\n\n**留言内容**:\n${message}`;
    const issueTitle = `💬 新留言来自 ${name}`;

    const payload = JSON.stringify({
      title: issueTitle,
      body: issueBody,
      labels: ['message']
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: '/repos/weiwenjun196/mysite/issues',
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'Netlify-Function',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 201) {
            resolve({
              statusCode: 200,
              body: JSON.stringify({ success: true, message: '留言已提交' })
            });
          } else {
            resolve({
              statusCode: res.statusCode,
              body: JSON.stringify({ error: '提交失败: ' + (JSON.parse(data).message || 'Unknown error') })
            });
          }
        });
      });

      req.on('error', (error) => {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: error.message })
        });
      });

      req.write(payload);
      req.end();
    });

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
