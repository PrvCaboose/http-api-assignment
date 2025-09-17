const http = require('http');
const htmlHandler = require('./htmlResponses');
const statusCodeHandler = require('./statusCodeResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlHandler = (request, response, url, contentType) => {
    console.log(url.pathname);
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
    default:
        htmlHandler.getIndex(request, response);
        break;
  }
};

const onRequest = (request, response) => {
  const protocol = request.connection.encryted ? 'https' : 'http';
  const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

  // console.log(parsedURL);
  // console.log(request.headers);

  let contentType = 'application/json';
  // check accept type
  if (request.headers.accept && request.headers.accept === 'text/xml') {
    contentType = 'text/xml';
  }

  return urlHandler(request, response, parsedURL, contentType);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
