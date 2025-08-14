// This application uses an external API (Neighborly) for all data operations
// No local storage is required as all authentication and data management
// is handled by the external service at https://api.neighborly.live/api

export interface IStorage {
  // No storage interface needed for this implementation
}

export class MemStorage implements IStorage {
  constructor() {
    // No local storage needed
  }
}

export const storage = new MemStorage();
