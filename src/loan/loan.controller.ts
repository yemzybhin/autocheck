/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { LoanService } from "./loan.service";
import { CreateLoanDto } from "./dto/create-loan.dto";
import { UpdateLoanStatusDto } from "./dto/update-loan-status.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { successResponse, errorResponse } from "../common/utils/response.util";

@ApiTags("loans")
@Controller("loans")
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post("apply")
  @ApiOperation({
    summary: "Submit a new loan application",
    description:
      "Creates a new loan request based on applicant details and vehicle information.",
  })
  @ApiBody({ type: CreateLoanDto })
  @ApiResponse({
    status: 201,
    description: "Loan application submitted successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request data",
  })
  @ApiResponse({
    status: 404,
    description: "Vehicle not found",
  })
  async apply(@Body() dto: CreateLoanDto) {
    try {
      const loan = await this.loanService.submitLoan(dto);
      return successResponse("Loan application submitted successfully", loan);
    } catch (err) {
      return errorResponse(
        err.message || "Unable to process loan application",
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: "List all loan applications",
    description:
      "Returns all loans, optionally filtered by status (approved, rejected, disbursed, etc.).",
  })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter loans by status",
    example: "approved",
  })
  @ApiResponse({
    status: 200,
    description: "List of all loans (optionally filtered)",
  })
  async getAll(@Query("status") status?: string) {
    try {
      const loans = await this.loanService.findAll(status);
      return successResponse(
        status
          ? `Loans with status '${status}' retrieved successfully`
          : "All loans retrieved successfully",
        loans,
      );
    } catch (err) {
      return errorResponse(
        err.message || "Unable to retrieve loans",
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("applicant/:email")
  @ApiOperation({
    summary: "Get all loans for a specific applicant",
    description: "Retrieves all loan applications associated with an email.",
  })
  @ApiResponse({
    status: 200,
    description: "Loans retrieved successfully for the given applicant",
  })
  async getByApplicant(@Param("email") email: string) {
    try {
      const loans = await this.loanService.findByApplicant(email);
      return successResponse(
        "Loans for applicant retrieved successfully",
        loans,
      );
    } catch (err) {
      return errorResponse(
        err.message || "Unable to retrieve applicant loans",
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get loan details by ID",
    description: "Returns detailed information for a specific loan.",
  })
  @ApiResponse({ status: 200, description: "Loan found" })
  @ApiResponse({ status: 404, description: "Loan not found" })
  async getById(@Param("id") id: string) {
    try {
      const loan = await this.loanService.findOne(id);

      if (!loan) {
        throw new NotFoundException({
          status: "error",
          message: "Loan not found",
          statusCode: HttpStatus.NOT_FOUND,
          timestamp: new Date().toISOString(),
        });
      }

      return successResponse("Loan details retrieved successfully", loan);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new NotFoundException({
        status: "error",
        message: "Unable to fetch loan: " + (error as Error).message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @Patch(":id/approve")
  @ApiOperation({ summary: "Approve a loan request" })
  @ApiResponse({ status: 200, description: "Loan approved successfully" })
  async approve(@Param("id") id: string) {
    try {
      const updated = await this.loanService.updateStatus(id, {
        status: "approved",
      } as UpdateLoanStatusDto);
      return successResponse("Loan approved successfully", updated);
    } catch (err) {
      return errorResponse(
        err.message || "Unable to approve loan",
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(":id/reject")
  @ApiOperation({ summary: "Reject a loan request" })
  @ApiResponse({ status: 200, description: "Loan rejected successfully" })
  async reject(@Param("id") id: string) {
    try {
      const updated = await this.loanService.updateStatus(id, {
        status: "rejected",
      } as UpdateLoanStatusDto);
      return successResponse("Loan rejected successfully", updated);
    } catch (err) {
      return errorResponse(
        err.message || "Unable to reject loan",
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(":id/disburse")
  @ApiOperation({ summary: "Disburse an approved loan" })
  @ApiResponse({ status: 200, description: "Loan disbursed successfully" })
  async disburse(@Param("id") id: string) {
    try {
      const updated = await this.loanService.updateStatus(id, {
        status: "disbursed",
      } as UpdateLoanStatusDto);
      return successResponse("Loan disbursed successfully", updated);
    } catch (err) {
      return errorResponse(
        err.message || "Unable to disburse loan",
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(":id/summary")
  @ApiOperation({
    summary: "Get loan summary",
    description:
      "Fetches a loan and its related vehicle and valuation details.",
  })
  @ApiResponse({
    status: 200,
    description: "Loan summary retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Loan not found" })
  async getSummary(@Param("id") id: string) {
    try {
      const summary = await this.loanService.getLoanSummary(id);
      return successResponse("Loan summary retrieved successfully", summary);
    } catch (err) {
      return errorResponse(
        err.message || "Unable to retrieve loan summary",
        err.status || HttpStatus.NOT_FOUND,
      );
    }
  }
}
