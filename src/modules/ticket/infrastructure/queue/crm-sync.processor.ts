import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import { CRM_SYNC_JOB, CRM_SYNC_QUEUE } from './queue.constants';
import type { CrmClient } from '../../domain/interfaces/crm-client.interface';
import type { Ticket } from '../../domain/interfaces/ticket.interface';
import { CRM_CLIENT } from '../../domain/interfaces/tokens';

@Processor(CRM_SYNC_QUEUE)
export class CrmSyncProcessor extends WorkerHost {
  private readonly logger = new Logger(CrmSyncProcessor.name);

  constructor(@Inject(CRM_CLIENT) private readonly crmClient: CrmClient) {
    super();
  }

  async process(job: Job<{ ticket: Ticket }>): Promise<void> {
    if (job.name !== CRM_SYNC_JOB) {
      return;
    }

    const { ticket } = job.data;
    this.logger.log(
      `Syncing ticket ${ticket.id} to CRM (attempt ${job.attemptsMade + 1})`,
    );
    await this.crmClient.notifyTicketCreated(ticket);
  }
}
