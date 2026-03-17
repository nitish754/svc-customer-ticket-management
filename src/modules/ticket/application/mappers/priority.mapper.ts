import { BadRequestException } from '@nestjs/common';
import { TicketPriority } from '../../domain/enums/priority.enum';

export function mapPriority(input: string | number): TicketPriority {
  if (typeof input === 'string') {
    const normalized = input.trim().toLowerCase();
    if (normalized === 'high') {
      return TicketPriority.HIGH;
    }
    if (normalized === 'low') {
      return TicketPriority.LOW;
    }
  }

  if (typeof input === 'number') {
    if (input === 1) {
      return TicketPriority.HIGH;
    }
    if (input === 2) {
      return TicketPriority.LOW;
    }
  }

  throw new BadRequestException('Invalid priority value');
}
