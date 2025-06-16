import { BaseValidator, ValidationResult } from '../types';

/**
 * Validator for boolean values
 */
export class BooleanValidator extends BaseValidator<boolean> {
  doValidate(value: unknown): ValidationResult<boolean> {
    if (typeof value !== 'boolean') {
      return this.createError('Value must be a boolean');
    }

    return { success: true, value };
  }
} 