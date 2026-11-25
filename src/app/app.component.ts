import { inject, Component, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './app.component.scss',
    imports: [RouterOutlet]
})
export class AppComponent {
  title = 'Portal Helius';
  private readonly _theme = inject(ThemeService);
}
