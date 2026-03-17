import { AssignmentStrategy } from '../../domain/interfaces/assignment-strategy.interface';
import { Ticket } from '../../domain/interfaces/ticket.interface';

export class RandomAssignmentStrategy implements AssignmentStrategy {
  private readonly agents = ['Aiden', 'Sofia', 'Liam', 'Noah', 'Mia'];

  assign(_ticket: Ticket): string {
    const index = Math.floor(Math.random() * this.agents.length);
    return this.agents[index];
  }
}
