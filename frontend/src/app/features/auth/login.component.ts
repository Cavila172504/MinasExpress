import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/data.service';

@Component({
    selector: 'app-login',
    standalone: true,
    template: `
    <div class="login-page">
      <div class="login-header">
        <div class="header-shape"></div>
        <div class="login-logo">
          <div class="logo-circle">🏔️</div>
          <h1>Minas<span>Express</span></h1>
          <p>Tu servicio de encargos</p>
        </div>
      </div>

      <div class="login-body">
        <h2>¡Bienvenido! 👋</h2>
        <p class="login-desc">Inicia sesión para pedir lo que necesites</p>

        <div class="login-form">
          <div class="input-group">
            <label>Número de teléfono</label>
            <div class="phone-input">
              <span class="phone-prefix">🇪🇨 +593</span>
              <input type="tel" class="input-field" placeholder="9XX XXX XXX" />
            </div>
          </div>

          <button class="btn btn-primary btn-full btn-lg" (click)="login()">
            📲 Continuar con Teléfono
          </button>

          <div class="divider">
            <span>o también</span>
          </div>

          <button class="btn btn-google btn-full" (click)="login()">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>
        </div>

        <p class="terms">
          Al continuar, aceptas nuestros<br>
          <a href="#">Términos de Servicio</a> y <a href="#">Política de Privacidad</a>
        </p>
      </div>
    </div>
  `,
    styles: [`
    .login-page {
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      background: var(--color-bg-light);
    }

    .login-header {
      position: relative;
      padding: 60px 24px 40px;
      background: var(--color-primary-gradient);
      overflow: hidden;
    }

    .header-shape {
      position: absolute;
      bottom: -30px;
      left: -10%;
      width: 120%;
      height: 60px;
      background: var(--color-bg-light);
      border-radius: 50% 50% 0 0;
    }

    .login-logo {
      position: relative;
      text-align: center;
      z-index: 1;
    }

    .logo-circle {
      font-size: 48px;
      width: 88px;
      height: 88px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      border: 2px solid rgba(255,255,255,0.3);
    }

    .login-logo h1 {
      font-size: 2rem;
      font-weight: 800;
      color: white;
    }

    .login-logo h1 span { color: #fbbf24; }

    .login-logo p {
      color: rgba(255,255,255,0.8);
      font-size: 0.9rem;
      margin-top: 4px;
    }

    .login-body {
      flex: 1;
      padding: 24px 24px 40px;
      animation: fadeInUp 500ms ease both;
    }

    .login-body h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text);
      margin-bottom: 4px;
    }

    .login-desc {
      color: var(--color-text-light);
      margin-bottom: 28px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .phone-input {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-bg-card);
      overflow: hidden;
    }

    .phone-prefix {
      padding: 12px;
      font-weight: 600;
      color: var(--color-text-secondary);
      background: var(--color-bg-input);
      border-right: 2px solid var(--color-border);
      white-space: nowrap;
      font-size: 0.9rem;
    }

    .phone-input .input-field {
      border: none;
      padding-left: 8px;
    }

    .phone-input .input-field:focus {
      box-shadow: none;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 16px;
      color: var(--color-text-light);
      font-size: 0.8rem;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--color-border);
    }

    .btn-google {
      background: white;
      border: 2px solid var(--color-border);
      color: var(--color-text);
      font-weight: 600;
      padding: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .btn-google:hover {
      border-color: var(--color-text-light);
      box-shadow: var(--shadow-sm);
    }

    .terms {
      margin-top: 32px;
      text-align: center;
      font-size: 0.75rem;
      color: var(--color-text-light);
      line-height: 1.6;
    }

    .terms a {
      color: var(--color-primary);
      font-weight: 600;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class LoginComponent {
    constructor(private router: Router, private auth: AuthService) { }

    login() {
        this.auth.login();
        this.router.navigate(['/home']);
    }
}
