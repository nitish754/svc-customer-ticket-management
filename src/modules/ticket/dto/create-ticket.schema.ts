import { z } from "zod";

const PrioritySchema = z.any().superRefine((value, ctx) => {
  if (value === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "priority is required"
    });
    return;
  }

  if (typeof value !== "string" && typeof value !== "number") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "priority must be a string or number"
    });
    return;
  }

  if (typeof value === "string" && value.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "priority is required"
    });
  }
});

export const CreateTicketSchema = z.object({
  customer_id: z
    .string({
      required_error: "customer_id is required",
      invalid_type_error: "customer_id must be a string"
    })
    .min(1, "customer_id is required"),
  issue_description: z
    .string({
      required_error: "issue_description is required",
      invalid_type_error: "issue_description must be a string"
    })
    .min(1, "issue_description is required"),
  priority: PrioritySchema
});

export type CreateTicketRequest = z.infer<typeof CreateTicketSchema>;
