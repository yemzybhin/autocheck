/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from "@nestjs/testing";
import { VehicleController } from "./vehicle.controller";
import { VehicleService } from "./vehicle.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { HttpStatus } from "@nestjs/common";
import { successResponse, errorResponse } from "../common/utils/response.util";

jest.mock("../common/utils/response.util", () => ({
  successResponse: jest.fn((message, data) => ({
    message,
    data,
  })),
  errorResponse: jest.fn((message, status) => ({
    status: "error",
    message,
    code: status,
  })),
}));

describe("VehicleController", () => {
  let controller: VehicleController;
  let service: jest.Mocked<VehicleService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            search: jest.fn(),
            findByIdOrVin: jest
              .fn()
              .mockImplementation(() => Promise.resolve(null)),
            update: jest.fn(),
            remove: jest.fn(),
            getValuationByVin: jest.fn(),
            getManufacturerStats: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    service = module.get(VehicleService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a vehicle successfully", async () => {
    const dto: CreateVehicleDto = {
      make: "Toyota",
      model: "Corolla",
      year: 2020,
    } as any;
    const mockVehicle = { id: 1, ...dto };
    service.create.mockResolvedValue(mockVehicle);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(successResponse).toHaveBeenCalledWith(
      "Vehicle created successfully",
      mockVehicle,
    );
    // ✅ Adjusted: Check message and data, not 'status'
    expect(result).toEqual({
      message: "Vehicle created successfully",
      data: mockVehicle,
    });
  });

  it("should handle error when creating vehicle", async () => {
    const dto: CreateVehicleDto = {
      make: "Toyota",
      model: "Corolla",
      year: 2020,
    } as any;
    service.create.mockRejectedValue(new Error("DB failed"));

    const result = await controller.create(dto);

    expect(errorResponse).toHaveBeenCalledWith(
      expect.stringContaining("Unable to create vehicle"),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(result.status).toBe("error");
  });

  it("should list all vehicles", async () => {
    const mockList: any = [{ id: 1, make: "Honda" }];
    service.findAll.mockResolvedValue(mockList);
    const result = await controller.list();
    expect(service.findAll).toHaveBeenCalled();
    expect(successResponse).toHaveBeenCalledWith(
      "Vehicles retrieved successfully",
      mockList,
    );
    expect(result).toMatchObject({
      message: "Vehicles retrieved successfully",
      data: mockList,
    });
  });

  it("should return a single vehicle", async () => {
    const mockVehicle = { id: 1, vin: "123VIN" };
    service.findByIdOrVin.mockResolvedValue(mockVehicle);

    const result = await controller.get("123VIN");

    expect(service.findByIdOrVin).toHaveBeenCalledWith("123VIN");
    expect(successResponse).toHaveBeenCalledWith(
      "Vehicle retrieved successfully",
      mockVehicle,
    );
  });

  it("should return not found when vehicle does not exist", async () => {
    service.findByIdOrVin.mockResolvedValue(null);

    const result = await controller.get("notfoundVIN");

    expect(errorResponse).toHaveBeenCalledWith(
      "Vehicle not found",
      HttpStatus.NOT_FOUND,
    );
    expect(result.status).toBe("error");
  });

  it("should update vehicle successfully", async () => {
    const dto: UpdateVehicleDto = { model: "Civic" } as any;
    const updated = { id: 1, model: "Civic" };
    service.update.mockResolvedValue(updated);

    const result = await controller.update("1", dto);

    expect(service.update).toHaveBeenCalledWith("1", dto);
    expect(successResponse).toHaveBeenCalledWith(
      "Vehicle updated successfully",
      updated,
    );
  });

  it("should return 404 when updating non-existent vehicle", async () => {
    service.update.mockResolvedValue(null);

    const result = await controller.update("999", {} as any);

    expect(errorResponse).toHaveBeenCalledWith(
      "Vehicle not found",
      HttpStatus.NOT_FOUND,
    );
    expect(result.status).toBe("error");
  });

  it("should delete vehicle successfully", async () => {
    service.remove.mockResolvedValue(true);

    const result = await controller.remove("1");

    expect(service.remove).toHaveBeenCalledWith("1");
    expect(successResponse).toHaveBeenCalledWith(
      "Vehicle deleted successfully",
    );
  });

  it("should return 404 if vehicle not found during delete", async () => {
    service.remove.mockResolvedValue(false);

    const result = await controller.remove("999");

    expect(errorResponse).toHaveBeenCalledWith(
      "Vehicle not found",
      HttpStatus.NOT_FOUND,
    );
    expect(result.status).toBe("error");
  });

  it("should get vehicle valuation", async () => {
    const mockValuation = { vin: "123VIN", value: 10000 };
    service.getValuationByVin.mockResolvedValue(mockValuation);

    const result = await controller.getValuation("123VIN");

    expect(service.getValuationByVin).toHaveBeenCalledWith("123VIN");
    expect(successResponse).toHaveBeenCalledWith(
      "Vehicle valuation retrieved successfully",
      mockValuation,
    );
  });

  it("should return manufacturer stats", async () => {
    const stats = [
      { make: "Toyota", count: 5 },
      { make: "Honda", count: 3 },
    ];
    service.getManufacturerStats.mockResolvedValue(stats);

    const result = await controller.getManufacturerStats();

    expect(service.getManufacturerStats).toHaveBeenCalled();
    expect(successResponse).toHaveBeenCalledWith(
      "Manufacturer stats retrieved successfully",
      stats,
    );
  });
});
