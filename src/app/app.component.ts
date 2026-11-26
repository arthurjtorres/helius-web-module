import { inject, Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet]
})
export class AppComponent {
  title = 'Portal Helius';
  private readonly _theme = inject(ThemeService);
}
