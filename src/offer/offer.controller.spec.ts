import { Test, TestingModule } from "@nestjs/testing";
import { OfferController } from "./offer.controller";
import { OfferService } from "./offer.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("OfferController", () => {
  let controller: OfferController;
  let service: OfferService;

  const mockOfferService = {
    createForLoan: jest.fn(),
    findByLoanId: jest.fn(),
    acceptOffer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferController],
      providers: [{ provide: OfferService, useValue: mockOfferService }],
    }).compile();

    controller = module.get<OfferController>(OfferController);
    service = module.get<OfferService>(OfferService);

    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should call OfferService.createForLoan with loanId and body", async () => {
      const loanId = "loan123";
      const dto = { amount: 5000 };
      const createdOffer = { id: "offer1", loanId, ...dto };

      mockOfferService.createForLoan.mockResolvedValue(createdOffer);

      const result = await controller.create(loanId, dto);

      expect(service.createForLoan).toHaveBeenCalledWith({ id: loanId }, dto);
      expect(result).toMatchObject({
        status: "success",
        message: "Offer created successfully",
        data: createdOffer,
      });
    });

    it("should throw BadRequestException on service failure", async () => {
      const loanId = "loan123";
      const dto = { amount: 5000 };
      mockOfferService.createForLoan.mockRejectedValue(
        new Error("Service failure"),
      );

      await expect(controller.create(loanId, dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(controller.create(loanId, dto)).rejects.toThrow(
        /Unable to create offer: Service failure/,
      );
    });
  });

  describe("getForLoan", () => {
    it("should call OfferService.findByLoanId and return offers", async () => {
      const loanId = "loan123";
      const offers = [
        { id: "offer1", amount: 5000 },
        { id: "offer2", amount: 6000 },
      ];

      mockOfferService.findByLoanId.mockResolvedValue(offers);

      const result = await controller.getForLoan(loanId);

      expect(service.findByLoanId).toHaveBeenCalledWith(loanId);
      expect(result).toMatchObject({
        status: "success",
        message: "Offers retrieved successfully",
        data: offers,
      });
    });

    it("should throw NotFoundException if no offers found", async () => {
      mockOfferService.findByLoanId.mockResolvedValue([]);

      await expect(controller.getForLoan("loan123")).rejects.toBeInstanceOf(
        NotFoundException,
      );
      await expect(controller.getForLoan("loan123")).rejects.toThrow(
        /No offers found/,
      );
    });
  });

  describe("accept", () => {
    it("should call OfferService.acceptOffer with correct id", async () => {
      const id = "offer123";
      const accepted = { id, status: "accepted" };

      mockOfferService.acceptOffer.mockResolvedValue(accepted);

      const result = await controller.accept(id);

      expect(service.acceptOffer).toHaveBeenCalledWith(id);
      expect(result).toMatchObject({
        status: "success",
        message: "Offer accepted successfully",
        data: accepted,
      });
    });

    it("should throw BadRequestException on error", async () => {
      const id = "offer123";
      mockOfferService.acceptOffer.mockRejectedValue(
        new Error("Offer missing"),
      );

      await expect(controller.accept(id)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(controller.accept(id)).rejects.toThrow(
        /Unable to accept offer: Offer missing/,
      );
    });
  });
});
