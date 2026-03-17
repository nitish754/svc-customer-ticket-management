import { Inject, Injectable } from '@nestjs/common';
import type { AssignmentStrategy } from '../domain/interfaces/assignment-strategy.interface';
import { ASSIGNMENT_STRATEGY } from '../domain/interfaces/tokens';
import { Ticket } from '../domain/interfaces/ticket.interface';

@Injectable()
export class AssignmentService {
  constructor(
    @Inject(ASSIGNMENT_STRATEGY) private readonly strategy: AssignmentStrategy,
  ) {}

  assign(ticket: Ticket): string {
    return this.strategy.assign(ticket);
  }
}
