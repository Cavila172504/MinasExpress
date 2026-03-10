import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/data.service';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="perfil-header">
      <button class="back-btn" (click)="router.navigate(['/home'])">←</button>
      <h2>Mi Perfil</h2>
    </header>

    @if (auth.usuario(); as user) {
      <main class="perfil-content">
        <!-- Avatar Card -->
        <div class="profile-card">
          <img [src]="user.fotoUrl" [alt]="user.nombre" class="profile-avatar" />
          <h3 class="profile-name">{{ user.nombre }}</h3>
          <p class="profile-type">{{ user.tipoUsuario === 'cliente' ? '👤 Cliente' : '🛵 Motorizado' }}</p>
        </div>

        <!-- Info Items -->
        <div class="info-list">
          <div class="info-item">
            <span class="info-icon">📱</span>
            <div>
              <p class="info-label">Teléfono</p>
              <p class="info-value">{{ user.telefono }}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">✉️</span>
            <div>
              <p class="info-label">Email</p>
              <p class="info-value">{{ user.email }}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">📍</span>
            <div>
              <p class="info-label">Dirección</p>
              <p class="info-value">{{ user.direccion }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="actions-list">
          <button class="action-item" (click)="router.navigate(['/pedidos'])">
            <span class="action-icon">📦</span>
            <span class="action-text">Historial de Pedidos</span>
            <span class="action-arrow">→</span>
          </button>
          <button class="action-item" (click)="router.navigate(['/motorizado'])">
            <span class="action-icon">🛵</span>
            <span class="action-text">Panel Motorizado</span>
            <span class="action-arrow">→</span>
          </button>
          <button class="action-item">
            <span class="action-icon">⭐</span>
            <span class="action-text">Calificar App</span>
            <span class="action-arrow">→</span>
          </button>
          <button class="action-item">
            <span class="action-icon">📞</span>
            <span class="action-text">Soporte</span>
            <span class="action-arrow">→</span>
          </button>
        </div>

        <!-- Version -->
        <div class="app-version">
          <p>🏔️ MinasExpress v1.0.0</p>
          <p class="version-sub">Hecho con ❤️ en San José de Minas</p>
        </div>

        <!-- Logout -->
        <button class="btn btn-danger btn-full logout-btn" (click)="cerrarSesion()">
          🚪 Cerrar Sesión
        </button>
      </main>
    }

    <nav class="bottom-nav">
      <button class="nav-item" (click)="router.navigate(['/home'])">
        <span class="nav-icon">🏠</span><span class="nav-label">Inicio</span>
      </button>
      <button class="nav-item" (click)="router.navigate(['/pedidos'])">
        <span class="nav-icon">📦</span><span class="nav-label">Pedidos</span>
      </button>
      <button class="nav-item" (click)="router.navigate(['/motorizado'])">
        <span class="nav-icon">🛵</span><span class="nav-label">Moto</span>
      </button>
      <button class="nav-item active">
        <span class="nav-icon">👤</span><span class="nav-label">Perfil</span>
      </button>
    </nav>
  `,
    styles: [`
    :host { display: block; background: var(--color-bg); min-height: 100vh; padding-bottom: 80px; }

    .perfil-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px; background: white; box-shadow: var(--shadow-xs);
      position: sticky; top: 0; z-index: 10;
    }
    .perfil-header h2 { font-size: 1.15rem; font-weight: 700; }
    .back-btn {
      width: 36px; height: 36px; background: var(--color-bg-input);
      border-radius: 50%; font-size: 1.1rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }

    .perfil-content { padding: 16px; display: flex; flex-direction: column; gap: 16px; }

    /* Profile Card */
    .profile-card {
      display: flex; flex-direction: column; align-items: center;
      background: var(--color-primary-gradient);
      border-radius: 20px; padding: 32px 20px 24px;
      box-shadow: var(--shadow-glow); color: white;
    }
    .profile-avatar {
      width: 90px; height: 90px; border-radius: 50%;
      object-fit: cover; border: 4px solid rgba(255,255,255,0.3);
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      margin-bottom: 12px;
    }
    .profile-name { font-size: 1.3rem; font-weight: 800; }
    .profile-type { font-size: 0.82rem; opacity: 0.85; margin-top: 2px; }

    /* Info */
    .info-list {
      background: white; border-radius: 16px;
      overflow: hidden; box-shadow: var(--shadow-xs);
    }
    .info-item {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px;
    }
    .info-item:not(:last-child) { border-bottom: 1px solid var(--color-border-light); }
    .info-icon { font-size: 1.2rem; }
    .info-label { font-size: 0.72rem; color: var(--color-text-light); }
    .info-value { font-size: 0.88rem; font-weight: 600; }

    /* Actions */
    .actions-list {
      background: white; border-radius: 16px;
      overflow: hidden; box-shadow: var(--shadow-xs);
    }
    .action-item {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px; width: 100%;
      text-align: left; transition: background 0.2s;
    }
    .action-item:active { background: var(--color-bg-input); }
    .action-item:not(:last-child) { border-bottom: 1px solid var(--color-border-light); }
    .action-icon { font-size: 1.2rem; }
    .action-text { flex: 1; font-size: 0.88rem; font-weight: 600; }
    .action-arrow { font-size: 1rem; color: var(--color-text-light); }

    /* Version */
    .app-version { text-align: center; padding: 8px; }
    .app-version p { font-size: 0.78rem; color: var(--color-text-light); }
    .version-sub { font-size: 0.68rem; margin-top: 2px; }

    .logout-btn { border-radius: 14px; padding: 14px; }

    .bottom-nav {
      position: fixed; bottom: 0; left: 0; right: 0;
      display: flex; justify-content: space-around;
      background: white; padding: 8px 0 calc(8px + env(safe-area-inset-bottom, 0px));
      border-top: 1px solid var(--color-border-light);
      box-shadow: 0 -4px 20px rgba(0,0,0,0.06); z-index: 200;
    }
    .nav-item {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      padding: 6px 16px; border-radius: 12px; transition: all 0.2s; background: transparent;
    }
    .nav-item.active { background: var(--color-primary-bg); }
    .nav-icon { font-size: 1.3rem; }
    .nav-label { font-size: 0.65rem; font-weight: 600; color: var(--color-text-light); }
    .nav-item.active .nav-label { color: var(--color-primary); font-weight: 700; }
  `],
})
export class PerfilComponent {
    auth = inject(AuthService);
    router = inject(Router);

    cerrarSesion() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
