import { BehaviorSubject, Observable, concatMap, exhaustMap, filter, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs';
import { intoQuery } from './intoQuery';
import { Query, QueryStatus } from './types';

const initialTrigger = Symbol();
type Options = {
  queryEngine: 'switchMap' | 'mergeMap' | 'exhaustMap' | 'concatMap',
  refCount: boolean,
  /** @description имеет значение, только если refCount: true */
  replayTrigger: boolean
}
const defaultOptions: Options = {
  queryEngine: 'switchMap',
  refCount: true,
  replayTrigger: false
}

export class QuerySubject<Data, Trigger = void, Err = Error> {
  private trigger = new BehaviorSubject<Trigger | typeof initialTrigger>(initialTrigger);

  private options: Options;

  private query: Observable<Query<Data, Err>>;

  readonly status: Observable<Readonly<QueryStatus>>;
  readonly result: Observable<Data | null | undefined>;
  readonly error: Observable<Err | null | undefined>;

  constructor(
    private producer: (trigger: Trigger) => Observable<Data>,
    private overrideOptions: Partial<Options> = {}
  ) {
    this.options = { ...defaultOptions, ...overrideOptions }

    this.query = this.trigger.pipe(
      filter((t: any) => t !== initialTrigger),
      (() => {
        const queryFn = (trigger: Trigger) => this.producer(trigger).pipe(intoQuery<Data, Err>());

        switch (this.options.queryEngine) {
          case 'switchMap': return switchMap(queryFn);
          case 'mergeMap': return mergeMap(queryFn);
          case 'exhaustMap': return exhaustMap(queryFn);
          case 'concatMap': return concatMap(queryFn);
          default: throw new TypeError(`unknown queryEngine: ${ this.options.queryEngine }`);
        }
      })(),
      tap({
        finalize: () => {
          if (!this.options.replayTrigger) {
            this.trigger.next(initialTrigger);
          }
        },
      }),
      shareReplay({ bufferSize: 1, refCount: this.options.refCount }),
    );

    this.status = this.query.pipe(map(q => q.status));
    this.result = this.query.pipe(map(q => q.result));
    this.error = this.query.pipe(map(q => q.error));
  }

  next(value: Trigger) {
    this.trigger.next(value);
    return this;
  }

  reload(): this {
    return this.next(<Trigger>this.trigger.value);
  }
}
