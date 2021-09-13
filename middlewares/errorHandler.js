const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'fail';
  console.log(err);

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message || err.message,
  });
};

module.exports = errorHandler;
