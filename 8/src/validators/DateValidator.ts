import { BaseValidator, ValidationResult } from '../types';

/**
 * Validator for Date values with ISO string support
 */
export class DateValidator extends BaseValidator<Date> {
  doValidate(value: unknown): ValidationResult<Date> {
    if (value instanceof Date) {
      if (isNaN(value.getTime())) {
        return this.createError('Invalid Date object');
      }
      return { success: true, value };
    }

    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return this.createError('Invalid date string format');
      }
      return { success: true, value: date };
    }

    return this.createError('Value must be a Date object or ISO date string');
  }
} 