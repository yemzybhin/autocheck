/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from "@nestjs/testing";
import { ValuationService } from "./valuation.service";
import { VinLookupProvider } from "./integrations/vin-lookup.provider";
import { BadRequestException } from "@nestjs/common";

jest.mock("./integrations/vin-lookup.provider");

describe("ValuationService", () => {
  let service: ValuationService;
  let vinProviderMock: jest.Mocked<VinLookupProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValuationService],
    }).compile();

    service = module.get<ValuationService>(ValuationService);
    vinProviderMock = new VinLookupProvider() as jest.Mocked<VinLookupProvider>;
    (service as any).vinProvider = vinProviderMock;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return valuation for valid VIN", async () => {
    vinProviderMock.getValuation.mockResolvedValueOnce(12000);

    const result = await service.getValuation({ vin: "1HGCM82633A004352" });

    expect(result).toEqual(
      expect.objectContaining({
        vin: "1HGCM82633A004352",
        estimatedValue: 12000,
        currency: "USD",
      }),
    );
  });

  it("should throw error if VIN lookup fails", async () => {
    vinProviderMock.getValuation.mockRejectedValueOnce(new Error("API error"));
    await expect(service.getValuation({ vin: "invalid" })).rejects.toThrow(
      BadRequestException,
    );
  });

  it("should handle multiple valuations", async () => {
    vinProviderMock.getValuation.mockResolvedValue(10000);

    const result = await service.getMultipleValuations([
      "VIN123",
      "VIN456",
      "VIN789",
    ]);

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty("success", true);
  });

  it("should throw error for empty VIN list", async () => {
    await expect(service.getMultipleValuations([])).rejects.toThrow(
      BadRequestException,
    );
  });

  it("should return valuation history", async () => {
    const history = await service.getValuationHistory("VIN123");
    expect(history.length).toBeGreaterThan(0);
    expect(history[0]).toHaveProperty("date");
  });

  it("should return valuation stats", async () => {
    const stats = await service.getValuationStats();
    expect(stats).toHaveProperty("highestValue");
    expect(stats).toHaveProperty("lowestValue");
    expect(stats).toHaveProperty("averageValue");
  });
});
