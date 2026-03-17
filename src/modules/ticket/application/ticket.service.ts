import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AssignmentService } from './assignment.service';
import { mapPriority } from './mappers/priority.mapper';
import { CreateTicketRequest } from '../dto/create-ticket.schema';
import { Ticket } from '../domain/interfaces/ticket.interface';
import type { TicketRepository } from '../domain/interfaces/ticket-repository.interface';
import { TICKET_REPOSITORY } from '../domain/interfaces/tokens';
import { CrmSyncProducer } from '../infrastructure/queue/crm-sync.producer';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    private readonly assignmentService: AssignmentService,
    private readonly crmSyncProducer: CrmSyncProducer,
    @Inject(TICKET_REPOSITORY) private readonly repository: TicketRepository,
  ) {}

  async createTicket(request: CreateTicketRequest): Promise<Ticket> {
    const priority = mapPriority(request.priority);

    const ticket: Ticket = {
      id: randomUUID(),
      customerId: request.customer_id,
      issue: request.issue_description,
      priority,
      agent: '',
    };

    ticket.agent = this.assignmentService.assign(ticket);
    await this.repository.save(ticket);

    await this.crmSyncProducer.enqueue(ticket);
    this.logger.log(`Ticket ${ticket.id} assigned to ${ticket.agent}`);

    return ticket;
  }
}
