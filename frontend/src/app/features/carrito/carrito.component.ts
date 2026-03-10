import { Component, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, PedidosService, AuthService } from '../../core/services/data.service';
import { DATOS_TRANSFERENCIA, TARIFA_ENVIO, ItemPedido } from '../../core/models/interfaces';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Header -->
    <header class="cart-header">
      <button class="back-btn" (click)="volver()">←</button>
      <h2>Mi Carrito</h2>
      @if (carrito.items().length > 0) {
        <button class="clear-btn" (click)="carrito.vaciar()">Vaciar</button>
      }
    </header>

    <main class="cart-content">
      @if (carrito.items().length === 0) {
        <div class="empty-state">
          <span class="empty-state-icon">🛒</span>
          <p class="empty-state-title">Tu carrito está vacío</p>
          <p class="empty-state-text">Explora locales y agrega productos</p>
          <button class="btn btn-primary" (click)="volver()">Explorar Locales</button>
        </div>
      } @else {
        <!-- Items -->
        <section class="cart-items">
          @for (item of carrito.items(); track item.producto.id) {
            <div class="cart-item">
              <img [src]="item.producto.fotoUrl" [alt]="item.producto.nombre" class="item-img" />
              <div class="item-info">
                <h4>{{ item.producto.nombre }}</h4>
                <p class="item-local">{{ item.local.nombre }}</p>
                <div class="item-bottom">
                  <span class="item-price">\${{ (item.producto.precio * item.cantidad).toFixed(2) }}</span>
                  <div class="qty-controls">
                    <button class="qty-btn" (click)="carrito.decrementar(item.producto.id)">−</button>
                    <span class="qty-val">{{ item.cantidad }}</span>
                    <button class="qty-btn" (click)="carrito.incrementar(item.producto.id)">+</button>
                  </div>
                </div>
              </div>
              <button class="remove-btn" (click)="carrito.eliminar(item.producto.id)">✕</button>
            </div>
          }
        </section>

        <!-- Dirección -->
        <section class="section-card">
          <h3 class="section-label">📍 Dirección de entrega</h3>
          <textarea
            class="input-field"
            placeholder="Ej: Calle Bolívar y Sucre, casa azul esquinera"
            [(ngModel)]="direccion"
            rows="2"
          ></textarea>
        </section>

        <!-- Mapa Ubicación -->
        <section class="section-card">
          <h3 class="section-label">🗺️ Ubicación en el mapa</h3>
          <p class="map-hint">Toca el mapa para marcar tu ubicación exacta</p>
          <div class="map-wrapper">
            <div id="delivery-map" class="delivery-map"></div>
            <button class="gps-btn" (click)="usarMiUbicacion()" title="Usar mi ubicación">
              📍
            </button>
          </div>
          @if (ubicacionSeleccionada()) {
            <div class="location-info">
              <span class="location-check">✅</span>
              <span>Ubicación marcada</span>
              <span class="coords">{{ ubicacionSeleccionada()!.lat.toFixed(5) }}, {{ ubicacionSeleccionada()!.lng.toFixed(5) }}</span>
            </div>
          } @else {
            <p class="map-warning">⚠️ Marca tu ubicación para que el motorizado te encuentre fácil</p>
          }
        </section>

        <!-- Notas -->
        <section class="section-card">
          <h3 class="section-label">📝 Notas para el motorizado</h3>
          <textarea
            class="input-field"
            placeholder="Ej: Que la salsa sea de ají, sin cebolla..."
            [(ngModel)]="notas"
            rows="2"
          ></textarea>
        </section>

        <!-- Transferencia -->
        <section class="section-card transfer-section">
          <h3 class="section-label">💰 Datos para transferencia</h3>
          <div class="transfer-card">
            <div class="transfer-row">
              <span class="t-label">Banco</span>
              <span class="t-value">{{ datos.banco }}</span>
            </div>
            <div class="transfer-row">
              <span class="t-label">Cuenta</span>
              <span class="t-value">{{ datos.tipoCuenta }} - {{ datos.numeroCuenta }}</span>
            </div>
            <div class="transfer-row">
              <span class="t-label">Titular</span>
              <span class="t-value">{{ datos.titular }}</span>
            </div>
            <div class="transfer-row">
              <span class="t-label">Cédula</span>
              <span class="t-value">{{ datos.cedula }}</span>
            </div>
            <p class="transfer-note">📲 Transfiere el valor TOTAL y sube tu comprobante</p>
          </div>
        </section>

        <!-- Upload comprobante -->
        <section class="section-card">
          <h3 class="section-label">📸 Comprobante de transferencia</h3>
          @if (!comprobanteSubido()) {
            <label class="upload-area" for="comprobante">
              <span class="upload-icon">📎</span>
              <span>Toca para subir foto del comprobante</span>
              <input type="file" id="comprobante" accept="image/*" (change)="subirComprobante($event)" hidden />
            </label>
          } @else {
            <div class="upload-done">
              <span>✅ Comprobante subido</span>
              <button class="btn btn-sm" (click)="comprobanteSubido.set(false)">Cambiar</button>
            </div>
          }
        </section>

        <!-- Resumen -->
        <section class="summary-card">
          <h3 class="section-label">Resumen del pedido</h3>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>\${{ carrito.subtotal().toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Envío 🛵</span>
            <span>\${{ carrito.envio().toFixed(2) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row total">
            <span>Total a transferir</span>
            <span>\${{ carrito.total().toFixed(2) }}</span>
          </div>
        </section>

        <!-- Confirmar -->
        <button
          class="btn btn-primary btn-full btn-lg confirm-btn"
          [disabled]="!comprobanteSubido() || !direccion.trim()"
          (click)="confirmarPedido()"
        >
          ✅ Confirmar Pedido
        </button>

        @if (!comprobanteSubido()) {
          <p class="helper-text">Sube el comprobante de transferencia para continuar</p>
        }
        @if (!direccion.trim()) {
          <p class="helper-text">Ingresa tu dirección de entrega</p>
        }
      }
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--color-bg); min-height: 100vh; }

    .cart-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: white;
      box-shadow: var(--shadow-xs);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .cart-header h2 { flex: 1; font-size: 1.15rem; font-weight: 700; }
    .back-btn {
      width: 36px; height: 36px;
      background: var(--color-bg-input);
      border-radius: 50%;
      font-size: 1.1rem;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .clear-btn {
      font-size: 0.8rem;
      color: var(--color-danger);
      font-weight: 600;
    }

    .cart-content { padding: 16px; display: flex; flex-direction: column; gap: 16px; padding-bottom: 40px; }

    /* Items */
    .cart-items { display: flex; flex-direction: column; gap: 10px; }
    .cart-item {
      display: flex;
      gap: 12px;
      background: white;
      border-radius: 14px;
      padding: 12px;
      box-shadow: var(--shadow-xs);
      position: relative;
      animation: fadeInUp 300ms ease both;
    }
    .item-img { width: 70px; height: 70px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
    .item-info { flex: 1; display: flex; flex-direction: column; }
    .item-info h4 { font-size: 0.88rem; font-weight: 700; }
    .item-local { font-size: 0.72rem; color: var(--color-text-light); margin-top: 2px; }
    .item-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
    .item-price { font-weight: 800; color: var(--color-primary); }
    .qty-controls { display: flex; align-items: center; gap: 8px; }
    .qty-btn {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--color-bg-input); border: 1px solid var(--color-border);
      font-weight: 700; font-size: 1rem;
      display: flex; align-items: center; justify-content: center;
    }
    .qty-val { font-weight: 700; font-size: 0.85rem; min-width: 16px; text-align: center; }
    .remove-btn {
      position: absolute; top: 8px; right: 8px;
      width: 24px; height: 24px; border-radius: 50%;
      background: var(--color-bg-input); font-size: 0.7rem;
      display: flex; align-items: center; justify-content: center;
      color: var(--color-text-light);
    }

    /* Sections */
    .section-card {
      background: white;
      border-radius: 14px;
      padding: 16px;
      box-shadow: var(--shadow-xs);
    }
    .section-label { font-size: 0.88rem; font-weight: 700; margin-bottom: 10px; }
    .section-card .input-field { border-radius: 10px; resize: none; }

    /* Transfer */
    .transfer-card {
      background: var(--color-bg);
      border-radius: 12px;
      padding: 14px;
    }
    .transfer-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 0.82rem;
    }
    .transfer-row:not(:last-of-type) { border-bottom: 1px solid var(--color-border-light); }
    .t-label { color: var(--color-text-light); }
    .t-value { font-weight: 600; color: var(--color-text); }
    .transfer-note {
      margin-top: 10px;
      font-size: 0.75rem;
      color: var(--color-primary);
      font-weight: 600;
      text-align: center;
    }

    /* Upload */
    .upload-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 24px;
      border: 2px dashed var(--color-border);
      border-radius: 12px;
      cursor: pointer;
      color: var(--color-text-light);
      font-size: 0.85rem;
      transition: all 0.25s;
    }
    .upload-area:hover { border-color: var(--color-primary); background: var(--color-primary-bg); }
    .upload-icon { font-size: 1.8rem; }
    .upload-done {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px;
      background: rgba(16,185,129,0.1);
      border-radius: 12px;
      color: var(--color-success);
      font-weight: 600;
      font-size: 0.88rem;
    }

    /* Summary */
    .summary-card {
      background: white;
      border-radius: 14px;
      padding: 16px;
      box-shadow: var(--shadow-xs);
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 0.88rem;
      color: var(--color-text-secondary);
    }
    .summary-row.total {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--color-text);
    }
    .summary-divider {
      height: 1px;
      background: var(--color-border);
      margin: 4px 0;
    }

    /* Map */
    .map-hint {
      font-size: 0.75rem;
      color: var(--color-text-light);
      margin-bottom: 10px;
    }
    .map-wrapper {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid var(--color-border);
    }
    .delivery-map {
      width: 100%;
      height: 220px;
      z-index: 0;
    }
    .gps-btn {
      position: absolute;
      bottom: 12px;
      right: 12px;
      width: 42px;
      height: 42px;
      background: white;
      border-radius: 50%;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      z-index: 1;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid var(--color-border);
    }
    .gps-btn:hover {
      transform: scale(1.1);
      box-shadow: var(--shadow-lg);
    }
    .gps-btn:active { transform: scale(0.95); }
    .location-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      padding: 10px 14px;
      background: rgba(16, 185, 129, 0.08);
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--color-success);
    }
    .location-check { font-size: 1rem; }
    .coords {
      margin-left: auto;
      font-size: 0.7rem;
      font-weight: 400;
      color: var(--color-text-light);
      font-family: monospace;
    }
    .map-warning {
      margin-top: 8px;
      font-size: 0.75rem;
      color: var(--color-warning);
      font-weight: 500;
    }

    .confirm-btn { margin-top: 8px; }
    .helper-text { text-align: center; font-size: 0.75rem; color: var(--color-warning); font-weight: 500; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class CarritoComponent implements AfterViewInit, OnDestroy {
  carrito = inject(CarritoService);
  private pedidosService = inject(PedidosService);
  private auth = inject(AuthService);
  private router = inject(Router);

  datos = DATOS_TRANSFERENCIA;
  direccion = '';
  notas = '';
  comprobanteSubido = signal(false);
  ubicacionSeleccionada = signal<{ lat: number; lng: number } | null>(null);

  private map: any = null;
  private marker: any = null;
  private L: any = null;

  ngAfterViewInit() {
    if (this.carrito.items().length > 0) {
      setTimeout(() => this.initMap(), 100);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap() {
    this.L = (window as any)['L'];
    if (!this.L) return;

    // Centro en San José de Minas
    const defaultLat = 0.1575;
    const defaultLng = -78.3833;

    this.map = this.L.map('delivery-map', {
      center: [defaultLat, defaultLng],
      zoom: 15,
      zoomControl: false,
    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(this.map);

    // Zoom control en la esquina izq
    this.L.control.zoom({ position: 'topleft' }).addTo(this.map);

    // Click en el mapa para marcar ubicación
    this.map.on('click', (e: any) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  private setMarker(lat: number, lng: number) {
    if (!this.L || !this.map) return;

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    const customIcon = this.L.divIcon({
      html: '<div style="font-size:2rem;text-align:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">📍</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      className: '',
    });

    this.marker = this.L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    this.map.setView([lat, lng], 17);
    this.ubicacionSeleccionada.set({ lat, lng });
  }

  usarMiUbicacion() {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.setMarker(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        alert('No se pudo obtener tu ubicación. Marca el punto en el mapa manualmente.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  subirComprobante(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.comprobanteSubido.set(true);
    }
  }

  confirmarPedido() {
    const items = this.carrito.items();
    if (items.length === 0) return;

    const productos: ItemPedido[] = items.map(i => ({
      productoId: i.producto.id,
      nombre: i.producto.nombre,
      precio: i.producto.precio,
      cantidad: i.cantidad,
      fotoUrl: i.producto.fotoUrl,
    }));

    const pedido = this.pedidosService.crearPedido({
      clienteId: this.auth.usuario()?.uid,
      localId: items[0].local.id,
      productos,
      subtotal: this.carrito.subtotal(),
      total: this.carrito.total(),
      direccionEntrega: this.direccion,
      notas: this.notas,
      ubicacionGps: this.ubicacionSeleccionada(),
      nombreLocal: items[0].local.nombre,
    });

    this.carrito.vaciar();
    this.router.navigate(['/seguimiento', pedido.id]);
  }

  volver() { this.router.navigate(['/home']); }
}
