const formatMessage = (message, errorID, contentType) => {
  let content;
  if (contentType === 'application/json') {
    const json = { message };
    // If an error ID exists, add it to the JSON body
    if (errorID) { json.id = errorID; }
    content = JSON.stringify(json);
  } else {
    content = `<response><message>${message}</message>`;
    // If error ID exists, add it to xml
    if (errorID) { content = `${content}<id>${errorID}</id>`; }
    content = `${content}</response>`;
  }
  return content;
};

const sendResponse = (response, content, contentType, statusCode, errorID) => {
  const resMsg = formatMessage(content, errorID, contentType);
  response.writeHead(statusCode, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(resMsg, 'utf-8'),
  });
  response.write(resMsg);
  response.end();
};

const getSuccess = (request, response, url, contentType) => {
  sendResponse(response, 'Successful Response', contentType, 200, null);
};

const getBadRequest = (request, response, url, contentType) => {
  let content;
  let statusCode;
  let errorID;

  // Determine success or fail
  // NOTE: Could write 2 different function calls in conditional to preserve memory (no variables)
  //        however this is more readable for now
  if (url.searchParams.get('accept') === 'true') {
    content = 'Successful Response contains valid query parameter';
    statusCode = 200;
  } else {
    content = 'Missing valid query parameter set to true';
    statusCode = 400;
    errorID = 'Bad Request';
  }

  // Send response
  sendResponse(response, content, contentType, statusCode, errorID);
};

const getUnauthorized = (request, response, url, contentType) => {
  let content;
  let statusCode;
  let errorID;

  // Determine success or fail
  // NOTE: Could write 2 different function calls in conditional to preserve memory (no variables)
  //        however this is more readable for now
  if (url.searchParams.get('loggedIn') === 'yes') {
    content = 'Successful login';
    statusCode = 200;
  } else {
    content = 'Missing loggedIn query parameter set to yes';
    statusCode = 401;
    errorID = 'Unauthorized';
  }

  // Send response
  sendResponse(response, content, contentType, statusCode, errorID);
};

const getForbidden = (request, response, url, contentType) => {
  sendResponse(response, 'You do not have access to view this content', contentType, 403, 'forbidden');
};

const getInternal = (request, response, url, contentType) => {
  sendResponse(response, 'Internal Server Error', contentType, 500, 'internalError');
};

const getNotImplemented = (request, response, url, contentType) => {
  sendResponse(response, 'This page has not been implemented yet', contentType, 501, 'notImplemented');
};

const getWrongPage = (request, response, url, contentType) => {
  sendResponse(response, 'Resource Not Found', contentType, 404, 'notFound');
};

module.exports = {
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getWrongPage,
};
