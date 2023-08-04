const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ status: 401, message: "Từ chối truy cập" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user_data = verified;
    if (verified) next();
  } catch (err) {
    res.status(400).json({ status: 400, message: "Token không hợp lệ" });
  }
};
const checkRole = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const role = verified.role;
    if (role) next();
    else res.status(400).json({ status: 400, message: "Bạn không phải admin" });
  } catch (err) {
    res.status(400).json({ status: 400, message: "Tocken không hơp lệ" });
  }
};
module.exports = { checkAuth, checkRole };
