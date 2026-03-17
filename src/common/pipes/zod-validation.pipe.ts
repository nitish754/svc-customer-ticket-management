import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const message = result.error.errors
        .map((issue) => issue.message)
        .join("; ");
      throw new BadRequestException(message || "Validation failed");
    }

    return result.data;
  }
}
