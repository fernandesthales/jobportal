/*

import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'

//Initialize Express
const app = express()

//Connect to database
  await connectDB();

//Middlewares
app.use(cors())
app.use(express.json({
  verify: (req, res, buf) => {
      req.rawBody = buf.toString(); // Store the raw body for webhook verification
  }
}));

//Routes
app.get('/', (req, res) => res.send("API Working"))

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

app.post('/webhooks', clerkWebhooks)
Sentry.setupExpressErrorHandler(app);

//Port
const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
}) */

    import './config/instrument.js';
    import express from 'express';
    import cors from 'cors';
    import 'dotenv/config';
    import connectDB from './config/db.js';
    import * as Sentry from "@sentry/node";
    import * as Tracing from "@sentry/tracing"; // Adicionando importação necessária
    import { clerkWebhooks } from './controllers/webhooks.js';
    
    const app = express();
    
    Sentry.init({
      dsn: "https://c3053de9c053aac7f4ba406473d73315@o4508933036507136.ingest.us.sentry.io/4508933038669824",
      integrations: [ // Corrigido "ntegrations" para "integrations"
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
      ],
      tracesSampleRate: 1.0
    });
    
    // Sentry Handlers - na ordem correta
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
    
    // Middleware
    app.use(cors());
    app.use(express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        }
    }));
    
    // Routes
    app.get('/', async (req, res) => {
        await connectDB();
        return res.send("API Working");
    });
    
    app.post('/webhooks', async (req, res) => {
        await connectDB();
        await clerkWebhooks(req, res);
    });
    
    // Error Handler - deve vir depois das rotas
    app.use(Sentry.Handlers.errorHandler());
    
    // Port
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server running on PORT ${PORT}`));
