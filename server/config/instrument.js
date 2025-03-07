// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

//const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://c3053de9c053aac7f4ba406473d73315@o4508933036507136.ingest.us.sentry.io/4508933038669824",
  integrations: [Sentry.mongooseIntegration()]
});