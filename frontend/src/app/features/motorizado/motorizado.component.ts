import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MotorizadoService, PedidosService, ChatService, AuthService } from '../../core/services/data.service';
import { TARIFA_ENVIO, PORCENTAJE_MOTORIZADO, Pedido } from '../../core/models/interfaces';

@Component({
  selector: 'app-motorizado',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="moto-page">
      <!-- Header -->
      <header class="moto-header">
        <button class="back-btn" (click)="router.navigate(['/home'])">←</button>
        <h2>Panel Motorizado</h2>
        <div class="disponible-toggle" [class.activo]="motoService.disponible()" (click)="motoService.toggleDisponible()">
          <div class="toggle-dot"></div>
          <span>{{ motoService.disponible() ? 'Activo' : 'Off' }}</span>
        </div>
      </header>

      <main class="moto-content">
        <!-- Ganancias -->
        <div class="earnings-card">
          <div class="earnings-icon">💰</div>
          <div>
            <p class="earnings-label">Ganancias de hoy</p>
            <p class="earnings-value">\${{ ganancias().toFixed(2) }}</p>
          </div>
          <div class="earnings-detail">
            <p>{{ entregas() }} entregas</p>
            <p class="earnings-rate">\${{ (TARIFA_ENVIO * PORCENTAJE_MOTORIZADO).toFixed(2) }}/envío</p>
          </div>
        </div>

        <!-- Pedido Nuevo -->
        @if (pedidoNuevo(); as p) {
          <section class="new-order-section">
            <h3 class="section-title">🔔 Nuevo Encargo</h3>
            <div class="new-order-card">
              <div class="order-header-row">
                <span class="order-badge">NUEVO</span>
                <span class="order-time">Hace 2 min</span>
              </div>
              <h4 class="order-local">{{ p.nombreLocal }}</h4>
              <div class="order-address-row">
                <p class="order-address">📍 {{ p.direccionEntrega }}</p>
                @if (p.ubicacionGps) {
                  <button class="btn-geo" (click)="abrirMapa(p.ubicacionGps)">📍 Ver mapa</button>
                }
              </div>
              <div class="order-items">
                @for (item of p.productos; track item.productoId) {
                  <span class="order-item-chip">{{ item.cantidad }}x {{ item.nombre }}</span>
                }
              </div>
              @if (p.notas) {
                <p class="order-notes">📝 {{ p.notas }}</p>
              }
              <div class="order-total-row">
                <span>Total del encargo</span>
                <span class="order-total">\${{ p.total.toFixed(2) }}</span>
              </div>
              <div class="order-actions">
                <button class="btn btn-danger btn-action" (click)="rechazar()">✕ Rechazar</button>
                <button class="btn btn-accent btn-action" (click)="aceptar()">✓ Aceptar</button>
              </div>
            </div>
          </section>
        }

        <!-- Pedido Activo (aceptado) -->
        @if (pedidoActivo(); as p) {
          <section class="active-order-section">
            <h3 class="section-title">📦 Encargo Activo</h3>
            <div class="active-card">
              <h4>{{ p.nombreLocal }}</h4>
              <p class="active-address">📍 {{ p.direccionEntrega }}</p>
              @if (p.ubicacionGps) {
                <button class="btn btn-sm btn-geo-outline" (click)="abrirMapa(p.ubicacionGps)">
                  🗺️ Ver ubicación en Google Maps
                </button>
              }
              <div class="active-items">
                @for (item of p.productos; track item.productoId) {
                  <div class="active-item-row">
                    <span>{{ item.cantidad }}x {{ item.nombre }}</span>
                    <span>\${{ (item.precio * item.cantidad).toFixed(2) }}</span>
                  </div>
                }
              </div>
              <div class="active-actions">
                <button class="btn btn-primary btn-full" (click)="abrirChat(p.id)">
                  💬 Chat con cliente
                </button>
                @switch (p.estado) {
                  @case ('asignado') {
                    <button class="btn btn-accent btn-full" (click)="marcarComprando(p.id)">
                      🛒 Empezar a comprar
                    </button>
                  }
                  @case ('comprando') {
                    <button class="btn btn-accent btn-full" (click)="marcarEnCamino(p.id)">
                      🚀 Ya voy en camino
                    </button>
                  }
                  @case ('en_camino') {
                    <button class="btn btn-accent btn-full" (click)="marcarEntregado(p.id)">
                      ✅ Marcar como entregado
                    </button>
                  }
                }
              </div>
            </div>
          </section>
        }

        <!-- Historial -->
        <section class="history-section">
          <h3 class="section-title">📋 Historial de hoy</h3>
          @if (historial().length === 0) {
            <div class="empty-state" style="padding: 24px;">
              <span class="empty-state-icon">🛵</span>
              <p class="empty-state-text">Sin entregas hoy</p>
            </div>
          }
          @for (h of historial(); track h.id) {
            <div class="history-card">
              <div class="history-left">
                <span class="history-icon">✅</span>
                <div>
                  <p class="history-local">{{ h.nombreLocal }}</p>
                  <p class="history-time">{{ h.creadoEn | date:'HH:mm' }}</p>
                </div>
              </div>
              <span class="history-amount">+\${{ (TARIFA_ENVIO * PORCENTAJE_MOTORIZADO).toFixed(2) }}</span>
            </div>
          }
        </section>
      </main>

      <nav class="bottom-nav">
        <button class="nav-item" (click)="router.navigate(['/home'])">
          <span class="nav-icon">🏠</span><span class="nav-label">Inicio</span>
        </button>
        <button class="nav-item" (click)="router.navigate(['/pedidos'])">
          <span class="nav-icon">📦</span><span class="nav-label">Pedidos</span>
        </button>
        <button class="nav-item active">
          <span class="nav-icon">🛵</span><span class="nav-label">Moto</span>
        </button>
        <button class="nav-item" (click)="router.navigate(['/perfil'])">
          <span class="nav-icon">👤</span><span class="nav-label">Perfil</span>
        </button>
      </nav>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .moto-page { background: var(--color-bg); min-height: 100vh; padding-bottom: 80px; }

    .moto-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px; background: white; box-shadow: var(--shadow-xs);
      position: sticky; top: 0; z-index: 10;
    }
    .moto-header h2 { flex: 1; font-size: 1.1rem; font-weight: 700; }
    .back-btn {
      width: 36px; height: 36px; background: var(--color-bg-input);
      border-radius: 50%; font-size: 1.1rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }

    /* Toggle */
    .disponible-toggle {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 20px;
      background: var(--color-bg-input); cursor: pointer;
      transition: all 0.3s; font-size: 0.78rem; font-weight: 700;
      color: var(--color-text-light);
    }
    .disponible-toggle.activo {
      background: var(--color-success);
      color: white;
    }
    .toggle-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--color-text-light);
      transition: all 0.3s;
    }
    .disponible-toggle.activo .toggle-dot {
      background: white;
      box-shadow: 0 0 8px rgba(255,255,255,0.5);
    }

    .moto-content { padding: 16px; display: flex; flex-direction: column; gap: 16px; }

    /* Earnings */
    .earnings-card {
      display: flex; align-items: center; gap: 14px;
      background: linear-gradient(135deg, #2d5016, #4a7c28);
      border-radius: 20px; padding: 20px;
      box-shadow: var(--shadow-glow); color: white;
    }
    .earnings-icon { font-size: 2.2rem; }
    .earnings-label { font-size: 0.78rem; opacity: 0.8; }
    .earnings-value { font-size: 1.8rem; font-weight: 800; }
    .earnings-detail { margin-left: auto; text-align: right; font-size: 0.78rem; opacity: 0.9; }
    .earnings-rate { font-weight: 700; margin-top: 2px; }

    /* Section */
    .section-title { font-size: 1rem; font-weight: 700; margin-bottom: 10px; }

    /* New Order */
    .new-order-card {
      background: white; border-radius: 16px; padding: 16px;
      box-shadow: var(--shadow-sm);
      border-left: 4px solid var(--color-secondary);
      animation: fadeInUp 400ms ease;
    }
    .order-header-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .order-badge {
      background: var(--color-secondary); color: white;
      padding: 2px 10px; border-radius: 20px;
      font-size: 0.68rem; font-weight: 800;
      animation: pulse 1.5s infinite;
    }
    .order-time { font-size: 0.72rem; color: var(--color-text-light); }
    .order-local { font-size: 1rem; font-weight: 700; }
    .order-address { font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 4px; }
    .order-items { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
    .order-item-chip {
      background: var(--color-primary-bg); color: var(--color-primary);
      padding: 4px 10px; border-radius: 20px;
      font-size: 0.72rem; font-weight: 600;
    }
    .order-notes { margin-top: 8px; font-size: 0.78rem; color: var(--color-text-secondary); font-style: italic; }
    .order-total-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--color-border-light);
      font-size: 0.88rem;
    }
    .order-total { font-weight: 800; font-size: 1.1rem; color: var(--color-primary); }
    .order-actions { display: flex; gap: 10px; margin-top: 14px; }
    .btn-action { flex: 1; padding: 12px; font-size: 0.88rem; border-radius: 12px; }

    /* Active */
    .active-card {
      background: white; border-radius: 16px; padding: 16px;
      box-shadow: var(--shadow-sm);
      border-left: 4px solid var(--color-accent);
    }
    .active-card h4 { font-size: 1rem; font-weight: 700; }
    .active-address { font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 4px; }
    .active-items { margin-top: 10px; }
    .active-item-row {
      display: flex; justify-content: space-between;
      padding: 4px 0; font-size: 0.82rem;
    }
    .active-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
    
    .btn-geo {
      background: var(--color-primary-bg);
      color: var(--color-primary);
      border: none;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
    }
    .order-address-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .btn-geo-outline {
      margin-top: 10px;
      background: white;
      border: 1px solid var(--color-primary);
      color: var(--color-primary);
      width: 100%;
      font-size: 0.78rem;
    }


    /* History */
    .history-card {
      display: flex; justify-content: space-between; align-items: center;
      background: white; padding: 14px; border-radius: 12px;
      box-shadow: var(--shadow-xs); margin-bottom: 8px;
    }
    .history-left { display: flex; align-items: center; gap: 10px; }
    .history-icon { font-size: 1.2rem; }
    .history-local { font-size: 0.85rem; font-weight: 600; }
    .history-time { font-size: 0.72rem; color: var(--color-text-light); }
    .history-amount { font-weight: 800; color: var(--color-accent); }

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

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  `],
})
export class MotorizadoComponent {
  router = inject(Router);
  motoService = inject(MotorizadoService);
  private pedidosService = inject(PedidosService);

  TARIFA_ENVIO = TARIFA_ENVIO;
  PORCENTAJE_MOTORIZADO = PORCENTAJE_MOTORIZADO;

  pedidoNuevo = signal<Pedido | null>(null);
  pedidoActivo = signal<Pedido | null>(null);
  historial = signal<Pedido[]>([]);
  ganancias = signal(5.40);
  entregas = signal(6);

  constructor() {
    // Use mock pedido as new incoming
    const pedidos = this.pedidosService.pedidos();
    if (pedidos.length > 0) {
      this.pedidoNuevo.set(pedidos[0]);
    }
  }

  aceptar() {
    const p = this.pedidoNuevo();
    if (p) {
      this.pedidosService.cambiarEstado(p.id, 'asignado');
      this.pedidoActivo.set({ ...p, estado: 'asignado' });
      this.pedidoNuevo.set(null);
    }
  }

  rechazar() {
    this.pedidoNuevo.set(null);
  }

  marcarComprando(id: string) {
    this.pedidosService.cambiarEstado(id, 'comprando');
    this.pedidoActivo.update(p => p ? { ...p, estado: 'comprando' } : null);
  }

  marcarEnCamino(id: string) {
    this.pedidosService.cambiarEstado(id, 'en_camino');
    this.pedidoActivo.update(p => p ? { ...p, estado: 'en_camino' } : null);
  }

  marcarEntregado(id: string) {
    this.pedidosService.cambiarEstado(id, 'entregado');
    const p = this.pedidoActivo();
    if (p) {
      this.historial.update(arr => [{ ...p, estado: 'entregado' as const }, ...arr]);
      this.ganancias.update(g => g + TARIFA_ENVIO * PORCENTAJE_MOTORIZADO);
      this.entregas.update(e => e + 1);
    }
    this.pedidoActivo.set(null);
  }

  abrirChat(pedidoId: string) {
    this.router.navigate(['/chat', pedidoId]);
  }

  abrirMapa(coords: { lat: number; lng: number }) {
    const url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    window.open(url, '_blank');
  }
}
