import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT,
  bottoken: process.env.BOT_TOKEN,
  jwtsecrete: process.env.JWT_SECRET,
  supabaseurl: process.env.SUPABASE_URL,
  supabaseservicerolekey: process.env.SUPABASE_ANON_KEY,
};
