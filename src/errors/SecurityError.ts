import { ApolloError } from 'apollo-server-errors';

class SecurityError extends ApolloError {
  constructor(message: string, code: string) {
    super(message, code);

    Object.defineProperty(this, 'name', { value: 'SecurityError' });
  }
}

export default SecurityError;
