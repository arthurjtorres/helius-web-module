import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { FineCodePageComponent } from '../fine-code-page/fine-code-page.component';

@Component({
    selector: 'app-appendix-content',
    templateUrl: './appendix-content.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './appendix-content.component.scss',
    imports: [MatTabGroup, MatTab, FineCodePageComponent]
})
export class AppendixContentComponent {

}
