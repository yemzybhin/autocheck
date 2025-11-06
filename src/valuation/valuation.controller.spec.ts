/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from "@nestjs/testing";
import { ValuationController } from "./valuation.controller";
import { ValuationService } from "./valuation.service";

describe("ValuationController", () => {
  let controller: ValuationController;
  let service: ValuationService;

  const mockService = {
    getValuation: jest.fn(),
    getMultipleValuations: jest.fn(),
    getValuationHistory: jest.fn(),
    getValuationStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValuationController],
      providers: [
        {
          provide: ValuationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ValuationController>(ValuationController);
    service = module.get<ValuationService>(ValuationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get single valuation successfully", async () => {
    const mockBody = { vin: "VIN123" };
    const mockResponse = {
      vin: "VIN123",
      estimatedValue: 15000,
      currency: "USD",
      confidence: "high",
    };

    mockService.getValuation.mockResolvedValue(mockResponse);

    const result = await controller.getValuation(mockBody);

    expect(result.status).toBe("success");
    expect(result.data).toEqual(mockResponse);
  });

  it("should handle error during single valuation fetch", async () => {
    const mockBody = { vin: "VIN123" };
    mockService.getValuation.mockRejectedValue(new Error("API Error"));

    await expect(controller.getValuation(mockBody)).rejects.toThrow(
      "Unable to fetch valuation: API Error",
    );
  });

  it("should get multiple valuations successfully", async () => {
    const mockBody = { vins: ["VIN1", "VIN2"] };
    const mockResult = [
      { vin: "VIN1", success: true, data: { estimatedValue: 10000 } },
      { vin: "VIN2", success: true, data: { estimatedValue: 12000 } },
    ];

    mockService.getValuation.mockImplementation(async ({ vin }) => ({
      vin,
      estimatedValue: vin === "VIN1" ? 10000 : 12000,
      currency: "USD",
      confidence: "high",
    }));

    const result = await controller.getMultiple(mockBody);

    expect(result.status).toBe("success");
    expect(result.data).toHaveLength(2);
  });

  it("should return error for empty VIN list in batch", async () => {
    await expect(controller.getMultiple({ vins: [] })).rejects.toThrow(
      "Unable to perform batch valuation: VIN list is required",
    );
  });

  it("should return valuation history successfully", async () => {
    const mockHistory = [{ date: "2024-01-01", value: 10000 }];
    mockService.getValuationHistory.mockResolvedValue(mockHistory);

    const result = await controller.getHistory("VIN123");

    expect(result.status).toBe("success");
    expect(result.data).toHaveLength(1);
  });

  it("should handle empty valuation history", async () => {
    mockService.getValuationHistory.mockResolvedValue([]);

    await expect(controller.getHistory("INVALIDVIN")).rejects.toThrow(
      "Unable to fetch valuation history: No valuation history found",
    );
  });

  it("should return valuation stats successfully", async () => {
    const mockStats = {
      highestValue: 20000,
      lowestValue: 8000,
      averageValue: 13000,
    };
    mockService.getValuationStats.mockResolvedValue(mockStats);

    const result = await controller.getStats();

    expect(result).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Valuation stats retrieved successfully",
        data: expect.objectContaining({
          highestValue: expect.any(Number),
          lowestValue: expect.any(Number),
          averageValue: expect.any(Number),
        }),
      }),
    );
  });
});
