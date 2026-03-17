import { Ticket } from './ticket.interface';

export interface TicketRepository {
  save(ticket: Ticket): Promise<void>;
}
