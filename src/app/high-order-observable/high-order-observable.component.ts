import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
import { ApiService } from '../api.service';
import { ImprovedInputComponent } from '../improved-input/improved-input.component';

@Component({
  selector: 'app-high-order-observable',
  standalone: true,
  imports: [
    ImprovedInputComponent,
    AsyncPipe,
    NgFor,
  ],
  template: `
    <app-improved-input (valueChanged)="searchQueryTrigger.next($event)"></app-improved-input>

    <ul>
      <li *ngFor="let item of (items | async)">
        {{ item.text }}
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighOrderObservableComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly api = inject(ApiService);


  readonly searchQueryTrigger = new Subject<string>();
  
  // readonly items = new BehaviorSubject<Item[]>([]);

  // Способ 3 - Наверное самый rxjs way, тут не делается вручную подписка, шаблон сам подпишется и отпишется через async.
  // !!! Но надо быть внимательным, имея в шаблоне условия отображения блоков с подписками, надо смотреть, чтобы запрос не дублировался
  // (spoiler, помогут мультикаст операторы, ну или использовать 2 способ, как более простой)
  readonly items = this.searchQueryTrigger.pipe(switchMap(text => this.api.queryItems(text)));
  
  /*
  
  readonly filters!: Observable<unknown[]>;
  readonly allItems!: Observable<Item[]>;

  readonly items = combineLatest([ this.filters, this.allItems ]).pipe(
    map(([ filters, allItems ]) => {
      return allItems.filter(item => ...)
    })
  );
  
  */

  ngOnInit(): void {
    // Способ 2 - Больше контроля над подпиской, благодаря созданному 1 раз Observable + операторам высшего порядка
    // Но все еще надо руками отписываться от такого Observable
    // this.searchQueryTrigger.pipe(
    //   // Отмена незавершенных, переключение на Observable от последнего триггера
      // switchMap(text => this.api.queryItems(text, 3000)),

    //   // "Параллельное" выполнение
    //   // mergeMap(text => this.api.queryItems(text, 3000)),

    //   // Последовательная очередь с ожиданием результата каждого Observable
    //   // concatMap(text => this.api.queryItems(text, 3000)),

    //   // Игнор новых триггеров, пока не завершен текущий Observale
    //   // exhaustMap(text => this.api.queryItems(text, 3000)),

    //   takeUntilDestroyed(this.destroyRef)
    // ).subscribe(items => this.items.next(items));
  }

  // Способ 1 - мало контроля над подпиской
  // onValueChanged(text: string): void {
  //   this.api.queryItems(text).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
  //     this.items.next(res);
  //   });
  // }

}

// По клику кнопки на сайте может переключиться музыка
// 1. mergeMap будет начинать новую песню при каждом клике и будет каша из нескольких играющих песен
// 2. switchMap остановит текущую песню и включит следующую сразу
// 3. concatMap подождет пока доиграет текущая песня и включит следующую
// 4. exaustMap не будет реагировать на клик, если играет песня от предыдущего клика
