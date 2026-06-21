const lastSubmitTime = new Map();
const RATE_LIMIT_MS = 60 * 1000;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return jsonResponse(200, {});
    }

    if (request.method !== "POST") {
      return jsonResponse(405, { error: "Method Not Allowed" });
    }


    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const last = lastSubmitTime.get(ip);
    if (last && now - last < RATE_LIMIT_MS) {
      return jsonResponse(429, { error: "提交太频繁，请稍后再试" });
    }

    let name, email, message;
    try {
      const body = await request.json();
      name = (body.name || "").trim();
      email = (body.email || "").trim();
      message = (body.message || "").trim();
    } catch {
      return jsonResponse(400, { error: "请求格式错误" });
    }

    if (!name || !email || !message) {
      return jsonResponse(400, { error: "请填写完整信息" });
    }
    if (name.length > 50) {
      return jsonResponse(400, { error: "昵称太长（最多 50 字）" });
    }
    if (!isValidEmail(email)) {
      return jsonResponse(400, { error: "邮箱格式不正确" });
    }
    if (message.length > 2000) {
      return jsonResponse(400, { error: "留言太长（最多 2000 字）" });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return jsonResponse(500, { error: "Missing GitHub token" });
    }

    const payload = JSON.stringify({
      title: `💬 ${name}`,
      body: message,
    });

    try {
      const res = await fetch(
        "https://api.github.com/repos/weiwenjun196/mysite/issues",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "vercel",
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
          },
          body: payload,
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("GitHub API error:", res.status, data);
        return jsonResponse(502, {
          error: `提交失败（GitHub 返回 ${res.status}），请稍后重试`,
        });
      }

      lastSubmitTime.set(ip, now);

      return jsonResponse(200, { ok: true, issueUrl: data.html_url });
    } catch (err) {
      console.error("Request failed:", err);
      return jsonResponse(500, { error: "网络请求失败，请稍后重试" });
    }
  },
};
