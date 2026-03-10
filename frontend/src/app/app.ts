import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [`
    :host {
      display: block;
      max-width: 480px;
      margin: 0 auto;
      min-height: 100vh;
      min-height: 100dvh;
      background: var(--color-bg);
      position: relative;
      box-shadow: 0 0 40px rgba(0,0,0,0.08);
    }

    @media (min-width: 481px) {
      :host {
        border-left: 1px solid var(--color-border);
        border-right: 1px solid var(--color-border);
      }
    }
  `],
})
export class App { }
