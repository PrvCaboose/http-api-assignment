const http = require('http');
const htmlHandler = require('./htmlResponses');
const statusCodeHandler = require('./statusCodeResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlHandler = (request, response, url, contentType) => {
  switch (url.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getStyles(request, response);
      break;
    case '/success':
      statusCodeHandler.getSuccess(request, response, url, contentType);
      break;
    case '/badRequest':
      statusCodeHandler.getBadRequest(request, response, url, contentType);
      break;
    case '/unauthorized':
      statusCodeHandler.getUnauthorized(request, response, url, contentType);
      break;
    case '/forbidden':
      statusCodeHandler.getForbidden(request, response, url, contentType);
      break;
    case '/internal':
      statusCodeHandler.getInternal(request, response, url, contentType);
      break;
    case '/notImplemented':
      statusCodeHandler.getNotImplemented(request, response, url, contentType);
      break;
    default:
      statusCodeHandler.getWrongPage(request, response, url, contentType);
      break;
  }
};

const onRequest = (request, response) => {
  const protocol = request.connection.encryted ? 'https' : 'http';
  const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

  let contentType = 'application/json';
  // check accept type
  if (request.headers.accept && request.headers.accept === 'text/xml') {
    contentType = 'text/xml';
  }

  return urlHandler(request, response, parsedURL, contentType);
};

http.createServer(onRequest).listen(port, () => {
  //console.log(`Listening on 127.0.0.1:${port}`);
});
