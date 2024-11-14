const ClientError = require('./ClientError');

class AutorizationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AutorizationError;
