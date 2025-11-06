import { LoanStatus } from "../entities/loan.entity";

export class LoanEligibilityRule {
  static calculateApprovedAmount(
    requestedAmount: number,
    valuation: number,
  ): number {
    return Math.min(requestedAmount, valuation * 0.7);
  }

  static getStatus(
    requestedAmount: number,
    approvedAmount: number,
  ): LoanStatus {
    if (approvedAmount >= requestedAmount) return "approved";
    if (approvedAmount === 0) return "rejected";
    return "offered";
  }
}
