/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  Query,
  HttpStatus,
} from "@nestjs/common";
import { VehicleService } from "./vehicle.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { successResponse, errorResponse } from "../common/utils/response.util";

@ApiTags("vehicles")
@Controller("vehicles")
export class VehicleController {
  constructor(private readonly svc: VehicleService) {}

  // ───────────────────────────────────────────────
  // 🔹 Create a new vehicle
  // ───────────────────────────────────────────────
  @Post()
  @ApiOperation({ summary: "Add a new vehicle" })
  @ApiResponse({ status: 201, description: "Vehicle created successfully" })
  @ApiResponse({ status: 400, description: "Invalid request data" })
  async create(@Body() dto: CreateVehicleDto) {
    try {
      const result = await this.svc.create(dto);
      return successResponse("Vehicle created successfully", result);
    } catch (err) {
      return errorResponse(
        err.message || "Unable to create vehicle",
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ───────────────────────────────────────────────
  // 🔹 Get all vehicles (optional filters)
  // ───────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: "Get all vehicles",
    description:
      "Retrieves all registered vehicles. You can optionally filter by make, model, or year.",
  })
  @ApiQuery({
    name: "make",
    required: false,
    description: "Filter by manufacturer (e.g. Honda, Toyota)",
  })
  @ApiQuery({
    name: "model",
    required: false,
    description: "Filter by model (e.g. Accord, Camry)",
  })
  @ApiQuery({
    name: "year",
    required: false,
    description: "Filter by year (e.g. 2018)",
  })
  @ApiResponse({ status: 200, description: "List of all or filtered vehicles" })
  async list(
    @Query("make") make?: string,
    @Query("model") model?: string,
    @Query("year") year?: string,
  ) {
    try {
      const vehicles = await this.svc.findAll({ make, model, year });
      return successResponse("Vehicles retrieved successfully", vehicles);
    } catch (err) {
      return errorResponse(
        err.message || "Unable to retrieve vehicles",
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ───────────────────────────────────────────────
  // 🔹 Search vehicles (keyword)
  // ───────────────────────────────────────────────
  @Get("search")
  @ApiOperation({
    summary: "Search vehicles by keyword",
    description:
      "Performs a partial search by make, model, or VIN. Example: `?q=Honda`",
  })
  @ApiQuery({
    name: "q",
    required: true,
    description: "Search term (make, model, or VIN)",
  })
  @ApiResponse({ status: 200, description: "Matching vehicles found" })
  async search(@Query("q") q: string) {
    try {
      const results = await this.svc.search(q);
      return successResponse("Vehicle search completed successfully", results);
    } catch (err) {
      return errorResponse(
        err.message || "Error performing search",
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ───────────────────────────────────────────────
  // 🔹 Get a single vehicle
  // ───────────────────────────────────────────────
  @Get(":idOrVin")
  @ApiOperation({ summary: "Get a vehicle by ID or VIN" })
  @ApiResponse({ status: 200, description: "Vehicle found" })
  @ApiResponse({ status: 404, description: "Vehicle not found" })
  async get(@Param("idOrVin") idOrVin: string) {
    try {
      const vehicle = await this.svc.findByIdOrVin(idOrVin);
      if (!vehicle)
        return errorResponse("Vehicle not found", HttpStatus.NOT_FOUND);
      return successResponse("Vehicle retrieved successfully", vehicle);
    } catch (err) {
      return errorResponse(
        err.message || "Error retrieving vehicle",
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ───────────────────────────────────────────────
  // 🔹 Update vehicle details
  // ───────────────────────────────────────────────
  @Put(":idOrVin")
  @ApiOperation({ summary: "Update a vehicle by ID or VIN" })
  @ApiResponse({ status: 200, description: "Vehicle updated successfully" })
  @ApiResponse({ status: 404, description: "Vehicle not found" })
  async update(
    @Param("idOrVin") idOrVin: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    try {
      const updated = await this.svc.update(idOrVin, dto);
      if (!updated)
        return errorResponse("Vehicle not found", HttpStatus.NOT_FOUND);
      return successResponse("Vehicle updated successfully", updated);
    } catch (err) {
      return errorResponse(
        err.message || "Unable to update vehicle",
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ───────────────────────────────────────────────
  // 🔹 Delete vehicle
  // ───────────────────────────────────────────────
  @Delete(":idOrVin")
  @HttpCode(200)
  @ApiOperation({ summary: "Delete a vehicle by ID or VIN" })
  @ApiResponse({ status: 200, description: "Vehicle deleted successfully" })
  @ApiResponse({ status: 404, description: "Vehicle not found" })
  async remove(@Param("idOrVin") idOrVin: string) {
    try {
      const deleted = await this.svc.remove(idOrVin);
      if (!deleted)
        return errorResponse("Vehicle not found", HttpStatus.NOT_FOUND);
      return successResponse("Vehicle deleted successfully");
    } catch (err) {
      return errorResponse(
        err.message || "Error deleting vehicle",
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ───────────────────────────────────────────────
  // 🔹 Get vehicle valuation via VIN
  // ───────────────────────────────────────────────
  @Get(":vin/valuation")
  @ApiOperation({
    summary: "Get vehicle valuation",
    description:
      "Fetches the latest valuation for a specific vehicle using its VIN.",
  })
  @ApiResponse({ status: 200, description: "Vehicle valuation fetched" })
  @ApiResponse({
    status: 404,
    description: "Vehicle not found or valuation error",
  })
  async getValuation(@Param("vin") vin: string) {
    try {
      const valuation = await this.svc.getValuationByVin(vin);
      return successResponse(
        "Vehicle valuation retrieved successfully",
        valuation,
      );
    } catch (err) {
      return errorResponse(
        err.message || "Unable to fetch valuation",
        err.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  // ───────────────────────────────────────────────
  // 🔹 Stats endpoint (bonus)
  // ───────────────────────────────────────────────
  @Get("stats/manufacturers")
  @ApiOperation({
    summary: "Get vehicle count per manufacturer",
    description:
      "Returns a list of manufacturers and how many vehicles each has in the database.",
  })
  @ApiResponse({
    status: 200,
    description: "Manufacturer stats retrieved successfully",
    schema: {
      example: {
        status: "success",
        message: "Stats retrieved successfully",
        data: [
          { make: "Toyota", count: 5 },
          { make: "Honda", count: 3 },
        ],
      },
    },
  })
  async getManufacturerStats() {
    try {
      const stats = await this.svc.getManufacturerStats();
      return successResponse(
        "Manufacturer stats retrieved successfully",
        stats,
      );
    } catch (err) {
      return errorResponse(
        err.message || "Unable to fetch manufacturer stats",
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
