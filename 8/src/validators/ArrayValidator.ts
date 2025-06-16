import { BaseValidator, ValidationResult, Validator } from '../types';

/**
 * Validator for array values that validates each item using a provided validator
 */
export class ArrayValidator<T> extends BaseValidator<T[]> {
  constructor(private itemValidator: Validator<T>) {
    super();
  }

  doValidate(value: unknown): ValidationResult<T[]> {
    if (!Array.isArray(value)) {
      return this.createError('Value must be an array');
    }

    const errors: string[] = [];
    const validItems: T[] = [];

    for (let i = 0; i < value.length; i++) {
      const result = this.itemValidator.validate(value[i]);
      if (!result.success) {
        errors.push(`Item at index ${i}: ${result.errors.join(', ')}`);
      } else {
        validItems.push(result.value);
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, value: validItems };
  }
} 