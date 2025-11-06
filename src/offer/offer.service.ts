import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Offer } from "./entities/offer.entity";
import { Loan } from "../loan/entities/loan.entity";

@Injectable()
export class OfferService {
  constructor(@InjectRepository(Offer) private repo: Repository<Offer>) {}

  createForLoan(loan: Loan, data: Partial<Offer>) {
    const o = this.repo.create({ ...data, loan });
    return this.repo.save(o);
  }

  findByLoanId(loanId: string) {
    return this.repo.find({ where: { loan: { id: loanId } } });
  }

  async acceptOffer(offerId: string) {
    const offer = await this.repo.findOne({ where: { id: offerId } });
    if (!offer) throw new NotFoundException("Offer not found");
    offer.status = "accepted";
    return this.repo.save(offer);
  }
}
