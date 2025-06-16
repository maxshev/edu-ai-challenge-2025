import { BaseValidator, ValidationResult } from '../types';

/**
 * Validator for number values with range validation
 */
export class NumberValidator extends BaseValidator<number> {
  private minValue?: number;
  private maxValue?: number;

  /**
   * Sets minimum value requirement
   */
  min(value: number): this {
    this.minValue = value;
    return this;
  }

  /**
   * Sets maximum value requirement
   */
  max(value: number): this {
    this.maxValue = value;
    return this;
  }

  doValidate(value: unknown): ValidationResult<number> {
    if (typeof value !== 'number' || isNaN(value)) {
      return this.createError('Value must be a valid number');
    }

    if (this.minValue !== undefined && value < this.minValue) {
      return this.createError(`Number must be greater than or equal to ${this.minValue}`);
    }

    if (this.maxValue !== undefined && value > this.maxValue) {
      return this.createError(`Number must be less than or equal to ${this.maxValue}`);
    }

    return { success: true, value };
  }
} 