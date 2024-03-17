export class OGCError<Status extends number> extends Error {
  code: string;
  status: Status;
  constructor(code: string, status: Status, message: string) {
    super(message);
    this.name = "OGCError";
    this.status = status;
    this.code = code;
  }
  toString() {
    return `${this.code}: ${this.message}`;
  }
  toOGCResponse() {
    return {
      _status: this.status,
      code: this.code,
      description: this.message
    };
  }
  toResponse() {
    return Response.json(this.toOGCResponse(), { status: this.status });
  }
}

const createOGCError = <Status extends number>(
  code: string, status: Status, message: string
) => new OGCError<Status>(code, status, message);

export const ogcErrors = {
  badValue: (key: string) => createOGCError("InvalidParameterValue", 400, `Bad value for ${key}`),
  outOfRange: (key: string) => createOGCError("InvalidParameterValue", 400, `Parameter ${key} out of range`),
  notFound: () => createOGCError("NotFound", 404, "Not found"),
  internalServerError: () => createOGCError("InternalServerError", 500, "Internal server error")
} as const;
