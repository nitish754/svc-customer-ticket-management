import { Ticket } from './ticket.interface';

export interface AssignmentStrategy {
  assign(ticket: Ticket): string;
}
