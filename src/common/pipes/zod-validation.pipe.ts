import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const firstIssue = result.error.errors[0];
      const message = firstIssue?.message ?? 'Validation failed';
      throw new BadRequestException(message);
    }

    return result.data;
  }
}
