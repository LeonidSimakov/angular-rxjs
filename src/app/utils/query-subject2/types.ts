export type QueryStatus = 'success' | 'error' | 'loading' | 'complete';

export type Query<Data, Err = Error> = {
  status: Readonly<QueryStatus>;
  result?: Readonly<Data | null>;
  error?: Readonly<Err>;
}
