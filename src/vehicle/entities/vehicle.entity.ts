import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from "typeorm";

@Entity({ name: "vehicles" })
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column()
  vin: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column("int")
  year: number;

  @Column("int", { default: 0 })
  mileage: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
