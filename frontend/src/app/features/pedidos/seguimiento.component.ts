import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService, MotorizadoService } from '../../core/services/data.service';
import { ESTADOS_PEDIDO, Pedido } from '../../core/models/interfaces';

@Component({
    selector: 'app-seguimiento',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="seg-header">
      <button class="back-btn" (click)="volver()">←</button>
      <h2>Seguimiento</h2>
    </header>

    @if (pedido(); as p) {
      <main class="seg-content">
        <!-- Status Banner -->
        <div class="status-banner" [class]="'status-' + p.estado">
          <span class="status-emoji">{{ getEstadoIcon(p.estado) }}</span>
          <div>
            <h3 class="status-title">{{ getEstadoNombre(p.estado) }}</h3>
            <p class="status-desc">{{ getEstadoDesc(p.estado) }}</p>
          </div>
        </div>

        <!-- Progress Steps -->
        <div class="progress-steps">
          @for (estado of estados; track estado.id; let i = $index) {
            <div class="step" [class.done]="isStepDone(estado.id)" [class.current]="p.estado === estado.id">
              <div class="step-dot">
                @if (isStepDone(estado.id)) {
                  <span>✓</span>
                } @else {
                  <span>{{ i + 1 }}</span>
                }
              </div>
              <div class="step-info">
                <span class="step-name">{{ estado.icono }} {{ estado.nombre }}</span>
              </div>
              @if (i < estados.length - 1) {
                <div class="step-line" [class.done]="isStepDone(estado.id)"></div>
              }
            </div>
          }
        </div>

        <!-- Motorizado Card -->
        <div class="moto-card">
          <img [src]="motoService.motorizado().fotoUrl" alt="Motorizado" class="moto-avatar" />
          <div class="moto-info">
            <h4>{{ motoService.motorizado().nombre }}</h4>
            <p>Tu motorizado 🛵</p>
          </div>
          <div class="moto-actions">
            <button class="action-btn" (click)="abrirChat()">💬</button>
            <a class="action-btn" [href]="'tel:' + motoService.motorizado().telefono">📞</a>
          </div>
        </div>

        <!-- Pedido Detail -->
        <div class="order-card">
          <h3 class="card-title">📦 Detalle del Pedido</h3>
          <p class="order-local">{{ p.nombreLocal }}</p>
          @for (item of p.productos; track item.productoId) {
            <div class="order-item">
              <span>{{ item.cantidad }}x {{ item.nombre }}</span>
              <span class="item-price">\${{ (item.precio * item.cantidad).toFixed(2) }}</span>
            </div>
          }
          <div class="order-divider"></div>
          <div class="order-item">
            <span>Envío</span>
            <span>\${{ p.envio.toFixed(2) }}</span>
          </div>
          <div class="order-item total">
            <span>Total</span>
            <span>\${{ p.total.toFixed(2) }}</span>
          </div>
        </div>

        <p class="order-address">📍 {{ p.direccionEntrega }}</p>
        @if (p.notas) {
          <p class="order-notes">📝 {{ p.notas }}</p>
        }

        <!-- Demo buttons to advance states -->
        <div class="demo-section">
          <p class="demo-label">🧪 Demo: Simular avance de estado</p>
          <div class="demo-buttons">
            @for (estado of estados; track estado.id) {
              <button
                class="btn btn-sm"
                [class.btn-primary]="p.estado !== estado.id"
                [class.btn-accent]="p.estado === estado.id"
                (click)="cambiarEstado(estado.id)"
              >
                {{ estado.icono }}
              </button>
            }
          </div>
        </div>
      </main>
    }
  `,
    styles: [`
    :host { display: block; background: var(--color-bg); min-height: 100vh; }

    .seg-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px; background: white;
      box-shadow: var(--shadow-xs);
      position: sticky; top: 0; z-index: 10;
    }
    .seg-header h2 { font-size: 1.15rem; font-weight: 700; }
    .back-btn {
      width: 36px; height: 36px; background: var(--color-bg-input);
      border-radius: 50%; font-size: 1.1rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }

    .seg-content { padding: 16px; display: flex; flex-direction: column; gap: 16px; }

    /* Status Banner */
    .status-banner {
      display: flex; align-items: center; gap: 14px;
      padding: 20px; border-radius: 16px;
      animation: fadeIn 500ms ease;
    }
    .status-recibido { background: linear-gradient(135deg, #dbeafe, #eff6ff); }
    .status-transferido { background: linear-gradient(135deg, #fef3c7, #fffbeb); }
    .status-asignado { background: linear-gradient(135deg, #d1fae5, #ecfdf5); }
    .status-comprando { background: linear-gradient(135deg, #fce7f3, #fdf2f8); }
    .status-en_camino { background: linear-gradient(135deg, #dbeafe, #eff6ff); }
    .status-entregado { background: linear-gradient(135deg, #d1fae5, #ecfdf5); }
    .status-emoji { font-size: 2.5rem; }
    .status-title { font-size: 1.1rem; font-weight: 700; color: var(--color-text); }
    .status-desc { font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 2px; }

    /* Progress */
    .progress-steps {
      background: white; border-radius: 16px;
      padding: 20px; box-shadow: var(--shadow-xs);
    }
    .step {
      display: flex; align-items: center; gap: 12px;
      position: relative; padding: 8px 0;
    }
    .step-dot {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--color-bg-input); border: 2px solid var(--color-border);
      font-size: 0.75rem; font-weight: 700; color: var(--color-text-light);
      flex-shrink: 0; transition: all 0.3s;
      z-index: 1;
    }
    .step.done .step-dot {
      background: var(--color-primary); border-color: var(--color-primary);
      color: white;
    }
    .step.current .step-dot {
      background: var(--color-secondary); border-color: var(--color-secondary);
      color: white; box-shadow: 0 0 0 4px rgba(245,158,11,0.2);
      animation: pulse 2s infinite;
    }
    .step-name { font-size: 0.82rem; font-weight: 500; color: var(--color-text-secondary); }
    .step.done .step-name { color: var(--color-primary); font-weight: 600; }
    .step.current .step-name { color: var(--color-secondary); font-weight: 700; }
    .step-line {
      position: absolute; left: 15px; top: 40px;
      width: 2px; height: 20px; background: var(--color-border);
    }
    .step-line.done { background: var(--color-primary); }

    /* Motorizado */
    .moto-card {
      display: flex; align-items: center; gap: 14px;
      background: white; border-radius: 16px;
      padding: 16px; box-shadow: var(--shadow-xs);
    }
    .moto-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-primary-bg); }
    .moto-info { flex: 1; }
    .moto-info h4 { font-size: 0.95rem; font-weight: 700; }
    .moto-info p { font-size: 0.75rem; color: var(--color-text-light); }
    .moto-actions { display: flex; gap: 8px; }
    .action-btn {
      width: 42px; height: 42px; border-radius: 50%;
      background: var(--color-primary-bg); display: flex;
      align-items: center; justify-content: center;
      font-size: 1.1rem; transition: transform 0.2s;
      text-decoration: none;
    }
    .action-btn:active { transform: scale(0.9); }

    /* Order */
    .order-card {
      background: white; border-radius: 16px;
      padding: 16px; box-shadow: var(--shadow-xs);
    }
    .card-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; }
    .order-local { font-size: 0.82rem; color: var(--color-primary); font-weight: 600; margin-bottom: 10px; }
    .order-item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.85rem; }
    .order-item.total { font-weight: 800; font-size: 1rem; color: var(--color-text); }
    .order-divider { height: 1px; background: var(--color-border-light); margin: 6px 0; }
    .item-price { font-weight: 600; }

    .order-address, .order-notes {
      font-size: 0.82rem; color: var(--color-text-secondary);
      background: white; padding: 12px 16px; border-radius: 12px;
    }

    /* Demo */
    .demo-section {
      background: rgba(245,158,11,0.08);
      border: 1px dashed var(--color-secondary);
      border-radius: 12px; padding: 14px; text-align: center;
    }
    .demo-label { font-size: 0.75rem; color: var(--color-secondary); font-weight: 600; margin-bottom: 10px; }
    .demo-buttons { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `],
})
export class SeguimientoComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private pedidosService = inject(PedidosService);
    motoService = inject(MotorizadoService);

    pedido = signal<Pedido | undefined>(undefined);
    estados = ESTADOS_PEDIDO;

    ngOnInit() {
        this.route.params.subscribe(params => {
            const p = this.pedidosService.getPedidoById(params['id']);
            if (p) {
                this.pedido.set(p);
            } else {
                // Use mock active pedido
                const pedidos = this.pedidosService.pedidos();
                if (pedidos.length > 0) this.pedido.set(pedidos[0]);
            }
        });
    }

    isStepDone(estadoId: string): boolean {
        const p = this.pedido();
        if (!p) return false;
        const stateOrder = this.estados.map(e => e.id);
        return stateOrder.indexOf(p.estado) > stateOrder.indexOf(estadoId as any);
    }

    getEstadoIcon(estado: string): string {
        return this.estados.find(e => e.id === estado)?.icono || '📩';
    }
    getEstadoNombre(estado: string): string {
        return this.estados.find(e => e.id === estado)?.nombre || 'Recibido';
    }
    getEstadoDesc(estado: string): string {
        const descs: Record<string, string> = {
            recibido: 'Tu pedido ha sido recibido, esperamos tu transferencia',
            transferido: 'Transferencia confirmada, asignando motorizado...',
            asignado: 'Un motorizado ha aceptado tu encargo',
            comprando: 'El motorizado está comprando tus productos',
            en_camino: 'Tu pedido está en camino 🚀',
            entregado: '¡Pedido entregado! Gracias por usar MinasExpress',
        };
        return descs[estado] || '';
    }

    cambiarEstado(estado: string) {
        const p = this.pedido();
        if (p) {
            this.pedidosService.cambiarEstado(p.id, estado as any);
            this.pedido.set({ ...p, estado: estado as any });
        }
    }

    abrirChat() {
        const p = this.pedido();
        if (p) this.router.navigate(['/chat', p.id]);
    }
    volver() { this.router.navigate(['/pedidos']); }
}
