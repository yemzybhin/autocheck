/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from "axios";
import configuration from "../../config/configuration";

const config = configuration();

export class VinLookupProvider {
  private apiKey = config.rapidapi.key;
  private apiHost = "vin-lookup2.p.rapidapi.com";
  private apiUrl = `https://${this.apiHost}/vehicle-lookup`;

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
          "X-RapidAPI-Host": this.apiHost,
        },
        timeout: 5000,
      });

      console.log("VIN lookup response:", response.data);
      const value =
        response.data?.price ||
        response.data?.estimated_value ||
        response.data?.data?.market_value ||
        0;

      return value || 15000;
    } catch (error) {
      console.warn("VIN lookup failed, using mock valuation", error.message);
      const base = 20000;
      const random = Math.floor(Math.random() * 8000) + 5000;
      return base - random;
    }
  }
}
