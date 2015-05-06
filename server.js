"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _jsdom = require("jsdom");

var _jsdom2 = _interopRequireDefault(_jsdom);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _explosive = require("./explosive");

var _explosive2 = _interopRequireDefault(_explosive);

function urlFor(request) {
  var parsedUrl = _url2["default"].parse(request.url);
  parsedUrl.protocol = request.protocol;
  parsedUrl.host = request.headers.host;

  return _url2["default"].format(parsedUrl);
};

exports["default"] = function (passedOptions) {
  var options = _objectAssign2["default"]({
    timeout: 5000,
    debug: false
    // layout => layout file name or null
  }, passedOptions);

  return function (request, response, next) {
    var formattedUrl = urlFor(request);
    var responseSent = false;
    var responseTimeout = undefined;
    var sendResponse = function sendResponse(r) {
      if (responseSent) {
        return;
      }

      response.send(r);
      responseSent = true;
      requestFinished();
    };
    var requestFinished = function requestFinished() {
      clearTimeout(responseTimeout);
    };

    if (options.debug) {
      console.log("" + request.method + " " + formattedUrl);
    }

    var layout = undefined;
    if (options.layout === null) {
      layout = "<html><body></body></html>";
    } else {
      layout = _fs2["default"].readFileSync(options.layout);
    }

    var document = _jsdom2["default"].jsdom(layout, {
      url: formattedUrl,
      document: {
        referrer: request.headers.referer,
        cookie: request.headers.cookie
      }
    });
    var window = document.defaultView;

    // Render the error list if something goes wrong
    window.addEventListener("load", function () {
      if (document.errors) {
        response.statusCode = 500;
        sendResponse("<h1>There were errors while trying to prerender the page.</h1><ul>" + document.errors.map(function (e) {
          return "<li><strong>" + e.message + "</strong><br><pre>" + e.data.error + "</pre></li>";
        }).join("") + "</ul>");
      }
    });

    // Redirect the console
    if (options.debug) {
      var virtualConsole = _jsdom2["default"].getVirtualConsole(window);
      virtualConsole.on("log", function (message) {
        console.log("Client-side -", message);
      });
    }

    // Setup Explosive runtime
    window.explosive = _explosive2["default"];
    var explosiveInstance = _explosive2["default"]();
    var sendDocument = function sendDocument() {
      if (responseSent) {
        return;
      }

      // Create an element with shared state
      var sharedState = explosiveInstance.state();
      var scriptContent = "window._explosiveState = " + JSON.stringify(sharedState) + ";";

      var script = document.createElement("script");
      script.appendChild(document.createTextNode(scriptContent));

      // Insert the state before any other scripts
      var firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);

      // Send HTML
      response.statusCode = 200;
      sendResponse(_jsdom2["default"].serializeDocument(document));
    };

    // Let the page render after the timeout
    responseTimeout = setTimeout(sendDocument, options.timeout);

    // Send the document once the frontend tells us to.
    explosiveInstance.once("load:finish", sendDocument);

    // Handle the Page Not Found situation
    explosiveInstance.once("page:not_found", function () {
      requestFinished();
      next();
    });
  };
};

;
module.exports = exports["default"];