import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { TicketController } from "./controller/ticket.controller";
import { AssignmentService } from "./application/assignment.service";
import { TicketService } from "./application/ticket.service";
import { RandomAssignmentStrategy } from "./infrastructure/assignment/random-assignment.strategy";
import { SimulatedCrmClient } from "./infrastructure/crm/simulated-crm.client";
import { InMemoryTicketRepository } from "./infrastructure/repository/in-memory-ticket.repository";
import { CrmSyncProducer } from "./infrastructure/queue/crm-sync.producer";
import { CrmSyncProcessor } from "./infrastructure/queue/crm-sync.processor";
import { ASSIGNMENT_STRATEGY, CRM_CLIENT, TICKET_REPOSITORY } from "./domain/interfaces/tokens";
import { CRM_SYNC_QUEUE } from "./infrastructure/queue/queue.constants";

@Module({
  imports: [
    BullModule.registerQueue({
      name: CRM_SYNC_QUEUE,
      connection: {
        host: process.env.REDIS_HOST ?? "localhost",
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379
      }
    })
  ],
  controllers: [TicketController],
  providers: [
    TicketService,
    AssignmentService,
    CrmSyncProducer,
    CrmSyncProcessor,
    {
      provide: ASSIGNMENT_STRATEGY,
      useClass: RandomAssignmentStrategy
    },
    {
      provide: CRM_CLIENT,
      useClass: SimulatedCrmClient
    },
    {
      provide: TICKET_REPOSITORY,
      useClass: InMemoryTicketRepository
    }
  ]
})
export class TicketModule {}
