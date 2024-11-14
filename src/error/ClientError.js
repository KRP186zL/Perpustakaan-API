class ClientError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = code;
  }
}

module.exports = ClientError;
