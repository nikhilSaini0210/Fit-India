const sendSuccess = (res, data = {}, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    requestId: res.req.id,
    timestamp: new Date().toISOString(),
  });
};

const sendCreated = (res, data = {}, message = "Created successfully") => {
  return sendSuccess(res, data, message, 201);
};

const sendError = (
  res,
  message = "Something went wrong",
  statusCode = 500,
  errors = null,
) => {
  const payload = {
    success: false,
    message,
    requestId: res.req.id,
    timestamp: new Date().toISOString(),
  };
  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};

const sendPaginated = (res, data, total, page, limit, message = "Success") => {
  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
  const safePage = Number(page) > 0 ? Number(page) : 1;

  return res.status(200).json({
    success: true,
    message,
    data,
    requestId: res.req.id,
    timestamp: new Date().toISOString(),
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  });
};

module.exports = { sendSuccess, sendCreated, sendError, sendPaginated };
