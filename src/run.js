/*
 * run.sh - the entrypoint for the wsrpa util.
 */

// dependencies
const puppeteer = require('puppeteer');
const {parseArgs} = require('node:util');
const pino = require("pino");

// Set up logging
const logger = pino({
  timestamp: () => `",timestamp":"${new Date(Date.now()).toISOString()}"`,
});

// Process args
const argsv = process.argv;
const options = {
  url: {
    type: 'string',
    short: 'u'
  }
};

const {
  values,
  positionals
} = parseArgs({ argsv, options, allowPositionals: true });

const args = values;

if (! args.url) {
  logger.error("No url provided; exiting.");
  process.exit(1);
}

logger.info(`Evaluating page at: ${args.url}`);

// Run analysis on page's resources for the given url.

const perfObsRunner = () => {
  window.resourceList = [];
  new PerformanceObserver((list) => {
    list.getEntries().forEach((item) => {
      logger.info("Performance eval...");
      window.resourceList = [...window.resourceList, item.toJSON()];
    })
  }).observe({type: 'resource', buffered: true});
}

logger.info("evaluating...");

const getResourceTiming = (async () => {
  logger.info("Getting puppeteer...");
    const browser = await puppeteer.launch({headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: 'google-chrome-stable'});
    logger.debug("Getting page...");
    const page = await browser.newPage();

    logger.debug("Setting up page...");
    await page.evaluateOnNewDocument(perfObsRunner);
    logger.debug("Setting page URL...");
    await page.goto(args.url, { waitUntil: 'load', timeout: 30000 });
    logger.debug("Evaluating resources...");
    const resource = await page.evaluate(() => ({ resource: window.resourceList }))

    logger.debug("Waitig for page close...");
    await page.close();
    logger.debug("Waitig for browser close...");
    await browser.close();

    if (typeof resource !== 'undefined')
    {
      console.log(resource);
    }
    else
    {
      logger.warn("No evaluation occurred.")
    }
})();
  // .then(() => logger.info("done 1."))
  // .catch(e => logger.error(e));

// console.log(getResourceTiming);
// getResourceTiming();

logger.info("done.");


process.exit(0);
