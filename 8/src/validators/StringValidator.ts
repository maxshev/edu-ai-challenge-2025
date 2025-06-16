import { BaseValidator, ValidationResult } from '../types';

/**
 * Validator for string values with various validation rules
 */
export class StringValidator extends BaseValidator<string> {
  private minLen?: number;
  private maxLen?: number;
  private patternRegex?: RegExp;

  /**
   * Sets minimum length requirement for the string
   */
  minLength(length: number): this {
    this.minLen = length;
    return this;
  }

  /**
   * Sets maximum length requirement for the string
   */
  maxLength(length: number): this {
    this.maxLen = length;
    return this;
  }

  /**
   * Sets a regex pattern that the string must match
   */
  pattern(regex: RegExp): this {
    this.patternRegex = regex;
    return this;
  }

  doValidate(value: unknown): ValidationResult<string> {
    if (typeof value !== 'string') {
      return this.createError('Value must be a string');
    }

    if (this.minLen !== undefined && value.length < this.minLen) {
      return this.createError(`String must be at least ${this.minLen} characters long`);
    }

    if (this.maxLen !== undefined && value.length > this.maxLen) {
      return this.createError(`String must be at most ${this.maxLen} characters long`);
    }

    if (this.patternRegex && !this.patternRegex.test(value)) {
      return this.createError('String does not match the required pattern');
    }

    return { success: true, value };
  }
} 