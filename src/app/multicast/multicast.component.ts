import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, map, shareReplay, tap } from 'rxjs';

const mockItems = new Array(1000).fill(null).map((_, index) => index);

@Component({
  selector: 'app-multicast',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe
  ],
  template: `
    <div><b>Всего:</b> {{ itemsLength | async }}</div>

    <div><b>Четных:</b> {{ evenItemsLenght | async }}</div>
    <div><b>Четные:</b> {{ evenItems | async | json }}</div>
    <div><b>Четные * 2:</b> {{ evenItems2 | async | json }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MulticastComponent {

  private readonly _items = new BehaviorSubject<number[]>(mockItems);
  // readonly items = this._items.asObservable();
  readonly items = this._items.pipe(
    // tap(() => console.log('items touched')),
    // Тут нет смысла шарить результат, т.к. нет вычислений (!!! хотя если бы был запрос в _items, то стоит шарить его результат)
    shareReplay({ bufferSize: 1, refCount: true }),
    // tap(() => console.log('items touched')),
  );

  readonly itemsLength = this.items.pipe(map(items => items.length));

  readonly evenItems = this.items.pipe(
    map(items => items.filter((_, i) => i % 2 === 0)),
    tap(() => console.log('evenItems touched')),
    // А вот здесь уже можно пошарить, чтобы одними и теми же отфильтрованными значениями пользоваться в нескольких местах
    shareReplay({ bufferSize: 1, refCount: false }),
  );
  readonly evenItemsLenght = this.evenItems.pipe(
    map(items => items.length)
  );
  readonly evenItems2 = this.evenItems.pipe(
    map(items => items.map(item => item * 2)),
    // shareReplay({ bufferSize: 1, refCount: true }),
  );



  // readonly oddItems = this.items.pipe(
  //   map(items => items.filter((_, i) => i % 2 !== 0))
  // );
  // readonly oddItemsLenght = this.evenItems.pipe(
  //   map(items => items.length)
  // );
}
