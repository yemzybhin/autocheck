import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Vehicle } from "../../vehicle/entities/vehicle.entity";
import { Offer } from "../../offer/entities/offer.entity";
import { User } from "../../user/entities/user.entity";

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

  @ManyToOne(() => Vehicle, { eager: true })
  @JoinColumn({ name: "vehicleId" })
  vehicle: Vehicle;

  @Column()
  vehicleId: string;

  @Column()
  applicantEmail: string;

  @Column()
  applicantName: string;

  @ManyToOne(() => User, (u) => u.loans, { eager: true, nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column("float")
  amountRequested: number;

  @Column("float", { nullable: true })
  approvedAmount: number;

  @Column("int")
  termMonths: number;

  @Column({ type: "varchar", default: "pending" })
  status: LoanStatus;

  @OneToMany(() => Offer, (o) => o.loan)
  offers: Offer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
