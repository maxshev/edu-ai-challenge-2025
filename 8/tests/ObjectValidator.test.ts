import { Schema } from '../src';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
}

describe('ObjectValidator', () => {
  const userSchema = Schema.object<User>({
    id: Schema.string(),
    name: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    age: Schema.number().min(0).max(120).optional(),
    isActive: Schema.boolean(),
    tags: Schema.array(Schema.string()),
    createdAt: Schema.date()
  });

  it('should validate a valid user object', () => {
    const user = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      isActive: true,
      tags: ['user', 'admin'],
      createdAt: new Date('2024-01-01')
    };

    const result = userSchema.validate(user);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toEqual(user);
    }
  });

  it('should validate a user object without optional fields', () => {
    const user = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
      tags: ['user'],
      createdAt: new Date('2024-01-01')
    };

    const result = userSchema.validate(user);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const user = {
      id: '123',
      name: 'John Doe',
      email: 'invalid-email',
      isActive: true,
      tags: ['user'],
      createdAt: new Date('2024-01-01')
    };

    const result = userSchema.validate(user);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0]).toContain('email');
    }
  });

  it('should reject invalid age range', () => {
    const user = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      age: 150,
      isActive: true,
      tags: ['user'],
      createdAt: new Date('2024-01-01')
    };

    const result = userSchema.validate(user);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0]).toContain('age');
    }
  });

  it('should reject non-array tags', () => {
    const user = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
      tags: 'user',
      createdAt: new Date('2024-01-01')
    };

    const result = userSchema.validate(user as any);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0]).toContain('tags');
    }
  });

  it('should handle optional object validation', () => {
    const optionalUserSchema = Schema.object<User>({
      id: Schema.string(),
      name: Schema.string(),
      email: Schema.string(),
      isActive: Schema.boolean(),
      tags: Schema.array(Schema.string()),
      createdAt: Schema.date()
    }).optional();

    expect(optionalUserSchema.validate(undefined).success).toBe(true);
    expect(optionalUserSchema.validate(null).success).toBe(true);
  });
}); 