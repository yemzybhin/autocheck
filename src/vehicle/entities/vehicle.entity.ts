import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Valuation } from "../../valuation/entities/valuation.entity";
import { User } from "../../user/entities/user.entity";

@Entity({ name: "vehicles" })
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  vin: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column("int")
  year: number;

  @Column("int", { default: 0 })
  mileage: number;

  @ManyToOne(() => User, (u) => u.vehicles, { eager: true, nullable: true })
  @JoinColumn({ name: "owner_id" })
  owner: User;

  @OneToMany(() => Valuation, (v) => v.vehicle)
  valuations: Valuation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
