/* Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import Sentry from "@sentry/node";
import { Integrations } from "@sentry/tracing";

//const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://c3053de9c053aac7f4ba406473d73315@o4508933036507136.ingest.us.sentry.io/4508933038669824",
  integrations: [Sentry.mongooseIntegration()]
});

*/

// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

//const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://2ee487093100280c015534308f7ee320@o4508933036507136.ingest.us.sentry.io/4508955664842752",
});
