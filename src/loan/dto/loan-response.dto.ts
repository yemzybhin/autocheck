import { LoanStatus } from "../entities/loan.entity";
import { Vehicle } from "../../vehicle/entities/vehicle.entity";

export class LoanResponseDto {
  id: string;
  applicantName: string;
  applicantEmail: string;
  requestedAmount: number;
  approvedAmount: number;
  status: LoanStatus;
  vehicle: Vehicle;
  createdAt: Date;
}
