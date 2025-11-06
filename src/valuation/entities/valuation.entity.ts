import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Vehicle } from "../../vehicle/entities/vehicle.entity";

@Entity({ name: "valuations" })
export class Valuation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Vehicle, (v) => v.valuations, { eager: true })
  @JoinColumn({ name: "vehicle_id" })
  vehicle: Vehicle;

  @Column("float")
  estimatedValue: number;

  @Column({ default: "simulated" })
  source: string;

  @Column("simple-json", { nullable: true })
  details: any;

  @CreateDateColumn()
  createdAt: Date;
}
