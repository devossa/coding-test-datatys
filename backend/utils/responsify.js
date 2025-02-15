const success = (data) => ({ success: true, code: 200, message: "", data });
const error = (code = 400, message = "", data) => ({
  success: false,
  code,
  message,
  data,
});

module.exports = {
  success,
  error,
};
