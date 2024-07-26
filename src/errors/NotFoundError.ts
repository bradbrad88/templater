class NotFoundError extends Error {
  constructor() {
    super("Content not found");
  }
}

export default NotFoundError;
