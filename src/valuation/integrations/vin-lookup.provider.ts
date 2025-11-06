/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from "axios";
import "dotenv/config";
import configuration from "src/config/configuration";

const config = configuration();
const rapidApiKey = config.rapidapi.key;
const rapidApiUrl = config.rapidapi.url;

export class VinLookupProvider {
  private apiKey = rapidApiKey;
  private apiUrl = rapidApiUrl;

  async getValuation(vin: string): Promise<number> {
    if (!this.apiKey) {
      const base = 20000;
      const random = Math.floor(Math.random() * 8000) + 5000;
      return base - random;
    }

    try {
      const response = await axios.get(this.apiUrl, {
        params: { vin },
        headers: {
          "X-RapidAPI-Key": this.apiKey,
          "X-RapidAPI-Host": this.apiUrl.replace(/^https:\/\/|\/.*$/g, ""),
        },
        timeout: 5000,
      });

      console.log("VIN lookup response:", response.data);

      const value = response.data?.price || response.data?.estimated_value || 0;
      return value || 15000;
    } catch (error) {
      console.warn("VIN lookup failed, using mock valuation");
      const base = 20000;
      const random = Math.floor(Math.random() * 8000) + 5000;
      return base - random;
    }
  }
}
