export class ServiceError {
  constructor(message) {
    this.name = "ServiceError";
    this.code = 500;
  }
}

export class NotFoundError extends ServiceError {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.code = 404;
  }
}

export class InsufficientPermissionsError extends ServiceError {
  constructor(message) {
    super(message);
    this.name = "InsufficientPermissionsError";
    this.code = 403;
  }
}

export class InvalidArgumentError extends ServiceError {
  constructor(message) {
    super(message);
    this.name = "InvalidArgumentError";
    this.code = 401;
  }
}

export class ChannelError extends ServiceError {
  constructor(message, data) {
    super(message);
    this.name = "ChannelError";
    this.code = 500;
    this.data = data;
  }

  toJSON() {
    return { ...super.toJSON(), data: this.data };
  }
}
