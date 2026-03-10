import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidosService } from '../../core/services/data.service';
import { ESTADOS_PEDIDO } from '../../core/models/interfaces';

@Component({
    selector: 'app-pedidos',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="ped-header">
      <button class="back-btn" (click)="router.navigate(['/home'])">←</button>
      <h2>Mis Pedidos</h2>
    </header>

    <main class="ped-content">
      @if (pedidosService.pedidos().length === 0) {
        <div class="empty-state">
          <span class="empty-state-icon">📦</span>
          <p class="empty-state-title">Sin pedidos aún</p>
          <p class="empty-state-text">Tus pedidos aparecerán aquí</p>
          <button class="btn btn-primary" (click)="router.navigate(['/home'])">Explorar Locales</button>
        </div>
      }

      @for (pedido of pedidosService.pedidos(); track pedido.id; let i = $index) {
        <div class="pedido-card animate-fade-in-up" [style.animation-delay]="(i*60)+'ms'" (click)="verSeguimiento(pedido.id)">
          <div class="pedido-top">
            <div class="pedido-status" [class]="'st-' + pedido.estado">
              {{ getEstadoIcon(pedido.estado) }} {{ getEstadoNombre(pedido.estado) }}
            </div>
            <span class="pedido-date">{{ pedido.creadoEn | date:'dd/MM HH:mm' }}</span>
          </div>
          <h4 class="pedido-local">{{ pedido.nombreLocal || 'Local' }}</h4>
          <p class="pedido-items">{{ pedido.productos.length }} producto(s)</p>
          <div class="pedido-bottom">
            <span class="pedido-total">\${{ pedido.total.toFixed(2) }}</span>
            <span class="pedido-arrow">→</span>
          </div>
        </div>
      }
    </main>

    <nav class="bottom-nav">
      <button class="nav-item" (click)="router.navigate(['/home'])">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Inicio</span>
      </button>
      <button class="nav-item active">
        <span class="nav-icon">📦</span>
        <span class="nav-label">Pedidos</span>
      </button>
      <button class="nav-item" (click)="router.navigate(['/motorizado'])">
        <span class="nav-icon">🛵</span>
        <span class="nav-label">Moto</span>
      </button>
      <button class="nav-item" (click)="router.navigate(['/perfil'])">
        <span class="nav-icon">👤</span>
        <span class="nav-label">Perfil</span>
      </button>
    </nav>
  `,
    styles: [`
    :host { display: block; background: var(--color-bg); min-height: 100vh; padding-bottom: 80px; }

    .ped-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px; background: white; box-shadow: var(--shadow-xs);
      position: sticky; top: 0; z-index: 10;
    }
    .ped-header h2 { font-size: 1.15rem; font-weight: 700; }
    .back-btn {
      width: 36px; height: 36px; background: var(--color-bg-input);
      border-radius: 50%; font-size: 1.1rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }

    .ped-content { padding: 16px; display: flex; flex-direction: column; gap: 12px; }

    .pedido-card {
      background: white; border-radius: 16px;
      padding: 16px; box-shadow: var(--shadow-xs);
      cursor: pointer; transition: transform 0.2s;
    }
    .pedido-card:active { transform: scale(0.98); }

    .pedido-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .pedido-status {
      font-size: 0.72rem; font-weight: 700; padding: 4px 10px;
      border-radius: 20px;
    }
    .st-recibido { background: #dbeafe; color: #1d4ed8; }
    .st-transferido { background: #fef3c7; color: #b45309; }
    .st-asignado { background: #d1fae5; color: #047857; }
    .st-comprando { background: #fce7f3; color: #be185d; }
    .st-en_camino { background: #dbeafe; color: #1d4ed8; }
    .st-entregado { background: #d1fae5; color: #047857; }
    .st-cancelado { background: #fee2e2; color: #dc2626; }

    .pedido-date { font-size: 0.72rem; color: var(--color-text-light); }
    .pedido-local { font-size: 0.95rem; font-weight: 700; }
    .pedido-items { font-size: 0.78rem; color: var(--color-text-light); margin-top: 2px; }
    .pedido-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
    .pedido-total { font-size: 1.1rem; font-weight: 800; color: var(--color-primary); }
    .pedido-arrow { font-size: 1.2rem; color: var(--color-text-light); }

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
export class PedidosComponent {
    pedidosService = inject(PedidosService);
    router = inject(Router);

    getEstadoIcon(estado: string): string {
        return ESTADOS_PEDIDO.find(e => e.id === estado)?.icono || '📩';
    }
    getEstadoNombre(estado: string): string {
        return ESTADOS_PEDIDO.find(e => e.id === estado)?.nombre || estado;
    }

    verSeguimiento(id: string) {
        this.router.navigate(['/seguimiento', id]);
    }
}
