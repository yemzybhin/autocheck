import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Loan } from "../../loan/entities/loan.entity";

@Entity({ name: "offers" })
export class Offer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("float")
  offerAmount: number;

  @Column("float")
  interestRate: number;

  @Column("int")
  tenureMonths: number;

  @Column({ default: "pending" })
  status: string;

  @ManyToOne(() => Loan, (loan) => loan.offers, { eager: true })
  @JoinColumn({ name: "loan_id" })
  loan: Loan;

  @CreateDateColumn()
  createdAt: Date;
}
