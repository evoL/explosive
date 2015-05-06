import jsdom from "jsdom";
import url from "url";
import fs from "fs";
import assign from "object-assign";
import explosive from "./explosive";

function urlFor(request) {
  let parsedUrl = url.parse(request.url);
  parsedUrl.protocol = request.protocol;
  parsedUrl.host = request.headers.host;

  return url.format(parsedUrl);
};

export default function(passedOptions) {
  let options = assign({
    timeout: 5000,
    debug: false
    // layout => layout file name or null
  }, passedOptions);

  return function(request, response, next) {
    let formattedUrl = urlFor(request);
    let responseSent = false;
    let responseTimeout;
    let sendResponse = function(r) {
      if (responseSent) {
        return;
      }

      response.send(r);
      responseSent = true;
      requestFinished();
    };
    let requestFinished = function() {
      clearTimeout(responseTimeout);
    };

    if (options.debug) {
      console.log(`${request.method} ${formattedUrl}`);
    }

    let layout;
    if (options.layout === null) {
      layout = "<html><body></body></html>";
    } else {
      layout = fs.readFileSync(options.layout);
    }

    let document = jsdom.jsdom(layout, {
      url: formattedUrl,
      document: {
        referrer: request.headers.referer,
        cookie: request.headers.cookie
      }
    });
    let window = document.defaultView;

    // Render the error list if something goes wrong
    window.addEventListener('load', function() {
      if (document.errors) {
        response.statusCode = 500;
        sendResponse(
          "<h1>There were errors while trying to prerender the page.</h1><ul>" +
          document.errors.map((e) => `<li><strong>${e.message}</strong><br><pre>${e.data.error}</pre></li>`).join('') +
          "</ul>"
        );
      }
    });

    // Redirect the console
    if (options.debug) {
      let virtualConsole = jsdom.getVirtualConsole(window);
      virtualConsole.on("log", function(message) {
        console.log("Client-side -", message);
      });
    }

    // Setup Explosive runtime
    window.explosive = explosive;
    let explosiveInstance = explosive();
    let sendDocument = function() {
      if (responseSent) {
        return;
      }

      // Create an element with shared state
      let sharedState = explosiveInstance.state();
      let scriptContent = `window._explosiveState = ${JSON.stringify(sharedState)};`;

      let script = document.createElement('script');
      script.appendChild(document.createTextNode(scriptContent));

      // Insert the state before any other scripts
      let firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);

      // Send HTML
      response.statusCode = 200;
      sendResponse(jsdom.serializeDocument(document));
    }

    // Let the page render after the timeout
    responseTimeout = setTimeout(sendDocument, options.timeout);

    // Send the document once the frontend tells us to.
    explosiveInstance.once('load:finish', sendDocument);

    // Handle the Page Not Found situation
    explosiveInstance.once('page:not_found', function() {
      requestFinished();
      next();
    });
  };
};
