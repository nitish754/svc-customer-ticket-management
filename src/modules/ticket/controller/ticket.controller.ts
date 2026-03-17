import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { TicketService } from "../application/ticket.service";
import { CreateTicketSchema } from "../dto/create-ticket.schema";
import type { CreateTicketRequest } from "../dto/create-ticket.schema";
import { Ticket } from "../domain/interfaces/ticket.interface";

@Controller("tickets")
export class TicketController {
  private readonly logger = new Logger(TicketController.name);

  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async createTicket(
    @Body(new ZodValidationPipe(CreateTicketSchema))
    body: CreateTicketRequest
  ): Promise<Ticket> {
    this.logger.log(`Received ticket from customer ${body.customer_id}`);
    return this.ticketService.createTicket(body);
  }
}
