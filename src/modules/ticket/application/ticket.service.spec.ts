import { TicketService } from "./ticket.service";
import { TicketPriority } from "../domain/enums/priority.enum";
import { AssignmentService } from "./assignment.service";
import { TicketRepository } from "../domain/interfaces/ticket-repository.interface";
import { CrmSyncProducer } from "../infrastructure/queue/crm-sync.producer";


describe("TicketService", () => {
  it("assigns, stores, and enqueues CRM sync", async () => {
    const assignmentService: AssignmentService = {
      assign: jest.fn().mockReturnValue("Agent-1")
    } as unknown as AssignmentService;

    const repository: TicketRepository = {
      save: jest.fn().mockResolvedValue(undefined)
    };

    const crmProducer: CrmSyncProducer = {
      enqueue: jest.fn().mockResolvedValue(undefined)
    } as unknown as CrmSyncProducer;

    const service = new TicketService(assignmentService, crmProducer, repository);

    const ticket = await service.createTicket({
      customer_id: "cust-123",
      issue_description: "Login error",
      priority: "high"
    });

    expect(ticket.priority).toBe(TicketPriority.HIGH);
    expect(ticket.agent).toBe("Agent-1");
    expect(assignmentService.assign).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(crmProducer.enqueue).toHaveBeenCalledWith(ticket);
  });
});
