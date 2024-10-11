import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-second',
  standalone: true,
  imports: [],
  templateUrl: './second.component.html',
  styleUrl: './second.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondComponent {

}
