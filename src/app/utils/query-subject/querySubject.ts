import { BehaviorSubject, Observable, filter, map, shareReplay, switchMap } from 'rxjs';
import { intoQuery } from './intoQuery';
import { Query, QueryStatus } from './types';

const initialTrigger = Symbol();

export class QuerySubject<Data, Trigger = void, Err = Error> {
  private trigger = new BehaviorSubject<Trigger | typeof initialTrigger>(initialTrigger);

  private query: Observable<Query<Data, Err>> = this.trigger.pipe(
    filter((t: any) => t !== initialTrigger),
    switchMap((trigger: Trigger) => this.producer(trigger).pipe(intoQuery<Data, Err>())),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly status: Observable<Readonly<QueryStatus>> = this.query.pipe(map(q => q.status));
  readonly result: Observable<Data | null | undefined> = this.query.pipe(map(q => q.result));
  readonly error: Observable<Err | null | undefined> = this.query.pipe(map(q => q.error));

  constructor(private producer: (trigger: Trigger) => Observable<Data>) {}

  next(value: Trigger) {
    this.trigger.next(value);
    return this;
  }

  reload(): this {
    return this.next(<Trigger>this.trigger.value);
  }
}
