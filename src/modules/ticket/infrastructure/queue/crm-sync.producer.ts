import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Ticket } from '../../domain/interfaces/ticket.interface';
import { CRM_SYNC_JOB, CRM_SYNC_QUEUE } from './queue.constants';

@Injectable()
export class CrmSyncProducer {
  constructor(@InjectQueue(CRM_SYNC_QUEUE) private readonly queue: Queue) {}

  async enqueue(ticket: Ticket): Promise<void> {
    await this.queue.add(
      CRM_SYNC_JOB,
      {
        ticket,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: 50,
      },
    );
  }
}
