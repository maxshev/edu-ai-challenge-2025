# Type-Safe Validator

A powerful, type-safe validation library for TypeScript that provides a fluent API for creating and composing validators.

## Features

- 🔒 Fully type-safe with TypeScript
- 🔗 Chainable validation methods
- 🎯 Built-in validators for common types
- 📝 Custom error messages
- ⚡ Optional field support
- 🧩 Composable object and array validation

## Installation

```bash
npm install type-safe-validator
```

## Usage

### Basic Example

```typescript
import { Schema } from 'type-safe-validator';

const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().min(0).max(120).optional(),
  isActive: Schema.boolean()
});

const result = userSchema.validate({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true
});

if (result.success) {
  console.log('Valid user:', result.value);
} else {
  console.error('Validation errors:', result.errors);
}
```

### Available Validators

#### StringValidator
```typescript
Schema.string()
  .minLength(2)
  .maxLength(50)
  .pattern(/regex/)
  .withMessage('Custom error message')
  .optional();
```

#### NumberValidator
```typescript
Schema.number()
  .min(0)
  .max(100)
  .withMessage('Custom error message')
  .optional();
```

#### BooleanValidator
```typescript
Schema.boolean()
  .withMessage('Custom error message')
  .optional();
```

#### DateValidator
```typescript
Schema.date()
  .withMessage('Custom error message')
  .optional();
```

#### ArrayValidator
```typescript
Schema.array(Schema.string())
  .withMessage('Custom error message')
  .optional();
```

#### ObjectValidator
```typescript
interface User {
  id: string;
  name: string;
  tags: string[];
}

const userSchema = Schema.object<User>({
  id: Schema.string(),
  name: Schema.string().minLength(2),
  tags: Schema.array(Schema.string())
});
```

## Development

### Running Tests

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

The project maintains high test coverage to ensure reliability. View the coverage report in the `coverage` directory after running tests with the `--coverage` flag.

## License

ISC 