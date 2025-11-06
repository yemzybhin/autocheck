import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("offers")
export class Offer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("float")
  amount: number;

  @Column("float")
  interestRate: number;

  @Column("int")
  termMonths: number;

  @CreateDateColumn()
  createdAt: Date;
}
