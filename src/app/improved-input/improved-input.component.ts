import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';

@Component({
  selector: 'app-improved-input',
  standalone: true,
  imports: [],
  template: `
    <input type="text" (input)="onInput($event)">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImprovedInputComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly inputValueChanged = new Subject<string>();

  @Output()
  readonly valueChanged = new EventEmitter<string>();

  ngOnInit(): void {
    this.inputValueChanged.pipe(
      debounceTime(500),
      filter(value => value.length > 2),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      // console.log('processedValue', value);
      this.valueChanged.next(value);
    });
  }

  onInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    // console.log('rawValue', input.value);
    this.inputValueChanged.next(input.value);
  }

}
