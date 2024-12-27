abstract class QueryResult<Data, Error> {
  abstract readonly success: boolean;
  abstract readonly data: Data | null;
  abstract readonly error: Error | null;
}

export class QueryResultSuccess<Data, Error> extends QueryResult<Data, Error> {
  readonly success = true;
  readonly data: Data;
  readonly error: null = null;

  constructor(data: Data) {
    super();
    this.data = data;
  }
}

export class QueryResultError<Data, Error> extends QueryResult<Data, Error> {
  readonly success = false;
  readonly data: null = null;
  readonly error: Error;

  constructor(error: Error) {
    super();
    this.error = error;
  }
}