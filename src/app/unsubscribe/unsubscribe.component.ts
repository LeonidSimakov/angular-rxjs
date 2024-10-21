import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-unsubscribe',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  template: `
    {{ obs | async }}
    <button (click)="simulateDestroy()">simulate_destroy</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsubscribeComponent implements OnInit, OnDestroy {
  // 3
  private readonly destroyRef = inject(DestroyRef);
  // аналогичная запись без функции inject
  // constructor(private destroyRef: DestroyRef) {}
  
  // 2
  protected readonly destroy = new Subject<void>();

  readonly obs = interval(1000);

  // 1
  private subscription1?: Subscription;
  private subscription2?: Subscription;

  ngOnInit(): void {
    // 1    
    this.subscription1 = this.obs.subscribe(v => console.log('S0', v));
    this.subscription2 = this.obs.subscribe(v => console.log('S1', v));

    // От себя я бы рекомендовал 2 и 3 способы, как более rxjs way (множество библиотек построено на 2 способе, он считается main stream,
    // а 3 уже с 16, кажется, версии предоставляется самим Angular, !!! но использовать 3 способ наверное лучше с 18 Angular)

    // takeUntil | takeUntilDestroyed должны идти последними в цепочке (могут быть редкие кейсы, когда есть смысл использовать несколько таких операторов,
    // например еще перед shareReplay(1)),
    // также можно комбинировать с take() -> к примеру вот так pipe(take(1..n), takeUntil(this.destroy))

    // 2
    this.obs.pipe(takeUntil(this.destroy)).subscribe(v => console.log('S2', v));

    // 3 destroyRef нужно передавать, если takeUntilDestroyed используется вне конструктора
    this.obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(v => console.log('S3', v));
  }

  ngOnDestroy(): void {
    // 1
    this.subscription1?.unsubscribe();
    this.subscription2?.unsubscribe();

    //2
    this.destroy.next();
    this.destroy.complete();
  }

  // Т.к. реального дестроя не происходит, 3 способ отписки не сработает в этом демо
  simulateDestroy(): void {
    this.ngOnDestroy();
  }
  
}
