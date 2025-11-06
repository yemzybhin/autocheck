/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Loan, LoanStatus } from "./entities/loan.entity";
import { Vehicle } from "../vehicle/entities/vehicle.entity";
import { ValuationService } from "../valuation/valuation.service";
import { CreateLoanDto } from "./dto/create-loan.dto";
import { UpdateLoanStatusDto } from "./dto/update-loan-status.dto";
import { LoanEligibilityRule } from "./rules/loan-eligibility.rule";

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan) private readonly loanRepo: Repository<Loan>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    private readonly valuationService: ValuationService,
  ) {}
  
  async submitLoan(dto: CreateLoanDto) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: dto.vehicleId },
    });

    if (!vehicle) throw new NotFoundException("Vehicle not found");

    const valuation = await this.valuationService.getValuation({
      vin: vehicle.vin,
    });

    const approvedAmount = LoanEligibilityRule.calculateApprovedAmount(
      dto.requestedAmount,
      valuation.estimatedValue,
    );

    const status = LoanEligibilityRule.getStatus(
      dto.requestedAmount,
      approvedAmount,
    );

    const loan = this.loanRepo.create({
      ...dto,
      approvedAmount,
      status,
      vehicle,
    });

    return this.loanRepo.save(loan);
  }

  async findAll(status?: string) {
    let where: any = {};
    if (status && Object.values(status).includes(status as LoanStatus)) {
      where = { status: status as LoanStatus };
    }

    return this.loanRepo.find({
      where,
      relations: ["vehicle"],
      order: { createdAt: "DESC" },
    });
  }

  async findByApplicant(email: string) {
    const loans = await this.loanRepo.find({
      where: { applicantEmail: email },
      relations: ["vehicle"],
      order: { createdAt: "DESC" },
    });

    if (!loans.length)
      throw new NotFoundException(`No loan applications found for ${email}`);

    return loans;
  }

  async findOne(id: string) {
    const loan = await this.loanRepo.findOne({
      where: { id },
      relations: ["vehicle"],
    });
    if (!loan) throw new NotFoundException("Loan not found");
    return loan;
  }

  async updateStatus(id: string, dto: UpdateLoanStatusDto) {
    const loan = await this.findOne(id);
    loan.status = dto.status;
    return this.loanRepo.save(loan);
  }

  async getLoanSummary(id: string) {
    const loan = await this.findOne(id);
    if (!loan) throw new NotFoundException("Loan not found");

    const valuation = await this.valuationService.getValuation({
      vin: loan.vehicle.vin,
    });

    return {
      loanId: loan.id,
      applicantName: loan.applicantName,
      status: loan.status,
      amountRequested: loan.amountRequested,
      approvedAmount: loan.approvedAmount,
      vehicle: {
        vin: loan.vehicle.vin,
        make: loan.vehicle.make,
        model: loan.vehicle.model,
        year: loan.vehicle.year,
      },
      valuation: {
        estimatedValue: valuation.estimatedValue,
        confidence: valuation.confidence || "moderate",
      },
    };
  }
}
