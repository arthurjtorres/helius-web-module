import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PenaltyPageComponent } from '../penalty-page/penalty-page.component';

@Component({
    selector: 'app-penalty-content',
    templateUrl: './penalty-content.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './penalty-content.component.scss',
    imports: [PenaltyPageComponent]
})
export class PenaltyContentComponent {

}
