export class CustomGraphQLError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'CustomGraphQLError';
    this.code = code;
  }
}
