import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'

//Initialize Express
const app = express()

//Connect to database
await connectDB();
await connectCloudinary();

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
app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
Sentry.setupExpressErrorHandler(app);

//Port
const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})