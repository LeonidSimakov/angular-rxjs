import { Observable, OperatorFunction } from "rxjs";
import { Query } from "./types";

export function intoQuery<Data, Err = Error>(): OperatorFunction<Data, Query<Data, Err>> {
  return (source: Observable<Data>) =>
    new Observable<Query<Data, Err>>(destination => {
      let hasValue = false;

      destination.next({ status: 'loading' });

      return source.subscribe({
        next: result => {
          hasValue = true;
          destination.next({ result, status: 'success' });
        },
        error: error => {
          destination.next({ error, status: 'error' });
        },
        complete: () => {
          if (!hasValue) {
            destination.next({ status: 'complete' });
          }
          destination.complete();
        },
      });
    });
}
