import { StringValidator } from './validators/StringValidator';
import { NumberValidator } from './validators/NumberValidator';
import { BooleanValidator } from './validators/BooleanValidator';
import { DateValidator } from './validators/DateValidator';
import { ArrayValidator } from './validators/ArrayValidator';
import { ObjectValidator } from './validators/ObjectValidator';
import { Validator } from './types';

/**
 * Main Schema builder class that provides static methods for creating validators
 */
export class Schema {
  /**
   * Creates a string validator
   */
  static string(): StringValidator {
    return new StringValidator();
  }

  /**
   * Creates a number validator
   */
  static number(): NumberValidator {
    return new NumberValidator();
  }

  /**
   * Creates a boolean validator
   */
  static boolean(): BooleanValidator {
    return new BooleanValidator();
  }

  /**
   * Creates a date validator
   */
  static date(): DateValidator {
    return new DateValidator();
  }

  /**
   * Creates an array validator with the specified item validator
   */
  static array<T>(itemValidator: Validator<T>): ArrayValidator<T> {
    return new ArrayValidator<T>(itemValidator);
  }

  /**
   * Creates an object validator with the specified schema
   */
  static object<T>(schema: Record<string, Validator<any>>): ObjectValidator<T> {
    return new ObjectValidator<T>(schema);
  }
} 