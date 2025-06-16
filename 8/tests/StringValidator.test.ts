import { Schema } from '../src';

describe('StringValidator', () => {
  it('should validate string values', () => {
    const validator = Schema.string();
    const result = validator.validate('test');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe('test');
    }
  });

  it('should reject non-string values', () => {
    const validator = Schema.string();
    const result = validator.validate(123);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0]).toBe('Value must be a string');
    }
  });

  it('should validate minLength', () => {
    const validator = Schema.string().minLength(3);
    expect(validator.validate('ab').success).toBe(false);
    expect(validator.validate('abc').success).toBe(true);
  });

  it('should validate maxLength', () => {
    const validator = Schema.string().maxLength(3);
    expect(validator.validate('abcd').success).toBe(false);
    expect(validator.validate('abc').success).toBe(true);
  });

  it('should validate pattern', () => {
    const validator = Schema.string().pattern(/^[a-z]+$/);
    expect(validator.validate('abc123').success).toBe(false);
    expect(validator.validate('abc').success).toBe(true);
  });

  it('should handle optional values', () => {
    const validator = Schema.string().optional();
    expect(validator.validate(undefined).success).toBe(true);
    expect(validator.validate(null).success).toBe(true);
    expect(validator.validate('test').success).toBe(true);
  });

  it('should use custom error messages', () => {
    const validator = Schema.string().withMessage('Custom error');
    const result = validator.validate(123);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0]).toBe('Custom error');
    }
  });
}); 