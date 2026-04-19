// Simple http response handler, handles plain js errors as well
module.exports = (statusCode, data) => {
  if (!statusCode) {
    throw new Error('Missing required parameter "statusCode"')
  }

  if (!data) {
    throw new Error('Missing required parameter "data"')
  }

  if (statusCode === 200) {
    return {
      status: 200,
      jsonBody: data
    }
  }

  const error = data.response?.data || data.stack || data.toString()
  const message = data.toString()
  return {
    status: statusCode,
    jsonBody: {
      message,
      data: error
    }
  }
}
