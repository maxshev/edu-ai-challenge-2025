/**
 * Represents the result of a validation operation
 */
export type ValidationResult<T> = {
  success: true;
  value: T;
} | {
  success: false;
  errors: string[];
};

/**
 * Base interface for all validators
 */
export interface Validator<T> {
  validate(value: unknown): ValidationResult<T>;
  optional(): Validator<T | undefined>;
  withMessage(message: string): this;
}

/**
 * Base class for implementing validators
 */
export abstract class BaseValidator<T> implements Validator<T> {
  protected errorMessage?: string;
  protected isOptional = false;

  abstract doValidate(value: unknown): ValidationResult<T>;

  validate(value: unknown): ValidationResult<T> {
    if (this.isOptional && (value === undefined || value === null)) {
      return { success: true, value: undefined as any };
    }
    return this.doValidate(value);
  }

  optional(): Validator<T | undefined> {
    const validator = Object.create(this) as BaseValidator<T>;
    validator.isOptional = true;
    return validator;
  }

  withMessage(message: string): this {
    this.errorMessage = message;
    return this;
  }

  protected createError(defaultMessage: string): ValidationResult<T> {
    return {
      success: false,
      errors: [this.errorMessage || defaultMessage]
    };
  }
} 