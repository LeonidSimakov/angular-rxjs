import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  template: `
    {{ obs | async }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroComponent implements OnInit {

  readonly obs = new Observable(observer => {
    observer.next('next first');
    // observer.error('something goes wrong!');
    observer.next('next second');
    observer.complete();
    observer.next('after_complete'); // Не сработает
  })
  .pipe(
    tap({
      next: value => { console.log('TAP', value); },
      error: error => { console.log('TAP', error); },
      complete: () => { console.log('TAP', 'complete'); }
    }),
    catchError(error => of(error))
  );

  ngOnInit(): void {
    this.obs.subscribe(value => console.log('S0', value));

    console.log('-------------------');

    this.obs.subscribe({
      next: value => console.log('S1', value),
      error: error => console.log('S1', error),
      complete: () => console.log('S1', 'complete'),
    });

    console.log('-------------------');

    // setTimeout(() => {
    //   this.obs.subscribe({
    //     next: value => console.log('S2', value),
    //     error: error => console.log('S2', error),
    //     complete: () => console.log('S2', 'complete'),
    //   });
    // }, 2000);
  }

}
