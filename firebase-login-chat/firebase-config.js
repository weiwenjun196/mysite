const firebaseConfig = {
  apiKey: "AIzaSyBvUEAPV1Sfw2NCLSyiiLk30FrYKP1pA-Y",
  authDomain: "mysite-491e8.firebaseapp.com",
  databaseURL: "https://mysite-491e8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mysite-491e8",
  storageBucket: "mysite-491e8.firebasestorage.app",
  messagingSenderId: "840336638207",
  appId: "1:840336638207:web:2bea198b8a935048084cca",
  measurementId: "G-S8DKWQFMJF"
};
/*
========== 使用前必须先做这一步：开启 Authentication ==========

1. 打开 https://console.firebase.google.com/project/mysite-491e8/authentication
2. 点击"开始使用" (Get started)
3. 在登录方式列表里找到"电子邮件地址/密码" (Email/Password)，点击启用
4. 保存

========== 然后手动创建两个用户账号 ==========

还是在 Authentication 页面，点击"用户" (Users) 标签 -> "添加用户" (Add user)
创建两个账号，例如：
  邮箱: bob@mysite.com   密码: 你自己定（至少6位）
  邮箱: alice@mysite.com 密码: 你自己定（至少6位）

注意：Firebase Authentication 的邮箱/密码登录要求邮箱格式（必须带@），
即使你的"用户名"只是 bob，登录时也要用类似 bob@mysite.com 这种邮箱格式。
这是 Firebase 的限制，不是真的会发邮件，可以随便用一个不存在的域名。

========== 数据库安全规则也需要更新 ==========

之前的"测试模式"规则是任何人都能读写，现在有了登录系统，
建议改成只有登录用户才能读写：

{
  "rules": {
    "messages": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}

去 Realtime Database -> 规则 标签，粘贴上面这段，保存。
*/
