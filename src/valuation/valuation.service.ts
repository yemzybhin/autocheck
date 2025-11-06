/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable, HttpStatus, BadRequestException } from "@nestjs/common";
import { VinLookupProvider } from "./integrations/vin-lookup.provider";
import { ValuationResponseDto } from "./dto/valuation-response.dto";
import { ValuationRequestDto } from "./dto/valuation-request.dto";
import configuration from "../config/configuration";
import { errorResponse } from "../common/utils/response.util";

const config = configuration();

@Injectable()
export class ValuationService {
  private vinProvider = new VinLookupProvider();
  async getValuation(data: ValuationRequestDto): Promise<ValuationResponseDto> {
    try {
      const estimatedValue = await this.vinProvider.getValuation(data.vin);

      return {
        vin: data.vin,
        estimatedValue,
        currency: "USD",
        source: config.rapidapi.key ? "api" : "mock",
        confidence: estimatedValue > 15000 ? "high" : "medium",
      };
    } catch (error) {
      throw new BadRequestException(
        "Unable to fetch valuation: " + (error as Error).message,
      );
    }
  }
  async getMultipleValuations(vins: string[]) {
    if (!vins || vins.length === 0) {
      throw new BadRequestException("VIN list cannot be empty");
    }
    const results = await Promise.all(
      vins.map(async (vin) => {
        try {
          const data = await this.getValuation({ vin });
          return { vin, success: true, data };
        } catch (err) {
          return { vin, success: false, error: (err as Error).message };
        }
      }),
    );

    return results;
  }

  async getValuationHistory(vin: string) {
    try {
      // You could later persist valuations in DB and fetch real history
      const randomBase = Math.floor(Math.random() * 8000) + 7000;
      const history = [
        { date: "2024-01-10", value: randomBase + 3000 },
        { date: "2024-06-01", value: randomBase + 1500 },
        { date: "2025-01-01", value: randomBase },
      ];

      return history;
    } catch (error) {
      return errorResponse(
        "Error fetching valuation history: " + (error as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getValuationStats() {
    try {
      // Mock example data
      const valuations = [
        { vin: "1HGCM82633A004352", estimatedValue: 12000 },
        { vin: "3N1AB7AP6HY256789", estimatedValue: 8000 },
        { vin: "WBA3A5G57FNS12345", estimatedValue: 16000 },
      ];

      const values = valuations.map((v) => v.estimatedValue);
      const highestValue = Math.max(...values);
      const lowestValue = Math.min(...values);
      const averageValue = Math.round(
        values.reduce((sum, val) => sum + val, 0) / values.length,
      );

      return { highestValue, lowestValue, averageValue };
    } catch (error) {
      throw new BadRequestException(
        "Error computing valuation stats: " + (error as Error).message,
      );
    }
  }
}
