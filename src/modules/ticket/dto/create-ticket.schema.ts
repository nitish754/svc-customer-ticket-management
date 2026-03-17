import { z } from 'zod';

export const CreateTicketSchema = z.object({
  customer_id: z.string().min(1, 'customer_id is required'),
  issue_description: z.string().min(1, 'issue_description is required'),
  priority: z.union([z.string(), z.number()]),
});

export type CreateTicketRequest = z.infer<typeof CreateTicketSchema>;
