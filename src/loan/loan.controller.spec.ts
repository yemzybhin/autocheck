/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from "@nestjs/testing";
import { LoanController } from "./loan.controller";
import { LoanService } from "./loan.service";
import {
  BadRequestException,
  NotFoundException,
  HttpException,
} from "@nestjs/common";

describe("LoanController", () => {
  let controller: LoanController;
  let loanService: jest.Mocked<LoanService>;

  beforeEach(async () => {
    const mockLoanService = {
      submitLoan: jest.fn(),
      findAll: jest.fn(),
      findByApplicant: jest.fn(),
      findOne: jest.fn(),
      updateStatus: jest.fn(),
      getLoanSummary: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [{ provide: LoanService, useValue: mockLoanService }],
    }).compile();

    controller = module.get<LoanController>(LoanController);
    loanService = module.get(LoanService);
  });

  describe("apply", () => {
    it("should submit a loan successfully", async () => {
      const dto = { amount: 1000 } as any;
      const loan = { id: "1", amount: 1000 };
      loanService.submitLoan.mockResolvedValue(loan);

      const result = await controller.apply(dto);
      expect(result.status).toBe("success");
      expect(result.message).toContain("submitted successfully");
      expect(result.data).toEqual(loan);
    });

    it("should throw BadRequestException on failure", async () => {
      const dto = { amount: 1000 } as any;
      loanService.submitLoan.mockRejectedValue(new Error("Failed"));
      await expect(controller.apply(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(controller.apply(dto)).rejects.toThrow("Failed");
    });
  });

  describe("getAll", () => {
    it("should return all loans", async () => {
      const loans = [{ id: "1" }];
      loanService.findAll.mockResolvedValue(loans);

      const result = await controller.getAll();
      expect(result.status).toBe("success");
      expect(result.message).toContain("All loans");
      expect(result.data).toEqual(loans);
    });

    it("should throw HttpException on DB error", async () => {
      loanService.findAll.mockRejectedValue(new Error("DB Error"));
      await expect(controller.getAll()).rejects.toBeInstanceOf(HttpException);
      await expect(controller.getAll()).rejects.toThrow("DB Error");
    });
  });

  describe("getByApplicant", () => {
    it("should return loans for an applicant", async () => {
      const loans = [{ id: "1" }];
      loanService.findByApplicant.mockResolvedValue(loans);

      const result = await controller.getByApplicant("test@example.com");
      expect(result.status).toBe("success");
      expect(result.data).toEqual(loans);
    });

    it("should throw BadRequestException when applicant not found", async () => {
      loanService.findByApplicant.mockRejectedValue(
        new Error("Applicant not found"),
      );
      await expect(
        controller.getByApplicant("test@example.com"),
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(
        controller.getByApplicant("test@example.com"),
      ).rejects.toThrow("Applicant not found");
    });
  });

  describe("getById", () => {
    it("should return a loan by ID", async () => {
      const loan = { id: "1" };
      loanService.findOne.mockResolvedValue(loan);

      const result = await controller.getById("1");
      expect(result.status).toBe("success");
      expect(result.data).toEqual(loan);
    });

    it("should throw NotFoundException if loan not found", async () => {
      loanService.findOne.mockResolvedValue(null);
      await expect(controller.getById("1")).rejects.toBeInstanceOf(
        NotFoundException,
      );
      await expect(controller.getById("1")).rejects.toThrow("Loan not found");
    });
  });

  describe("approve", () => {
    it("should approve a loan", async () => {
      const updated = { id: "1", status: "approved" };
      loanService.updateStatus.mockResolvedValue(updated);

      const result = await controller.approve("1");
      expect(result.status).toBe("success");
      expect(result.message).toContain("approved successfully");
      expect(result.data).toEqual(updated);
    });

    it("should throw BadRequestException on error", async () => {
      loanService.updateStatus.mockRejectedValue(new Error("Error approving"));
      await expect(controller.approve("1")).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(controller.approve("1")).rejects.toThrow("Error approving");
    });
  });

  describe("reject", () => {
    it("should reject a loan", async () => {
      const updated = { id: "1", status: "rejected" };
      loanService.updateStatus.mockResolvedValue(updated);

      const result = await controller.reject("1");
      expect(result.status).toBe("success");
      expect(result.message).toContain("rejected successfully");
      expect(result.data).toEqual(updated);
    });

    it("should throw BadRequestException on error", async () => {
      loanService.updateStatus.mockRejectedValue(new Error("Error rejecting"));
      await expect(controller.reject("1")).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(controller.reject("1")).rejects.toThrow("Error rejecting");
    });
  });

  describe("disburse", () => {
    it("should disburse a loan", async () => {
      const updated = { id: "1", status: "disbursed" };
      loanService.updateStatus.mockResolvedValue(updated);

      const result = await controller.disburse("1");
      expect(result.status).toBe("success");
      expect(result.message).toContain("disbursed successfully");
      expect(result.data).toEqual(updated);
    });

    it("should throw BadRequestException on error", async () => {
      loanService.updateStatus.mockRejectedValue(new Error("Error disbursing"));
      await expect(controller.disburse("1")).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(controller.disburse("1")).rejects.toThrow(
        "Error disbursing",
      );
    });
  });

  describe("getSummary", () => {
    it("should return loan summary", async () => {
      const summary = { id: "1", details: "Loan summary data" };
      loanService.getLoanSummary.mockResolvedValue(summary);

      const result = await controller.getSummary("1");
      expect(result.status).toBe("success");
      expect(result.data).toEqual(summary);
    });

    it("should throw NotFoundException on error", async () => {
      loanService.getLoanSummary.mockRejectedValue(new Error("Not found"));
      await expect(controller.getSummary("1")).rejects.toBeInstanceOf(
        NotFoundException,
      );
      await expect(controller.getSummary("1")).rejects.toThrow("Not found");
    });
  });
});
