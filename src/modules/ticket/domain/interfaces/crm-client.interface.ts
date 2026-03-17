import { Ticket } from './ticket.interface';

export interface CrmClient {
  notifyTicketCreated(ticket: Ticket): Promise<void>;
}
