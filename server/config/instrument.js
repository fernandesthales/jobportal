/* Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import Sentry from "@sentry/node";
import { Integrations } from "@sentry/tracing";

//const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://c3053de9c053aac7f4ba406473d73315@o4508933036507136.ingest.us.sentry.io/4508933038669824",
  integrations: [Sentry.mongooseIntegration()]
});

*/

import Sentry from "@sentry/node";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://c3053de9c053aac7f4ba406473d73315@o4508933036507136.ingest.us.sentry.io/4508933038669824",
  integrations: [
    new Integrations.Http({ tracing: true }),
    new Integrations.Mongo({ useMongoose: true })  // ✅ Correct MongoDB integration for Mongoose
  ],
  tracesSampleRate: 1.0  // Full tracing for debugging (adjust in production)
});
