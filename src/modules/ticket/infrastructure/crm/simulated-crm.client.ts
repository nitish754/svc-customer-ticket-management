import { Injectable, Logger } from "@nestjs/common";
import { CrmClient } from "../../domain/interfaces/crm-client.interface";
import { Ticket } from "../../domain/interfaces/ticket.interface";

@Injectable()
export class SimulatedCrmClient implements CrmClient {
  private readonly logger = new Logger(SimulatedCrmClient.name);

  async notifyTicketCreated(ticket: Ticket): Promise<void> {
    // Simulate network latency and occasional upstream instability.
    await new Promise((resolve) => setTimeout(resolve, 150));

    const failRate = process.env.CRM_FAIL_RATE
      ? Number(process.env.CRM_FAIL_RATE)
      : 0.35;

    if (Number.isNaN(failRate) || failRate < 0 || failRate > 1) {
      this.logger.warn(
        `CRM_FAIL_RATE is invalid (${process.env.CRM_FAIL_RATE}); using default 0.35`
      );
    }

    const effectiveFailRate =
      Number.isNaN(failRate) || failRate < 0 || failRate > 1 ? 0.35 : failRate;

    const failureRoll = Math.random();

    if (failureRoll < effectiveFailRate * 0.6) {
      this.logger.warn(`CRM timeout for ticket ${ticket.id}`);
      throw new Error("CRM timeout");
    }

    if (failureRoll < effectiveFailRate) {
      this.logger.warn(`CRM 500 for ticket ${ticket.id}`);
      throw new Error("CRM 500");
    }

    this.logger.log(`CRM ticket synced for ${ticket.id}`);
  }
}
