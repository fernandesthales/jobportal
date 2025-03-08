/* import { Webhook } from "svix";
import User from "../models/User.js";
import { withIsolationScope } from "@sentry/node";

//API Controler Function to Manage Clerk User with Database
export const clerkWebhooks = async (req, res) => {
    try {
        //create a Svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //verifying Headers

        await whook.verify(JSON.stringify(req.body) , {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        }) 

        //Getting Data from request body
        const {data, type} = req.body
        console.log("Incoming Webhook Data:", req.body);

        //Switch Cases for different Events
        switch (type) {
            case 'user.created':{
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || '',
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }

                await User.create(userData)
                res.json({})
                break;
                
        }
            case 'user.updated':{
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }

                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
                    
            }
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break  
            }
            default:
                break;
        }
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:'Webhooks Error'})
        
    }

} */

import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res, next) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(req.rawBody, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || '',
                    name: (data.first_name || '') + " " + (data.last_name || ''),
                    image: data.image_url || '',
                    resume: ''
                };

                await User.findByIdAndUpdate(data.id, userData, { upsert: true });
                return res.status(200).json({ success: true }); // Added `return` to prevent duplicate response
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || '',
                    name: (data.first_name || '') + " " + (data.last_name || ''),
                    image: data.image_url || ''
                };

                await User.findByIdAndUpdate(data.id, userData);
                return res.status(200).json({ success: true }); // Added `return` to prevent duplicate response
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                return res.status(200).json({ success: true }); // Added `return` to prevent duplicate response
            }
            default:
                console.log(`Unhandled event type: ${type}`);
                return res.status(200).json({ success: true }); // Default response for unrecognized events
        }
    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        return res.status(500).json({ success: false, message: 'Webhooks Error', error: error.message });
    }
};
