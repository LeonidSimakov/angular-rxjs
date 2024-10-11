import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-third',
  standalone: true,
  imports: [],
  templateUrl: './third.component.html',
  styleUrl: './third.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThirdComponent {

}
