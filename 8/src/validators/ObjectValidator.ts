import { BaseValidator, ValidationResult, Validator } from '../types';

/**
 * Validator for object values that validates each field using provided validators
 */
export class ObjectValidator<T> extends BaseValidator<T> {
  constructor(private schema: Record<string, Validator<any>>) {
    super();
  }

  doValidate(value: unknown): ValidationResult<T> {
    if (typeof value !== 'object' || value === null) {
      return this.createError('Value must be an object');
    }

    const errors: string[] = [];
    const validatedObject: Record<string, any> = {};

    for (const [key, validator] of Object.entries(this.schema)) {
      const fieldValue = (value as Record<string, unknown>)[key];
      const result = validator.validate(fieldValue);

      if (!result.success) {
        errors.push(`Field "${key}": ${result.errors.join(', ')}`);
      } else {
        validatedObject[key] = result.value;
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, value: validatedObject as T };
  }
} 