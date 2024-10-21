import { Injectable } from '@angular/core';
import { map, Observable, tap, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  queryItems(text: string, timeout = 300): Observable<typeof items> {
    return timer(timeout).pipe(
      map(() => {
        if (text === 'error') {
          throw new Error('something goes wrong!')
        }

        const diff = items.length - text.length;
        const responseLenght = diff < 0 ? 0 : diff;

        return items.slice(0, responseLenght);
      }),
      tap({
        next: response => console.log('requset successful', response),
        error: error => console.log(`request error: ${ error }`),
        unsubscribe: () => console.log('request canceled'),
      })
    );
  }

}

const items = [
  { text: 'bla_0' },
  { text: 'foo_0' },
  { text: 'bar_0' },
  { text: 'baz_0' },
  { text: 'bla_1' },
  { text: 'foo_1' },
  { text: 'bar_1' },
  { text: 'baz_1' },
  { text: 'bla_2' },
  { text: 'foo_2' },
  { text: 'bar_2' },
  { text: 'baz_2' },
  { text: 'bla_3' },
  { text: 'foo_3' },
  { text: 'bar_3' },
  { text: 'baz_3' },
  { text: 'bla_4' },
  { text: 'foo_4' },
  { text: 'bar_4' },
  { text: 'baz_4' },
  { text: 'bla_5' },
  { text: 'foo_5' },
  { text: 'bar_5' },
  { text: 'baz_5' },
];

export type Item = (typeof items)[number];
