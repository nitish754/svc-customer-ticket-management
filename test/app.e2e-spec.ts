import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import request from 'supertest';
import { TicketController } from '../src/modules/ticket/controller/ticket.controller';
import { TicketService } from '../src/modules/ticket/application/ticket.service';
import { AssignmentService } from '../src/modules/ticket/application/assignment.service';
import {
  ASSIGNMENT_STRATEGY,
  TICKET_REPOSITORY,
} from '../src/modules/ticket/domain/interfaces/tokens';
import { TicketRepository } from '../src/modules/ticket/domain/interfaces/ticket-repository.interface';
import { CrmSyncProducer } from '../src/modules/ticket/infrastructure/queue/crm-sync.producer';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { AssignmentStrategy } from '../src/modules/ticket/domain/interfaces/assignment-strategy.interface';

class StubAssignmentStrategy implements AssignmentStrategy {
  assign(): string {
    return 'Agent-1';
  }
}

class InMemoryRepo implements TicketRepository {
  // eslint-disable-next-line @typescript-eslint/require-await
  async save(): Promise<void> {
    return undefined;
  }
}

describe('TicketController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        TicketService,
        AssignmentService,
        {
          provide: ASSIGNMENT_STRATEGY,
          useClass: StubAssignmentStrategy,
        },
        {
          provide: TICKET_REPOSITORY,
          useClass: InMemoryRepo,
        },
        {
          provide: CrmSyncProducer,
          useValue: {
            enqueue: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /tickets returns assigned ticket', async () => {
    const response = await request(app.getHttpServer())
      .post('/tickets')
      .send({
        customer_id: 'cust-1',
        issue_description: 'Login issue',
        priority: 'high',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      customerId: 'cust-1',
      issue: 'Login issue',
      priority: 1,
      agent: 'Agent-1',
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body?.id).toBeDefined();
  });

  it('POST /tickets returns unified error for invalid payload', async () => {
    const response = await request(app.getHttpServer())
      .post('/tickets')
      .send({
        issue_description: 'Missing customer',
        priority: 'high',
      })
      .expect(400);

    expect(response.body).toEqual({
      success: false,
      error: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message: expect.any(String),
        code: 'VALIDATION_ERROR',
      },
    });
  });
});
