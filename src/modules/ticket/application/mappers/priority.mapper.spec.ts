import { BadRequestException } from '@nestjs/common';
import { mapPriority } from './priority.mapper';
import { TicketPriority } from '../../domain/enums/priority.enum';

describe('mapPriority', () => {
  it('maps string priorities', () => {
    expect(mapPriority('high')).toBe(TicketPriority.HIGH);
    expect(mapPriority('LOW')).toBe(TicketPriority.LOW);
    expect(mapPriority('  High ')).toBe(TicketPriority.HIGH);
  });

  it('maps numeric priorities', () => {
    expect(mapPriority(1)).toBe(TicketPriority.HIGH);
    expect(mapPriority(2)).toBe(TicketPriority.LOW);
  });

  it('throws for invalid priority', () => {
    expect(() => mapPriority('urgent')).toThrow(BadRequestException);
  });
});
