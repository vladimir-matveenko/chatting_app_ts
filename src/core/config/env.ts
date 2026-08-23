import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  appName: process.env.APP_NAME ?? "Chatting App",
  appVersion: process.env.APP_VERSION ?? "1.0.0",
  apiUrl: process.env.API_URL ?? "http://localhost:3000",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },
};
