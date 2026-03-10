import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalesService, ProductosService, CarritoService } from '../../core/services/data.service';
import { Producto, Local } from '../../core/models/interfaces';

@Component({
    selector: 'app-local-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (local(); as loc) {
      <!-- Header Image -->
      <div class="detail-header">
        <img [src]="loc.fotoUrl" [alt]="loc.nombre" class="header-img" />
        <div class="header-overlay">
          <button class="back-btn" (click)="volver()">←</button>
        </div>
        <div class="header-info">
          <h1 class="local-name">{{ loc.nombre }}</h1>
          <div class="local-meta">
            <span>⭐ {{ loc.calificacion }}</span>
            <span>📍 {{ loc.direccion }}</span>
            <span>🕐 {{ loc.horario }}</span>
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs">
        @for (cat of categorias(); track cat) {
          <button
            class="tab-btn"
            [class.active]="categoriaActiva() === cat"
            (click)="categoriaActiva.set(cat)"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Products -->
      <div class="products-list">
        @for (producto of productosFiltrados(); track producto.id; let i = $index) {
          <div class="product-card animate-fade-in-up" [style.animation-delay]="(i * 50) + 'ms'">
            <img [src]="producto.fotoUrl" [alt]="producto.nombre" class="product-img" loading="lazy" />
            <div class="product-info">
              <h4 class="product-name">{{ producto.nombre }}</h4>
              <p class="product-desc">{{ producto.descripcion }}</p>
              <div class="product-bottom">
                <span class="product-price">\${{ producto.precio.toFixed(2) }}</span>
                <div class="qty-controls">
                  @if (getCantidad(producto) > 0) {
                    <button class="qty-btn" (click)="decrementar(producto)">−</button>
                    <span class="qty-value">{{ getCantidad(producto) }}</span>
                  }
                  <button class="qty-btn add" (click)="agregar(producto)">+</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- FAB Carrito -->
      @if (carrito.cantidadTotal() > 0) {
        <button class="fab-carrito" (click)="irAlCarrito()">
          <span>🛒 Ver Carrito</span>
          <span class="fab-count">{{ carrito.cantidadTotal() }}</span>
          <span class="fab-total">\${{ carrito.total().toFixed(2) }}</span>
        </button>
      }
    }
  `,
    styles: [`
    :host { display: block; background: var(--color-bg); min-height: 100vh; padding-bottom: 100px; }

    .detail-header {
      position: relative;
      height: 240px;
      overflow: hidden;
    }
    .header-img { width: 100%; height: 100%; object-fit: cover; }
    .header-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%);
    }
    .back-btn {
      position: absolute;
      top: 16px;
      left: 16px;
      width: 40px; height: 40px;
      background: rgba(255,255,255,0.9);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem;
      box-shadow: var(--shadow-sm);
      color: var(--color-text);
      font-weight: 700;
      z-index: 2;
    }
    .header-info {
      position: absolute;
      bottom: 16px;
      left: 16px;
      right: 16px;
      z-index: 1;
    }
    .local-name { font-size: 1.4rem; font-weight: 800; color: white; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }
    .local-meta { display: flex; gap: 12px; margin-top: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.9); flex-wrap: wrap; }

    /* Category Tabs */
    .category-tabs {
      display: flex;
      gap: 8px;
      padding: 16px;
      overflow-x: auto;
      scrollbar-width: none;
      position: sticky;
      top: 0;
      background: var(--color-bg);
      z-index: 10;
    }
    .category-tabs::-webkit-scrollbar { display: none; }
    .tab-btn {
      padding: 8px 18px;
      border-radius: 30px;
      font-size: 0.8rem;
      font-weight: 600;
      background: white;
      color: var(--color-text-secondary);
      border: 1.5px solid var(--color-border);
      white-space: nowrap;
      transition: all 0.25s;
    }
    .tab-btn.active {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
      box-shadow: var(--shadow-glow);
    }

    /* Products */
    .products-list { padding: 0 16px; display: flex; flex-direction: column; gap: 12px; }
    .product-card {
      display: flex;
      gap: 14px;
      background: white;
      border-radius: 16px;
      padding: 12px;
      box-shadow: var(--shadow-xs);
      transition: transform 0.2s;
    }
    .product-card:active { transform: scale(0.98); }
    .product-img {
      width: 90px; height: 90px;
      border-radius: 12px;
      object-fit: cover;
      flex-shrink: 0;
    }
    .product-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .product-name { font-size: 0.9rem; font-weight: 700; color: var(--color-text); margin-bottom: 2px; }
    .product-desc { font-size: 0.75rem; color: var(--color-text-light); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .product-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
    .product-price { font-size: 1.05rem; font-weight: 800; color: var(--color-primary); }

    /* Quantity Controls */
    .qty-controls { display: flex; align-items: center; gap: 8px; }
    .qty-btn {
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
      font-weight: 700;
      background: var(--color-bg-input);
      color: var(--color-text);
      border: 1.5px solid var(--color-border);
      transition: all 0.2s;
    }
    .qty-btn.add {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }
    .qty-btn:active { transform: scale(0.85); }
    .qty-value { font-size: 0.9rem; font-weight: 700; min-width: 20px; text-align: center; }

    /* FAB */
    .fab-carrito {
      position: fixed;
      bottom: 24px;
      left: 16px;
      right: 16px;
      max-width: 448px;
      margin: 0 auto;
      background: var(--color-primary-gradient);
      color: white;
      padding: 16px 20px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.95rem;
      font-weight: 700;
      box-shadow: var(--shadow-glow);
      z-index: 100;
      animation: slideInUp 400ms cubic-bezier(0.34,1.56,0.64,1);
    }
    .fab-count {
      background: rgba(255,255,255,0.25);
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
    }
    .fab-total { margin-left: auto; font-size: 1.05rem; }
    @keyframes slideInUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `],
})
export class LocalDetailComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private localesService = inject(LocalesService);
    private productosService = inject(ProductosService);
    carrito = inject(CarritoService);

    local = signal<Local | undefined>(undefined);
    categorias = signal<string[]>([]);
    categoriaActiva = signal('');

    productosFiltrados = computed(() => {
        const loc = this.local();
        const cat = this.categoriaActiva();
        if (!loc) return [];
        if (!cat) return this.productosService.getProductosByLocal(loc.id);
        return this.productosService.getProductosByLocalAndCategoria(loc.id, cat);
    });

    constructor() {
        this.route.params.subscribe((params) => {
            const id = params['id'];
            const loc = this.localesService.getLocalById(id);
            this.local.set(loc);
            if (loc) {
                const cats = this.productosService.getCategoriasByLocal(loc.id);
                this.categorias.set(cats);
                if (cats.length > 0) this.categoriaActiva.set(cats[0]);
            }
        });
    }

    getCantidad(producto: Producto): number {
        return this.carrito.getCantidadProducto(producto.id);
    }

    agregar(producto: Producto) {
        const loc = this.local();
        if (loc) this.carrito.agregar(producto, loc);
    }

    decrementar(producto: Producto) {
        this.carrito.decrementar(producto.id);
    }

    irAlCarrito() { this.router.navigate(['/carrito']); }
    volver() { this.router.navigate(['/home']); }
}
