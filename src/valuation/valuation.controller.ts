/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, Get, Param, HttpStatus } from "@nestjs/common";
import { ValuationService } from "./valuation.service";
import { ValuationRequestDto } from "./dto/valuation-request.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { successResponse, errorResponse } from "../common/utils/response.util";

@ApiTags("valuation")
@Controller("valuation")
export class ValuationController {
  constructor(private readonly valuationService: ValuationService) {}
  @Post()
  @ApiOperation({
    summary: "Get vehicle valuation by VIN",
    description:
      "Retrieves the valuation for a single vehicle using its VIN. Data is fetched from an external API (RapidAPI).",
  })
  @ApiBody({ type: ValuationRequestDto })
  @ApiResponse({
    status: 200,
    description: "Valuation retrieved successfully",
    schema: {
      example: {
        status: "success",
        message: "Vehicle valuation retrieved successfully",
        data: {
          vin: "1HGCM82633A004352",
          estimatedValue: 12000,
          currency: "USD",
          confidence: "high",
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid VIN or request data" })
  async getValuation(@Body() body: ValuationRequestDto) {
    try {
      const result = await this.valuationService.getValuation(body);
      if (!result) {
        return errorResponse(
          "Valuation could not be determined",
          HttpStatus.BAD_REQUEST,
        );
      }
      return successResponse(
        "Vehicle valuation retrieved successfully",
        result,
      );
    } catch (error) {
      return errorResponse(
        "Unable to fetch valuation: " + (error as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("multiple")
  @ApiOperation({
    summary: "Get valuations for multiple vehicles",
    description:
      "Takes an array of VINs and returns valuations for each. Useful for fleet or dealership analysis.",
  })
  @ApiBody({
    schema: {
      example: {
        vins: ["1HGCM82633A004352", "3N1AB7AP6HY256789", "WBA3A5G57FNS12345"],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Batch valuation completed successfully",
  })
  async getMultiple(@Body() body: { vins: string[] }) {
    try {
      if (!body.vins || !Array.isArray(body.vins) || body.vins.length === 0) {
        return errorResponse("VIN list is required", HttpStatus.BAD_REQUEST);
      }

      const results = await Promise.all(
        body.vins.map(async (vin) => {
          try {
            const data = await this.valuationService.getValuation({ vin });
            return { vin, success: true, data };
          } catch (err) {
            return { vin, success: false, error: (err as Error).message };
          }
        }),
      );

      return successResponse("Batch valuation completed successfully", results);
    } catch (error) {
      return errorResponse(
        "Unable to perform batch valuation: " + (error as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("history/:vin")
  @ApiOperation({
    summary: "Get valuation history for a VIN",
    description:
      "Fetches historical valuation data for a vehicle, useful for tracking price trends over time.",
  })
  @ApiResponse({
    status: 200,
    description: "Valuation history retrieved successfully",
    schema: {
      example: {
        status: "success",
        message: "Valuation history retrieved successfully",
        data: [
          { date: "2024-01-10", value: 13500 },
          { date: "2024-06-01", value: 12500 },
          { date: "2025-01-01", value: 12000 },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: "No history found for this VIN" })
  async getHistory(@Param("vin") vin: string) {
    try {
      const history = await this.valuationService.getValuationHistory(vin);
      if (!history || history.length === 0) {
        return errorResponse(
          "No valuation history found",
          HttpStatus.NOT_FOUND,
        );
      }
      return successResponse(
        "Valuation history retrieved successfully",
        history,
      );
    } catch (error) {
      return errorResponse(
        "Unable to fetch valuation history: " + (error as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get("stats")
  @ApiOperation({
    summary: "Get valuation statistics",
    description:
      "Returns simple aggregated stats like highest, lowest, and average valuation from stored data.",
  })
  @ApiResponse({
    status: 200,
    description: "Valuation stats retrieved successfully",
    schema: {
      example: {
        status: "success",
        message: "Valuation stats retrieved successfully",
        data: {
          highestValue: 18000,
          lowestValue: 5000,
          averageValue: 11000,
        },
      },
    },
  })
  async getStats() {
    try {
      const stats = await this.valuationService.getValuationStats();
      return successResponse("Valuation stats retrieved successfully", stats);
    } catch (error) {
      return errorResponse(
        "Unable to fetch valuation stats: " + (error as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
