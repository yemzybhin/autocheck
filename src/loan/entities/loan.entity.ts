import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Vehicle } from "../../vehicle/entities/vehicle.entity";

export type LoanStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "offered"
  | "disbursed"
  | "cancelled";

@Entity({ name: "loans" })
export class Loan {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  applicantName: string;

  @Column()
  applicantEmail: string;

  @Column("decimal", { precision: 12, scale: 2 })
  requestedAmount: number;

  @Column("decimal", { precision: 12, scale: 2, default: 0 })
  approvedAmount: number;

  @Column({ type: "varchar", default: "pending" })
  status: LoanStatus;

  @ManyToOne(() => Vehicle, { eager: true })
  @JoinColumn({ name: "vehicleId" })
  vehicle: Vehicle;

  @Column()
  vehicleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
