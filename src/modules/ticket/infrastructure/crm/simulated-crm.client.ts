import { Injectable, Logger } from "@nestjs/common";
import { CrmClient } from "../../domain/interfaces/crm-client.interface";
import { Ticket } from "../../domain/interfaces/ticket.interface";

@Injectable()
export class SimulatedCrmClient implements CrmClient {
  private readonly logger = new Logger(SimulatedCrmClient.name);

  async notifyTicketCreated(ticket: Ticket): Promise<void> {
    // Simulate network latency and occasional upstream instability.
    await new Promise((resolve) => setTimeout(resolve, 150));

    const failureRoll = Math.random();

    if (failureRoll < 0.2) {
      this.logger.warn(`CRM timeout for ticket ${ticket.id}`);
      throw new Error("CRM timeout");
    }

    if (failureRoll < 0.35) {
      this.logger.warn(`CRM 500 for ticket ${ticket.id}`);
      throw new Error("CRM 500");
    }

    this.logger.log(`CRM ticket synced for ${ticket.id}`);
  }
}
