// ngrok.js

const ngrok = require('ngrok');
const { exec } = require('child_process');

(async function() {
  // Start the Vue dev server
  const vueDevServer = exec('npm run serve');

  vueDevServer.stdout.on('data', (data) => {
    console.log(data.toString());

    // Look for 'Local: ' in the output to get the local dev server URL
    if (data.includes('Local:')) {
      const url = data.match(/http:\/\/localhost:\d+/)[0];
      const port = url.split(':')[2];

      // Connect ngrok to the dev server
      (async function() {
        const ngrokUrl = await ngrok.connect(port);
        console.log(`ngrok tunnel opened at: ${ngrokUrl}`);
      })();
    }
  });

  vueDevServer.stderr.on('data', (data) => {
    console.error(`Vue Dev Server Error: ${data}`);
  });
})();
