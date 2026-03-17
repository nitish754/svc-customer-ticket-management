import { TicketPriority } from '../enums/priority.enum';

export interface Ticket {
  id: string;
  customerId: string;
  issue: string;
  priority: TicketPriority;
  agent: string;
}
