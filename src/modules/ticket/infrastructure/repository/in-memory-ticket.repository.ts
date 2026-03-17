import { Injectable } from '@nestjs/common';
import { TicketRepository } from '../../domain/interfaces/ticket-repository.interface';
import { Ticket } from '../../domain/interfaces/ticket.interface';

@Injectable()
export class InMemoryTicketRepository implements TicketRepository {
  private readonly store = new Map<string, Ticket>();

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(ticket: Ticket): Promise<void> {
    this.store.set(ticket.id, ticket);
  }
}
