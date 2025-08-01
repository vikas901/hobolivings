import { config } from 'dotenv';
config();

// Disabling AI flows to comply with Firebase Spark plan (free tier) which has restrictions on outbound networking.
// These can be re-enabled if the project is upgraded to the Blaze (paid) plan.
