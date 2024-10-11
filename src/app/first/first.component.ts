import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [],
  templateUrl: './first.component.html',
  styleUrl: './first.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirstComponent {

}
