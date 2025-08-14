import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // This application primarily acts as a frontend for the external Neighborly API
  // All authentication and data operations are handled directly by the frontend
  // connecting to https://api.neighborly.live/api
  
  // No backend routes needed for this implementation as the frontend
  // directly communicates with the external API for:
  // - OTP authentication (/auth/otp/send, /auth/otp/verify)
  // - Driver applications (/driver-applications)
  // - Application approval/rejection

  const httpServer = createServer(app);
  return httpServer;
}
