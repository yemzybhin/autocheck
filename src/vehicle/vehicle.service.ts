/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { Vehicle } from "./entities/vehicle.entity";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { NotFoundError } from "../errors/not-found-error";
import { ValuationService } from "../valuation/valuation.service";

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repo: Repository<Vehicle>,
    private readonly valuationService: ValuationService,
  ) {}

  // ───────────────────────────────────────────────
  // 🔹 Create new vehicle
  // ───────────────────────────────────────────────
  async create(dto: CreateVehicleDto) {
    const existing = await this.repo.findOne({ where: { vin: dto.vin } });
    if (existing) {
      throw new BadRequestException({
        message: "Vehicle with this VIN already exists",
        code: "vin_exists",
      });
    }
    const v = this.repo.create(dto);
    return this.repo.save(v);
  }

  // ───────────────────────────────────────────────
  // 🔹 Get all vehicles (with optional filters)
  // ───────────────────────────────────────────────
  async findAll(filters?: { make?: string; model?: string; year?: string }) {
    const where: any = {};
    if (filters?.make) where.make = ILike(`%${filters.make}%`);
    if (filters?.model) where.model = ILike(`%${filters.model}%`);
    if (filters?.year) where.year = +filters.year;

    const vehicles = await this.repo.find({
      where,
      order: { createdAt: "DESC" },
    });

    return vehicles;
  }

  // ───────────────────────────────────────────────
  // 🔹 Search vehicles by keyword
  // ───────────────────────────────────────────────
  async search(term: string) {
    if (!term || term.trim().length < 2) {
      throw new BadRequestException({
        message: "Search term must be at least 2 characters",
        code: "invalid_search_term",
      });
    }

    return this.repo.find({
      where: [
        { make: ILike(`%${term}%`) },
        { model: ILike(`%${term}%`) },
        { vin: ILike(`%${term}%`) },
      ],
      order: { createdAt: "DESC" },
    });
  }

  // ───────────────────────────────────────────────
  // 🔹 Find by ID or VIN
  // ───────────────────────────────────────────────
  async findByIdOrVin(idOrVin: string) {
    const vehicle =
      idOrVin.length === 36
        ? await this.repo.findOne({ where: { id: idOrVin } })
        : await this.repo.findOne({ where: { vin: idOrVin } });

    if (!vehicle) throw new NotFoundError("Vehicle", idOrVin);
    return vehicle;
  }

  // ───────────────────────────────────────────────
  // 🔹 Update vehicle
  // ───────────────────────────────────────────────
  async update(idOrVin: string, dto: UpdateVehicleDto) {
    const vehicle = await this.findByIdOrVin(idOrVin);
    Object.assign(vehicle, dto);
    return this.repo.save(vehicle);
  }

  // ───────────────────────────────────────────────
  // 🔹 Remove vehicle
  // ───────────────────────────────────────────────
  async remove(idOrVin: string) {
    const vehicle = await this.findByIdOrVin(idOrVin);
    await this.repo.remove(vehicle);
    return { success: true };
  }

  // ───────────────────────────────────────────────
  // 🔹 Get valuation by VIN (via external API)
  // ───────────────────────────────────────────────
  async getValuationByVin(vin: string) {
    const vehicle = await this.repo.findOne({ where: { vin } });
    if (!vehicle) throw new NotFoundError("Vehicle", vin);

    try {
      const valuation = await this.valuationService.getValuation({ vin });
      return { ...valuation, vehicle };
    } catch (err: Error | any) {
      throw new BadRequestException({
        message: "Unable to fetch vehicle valuation: " + err.message,
        code: "valuation_error",
      });
    }
  }

  // ───────────────────────────────────────────────
  // 🔹 Stats: count vehicles per manufacturer
  // ───────────────────────────────────────────────
  async getManufacturerStats() {
    const qb = this.repo
      .createQueryBuilder("vehicle")
      .select("vehicle.make", "make")
      .addSelect("COUNT(vehicle.id)", "count")
      .groupBy("vehicle.make")
      .orderBy("count", "DESC");

    const results = await qb.getRawMany();
    return results.map((r) => ({
      make: r.make,
      count: Number(r.count),
    }));
  }
}
