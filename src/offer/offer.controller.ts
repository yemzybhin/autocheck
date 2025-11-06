/* eslint-disable @typescript-eslint/only-throw-error */
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { OfferService } from "./offer.service";
import { successResponse } from "../common/utils/response.util";

@ApiTags("offers")
@Controller("offers")
export class OfferController {
  constructor(private readonly svc: OfferService) { }

  @Post(":loanId")
  @ApiOperation({
    summary: "Create an offer for a loan",
    description:
      "Creates a new offer tied to a specific loan. The offer contains financial terms, lender details, and validity period.",
  })
  @ApiParam({
    name: "loanId",
    description: "Unique identifier of the loan the offer is for",
    example: "c1f8c91a-2e48-4e5d-a938-7b5f305e1b91",
  })
  @ApiBody({
    schema: {
      example: {
        lenderId: "a23b9f47-9f41-4b4f-b8a1-214eac51a9a8",
        interestRate: 14.5,
        amountOffered: 5000000,
        tenureMonths: 12,
        expiryDate: "2025-12-31",
        remarks: "Preferred customer discount applied",
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Offer created successfully",
    schema: {
      example: {
        status: "success",
        message: "Offer created successfully",
        data: {
          id: "b8f9e3d4-1291-4a6d-8a8b-343cb1ceab5a",
          loanId: "c1f8c91a-2e48-4e5d-a938-7b5f305e1b91",
          lenderId: "a23b9f47-9f41-4b4f-b8a1-214eac51a9a8",
          interestRate: 14.5,
          amountOffered: 5000000,
          tenureMonths: 12,
          expiryDate: "2025-12-31",
          status: "pending",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request body or loan not found",
  })
  async create(@Param("loanId") loanId: string, @Body() body: any) {
    try {
      const data = await this.svc.createForLoan({ id: loanId } as any, body);
      return successResponse("Offer created successfully", data);
    } catch (error) {
      throw new BadRequestException(
        `Unable to create offer: ${(error as Error).message}`,
      );
    }
  }

  @Get("loan/:loanId")
  @ApiOperation({
    summary: "Retrieve offers for a specific loan",
    description:
      "Fetches all offers associated with a given loan. Returns an array of offers with their terms and statuses.",
  })
  @ApiParam({
    name: "loanId",
    description: "Unique loan identifier",
    example: "c1f8c91a-2e48-4e5d-a938-7b5f305e1b91",
  })
  @ApiResponse({
    status: 200,
    description: "Offers retrieved successfully",
    schema: {
      example: {
        status: "success",
        message: "Offers retrieved successfully",
        data: [
          {
            id: "b8f9e3d4-1291-4a6d-8a8b-343cb1ceab5a",
            loanId: "c1f8c91a-2e48-4e5d-a938-7b5f305e1b91",
            lenderId: "a23b9f47-9f41-4b4f-b8a1-214eac51a9a8",
            interestRate: 14.5,
            amountOffered: 5000000,
            tenureMonths: 12,
            status: "pending",
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: "No offers found for this loan" })
  async getForLoan(@Param("loanId") loanId: string) {
    try {
      const offers = await this.svc.findByLoanId(loanId);
      if (!offers || offers.length === 0) {
        throw new NotFoundException("No offers found");
      }
      return successResponse("Offers retrieved successfully", offers);
    } catch (error) {
      throw new NotFoundException(
        `Unable to fetch offers: ${(error as Error).message}`,
      );
    }
  }

  @Patch(":id/accept")
  @ApiOperation({
    summary: "Accept an offer",
    description:
      "Marks a specific offer as accepted and updates the loan’s status accordingly. Other offers may be automatically rejected.",
  })
  @ApiParam({
    name: "id",
    description: "Unique identifier of the offer to accept",
    example: "b8f9e3d4-1291-4a6d-8a8b-343cb1ceab5a",
  })
  @ApiResponse({
    status: 200,
    description: "Offer accepted successfully",
    schema: {
      example: {
        status: "success",
        message: "Offer accepted successfully",
        data: {
          id: "b8f9e3d4-1291-4a6d-8a8b-343cb1ceab5a",
          status: "accepted",
          acceptedAt: "2025-11-06T14:10:00Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Offer not found or already accepted",
  })
  async accept(@Param("id") id: string) {
    try {
      const result = await this.svc.acceptOffer(id);
      return successResponse("Offer accepted successfully", result);
    } catch (error) {
      throw new BadRequestException(
        `Unable to accept offer: ${(error as Error).message}`,
      );
    }
  }
}
