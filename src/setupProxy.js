const { createProxyMiddleware } = require("http-proxy-middleware");

// http://localhost:3000      프론트엔트
// http://localhost:3000/api  백엔드

module.exports = function (app) {
  app.use(
    // 이 경로로 들어오는 모든 요청은
    "/api",
    // 다음 경로를 통해서 요청이 되도록 재작성한다. (rewrite)
    createProxyMiddleware({
      target: "http://localhost:3001/api",
      changeOrigin: true,
    })
  );
};

// localhost:3000/api/auth/login -> http://localhost:3001/api/auth/login
