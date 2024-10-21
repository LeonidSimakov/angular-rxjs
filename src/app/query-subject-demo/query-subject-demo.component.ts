import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ApiService } from '../api.service';
import { ImprovedInputComponent } from '../improved-input/improved-input.component';
import { QuerySubject } from '../utils/query-subject/querySubject';

@Component({
  selector: 'app-query-subject-demo',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,

    ImprovedInputComponent
  ],
  template: `
    <button (click)="onSend('error')">simulate error</button>

    <app-improved-input (valueChanged)="onSend($event)"></app-improved-input>

    <br><br>

    <section *ngIf="searchQuery.status | async as status">
      <div class="loading">
        <div *ngIf="status === 'loading'">...loading</div>
      </div>

      <div *ngIf="status == 'success'" class="success">
        <ul>
          <li *ngFor="let item of searchQuery.result | async">
            {{ item.text }}
          </li>
        </ul>
      </div>


      <div *ngIf="status == 'error'" class="error">
        {{ searchQuery.error | async }}
      </div>
    </section>
  `,
  styleUrl: './query-subject-demo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuerySubjectDemoComponent {
  private readonly api = inject(ApiService);

  /* QuerySubject решает следующие вопросы
    1. встроенные поля лоадинг и еррор
    2. кеширование (шаринг одного результата между подписчиками)
    3. не надо делать отдельный сабжект для параметров запроса, тот самый триггер, тут 2 в 1
  */

  readonly searchQuery = new QuerySubject((text: string) => this.api.queryItems(text, 1000));

  onSend(trigger: string) {
    return this.searchQuery.next(trigger);
  }
}
