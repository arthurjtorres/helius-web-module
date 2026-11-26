import { Component } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { VehiclePageComponent } from '../vehicle-page/vehicle-page.component';
import { VehicleTypePageComponent } from '../vehicle-type-page/vehicle-type-page.component';

@Component({
    selector: 'app-vehicles-content',
    templateUrl: './vehicles-content.component.html',
    styleUrl: './vehicles-content.component.scss',
    imports: [MatTabGroup, MatTab, VehiclePageComponent, VehicleTypePageComponent]
})
export class VehiclesContentComponent {

}
