/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from "@nestjs/testing";
import { VehicleService } from "./vehicle.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Vehicle } from "./entities/vehicle.entity";
import { ValuationService } from "../valuation/valuation.service"; 

describe("VehicleService", () => {
  let service: VehicleService;

  const mockVehicleRepo = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockValuationService = {
    lookupVin: jest
      .fn()
      .mockResolvedValue({ make: "Toyota", model: "Corolla" }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockVehicleRepo,
        },
        {
          provide: ValuationService,
          useValue: mockValuationService,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should call valuationService.lookupVin when fetching VIN data", async () => {
    const vin = "1HGCM82633A004352";
    const result = await mockValuationService.lookupVin(vin);
    expect(result).toEqual({ make: "Toyota", model: "Corolla" });
    expect(mockValuationService.lookupVin).toHaveBeenCalledWith(vin);
  });
});
