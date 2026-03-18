import { Component, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, PedidosService, AuthService } from '../../../core/services/data.service';
import { DATOS_TRANSFERENCIA, TARIFA_ENVIO, ItemPedido } from '../../../core/models/interfaces';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-[100dvh] flex flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div class="flex items-center justify-between max-w-2xl mx-auto w-full">
          <button class="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" (click)="volver()">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 class="text-base font-bold">Resumen de Pedido</h2>
          @if (carrito.items().length > 0) {
            <button class="text-accent-red text-sm font-bold flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-full transition-colors" (click)="carrito.vaciar()">
              Vaciar
            </button>
          } @else {
            <div class="w-16"></div>
          }
        </div>
      </header>

      <main class="flex-1 max-w-2xl mx-auto w-full pb-32">
        @if (carrito.items().length === 0) {
          <div class="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
            <div class="size-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <span class="material-symbols-outlined text-5xl text-slate-400">shopping_cart</span>
            </div>
            <h3 class="text-xl font-bold mb-2">Tu carrito está vacío</h3>
            <p class="text-slate-500 mb-8">Parece que aún no has añadido nada a tu pedido. ¡Explora nuestros locales!</p>
            <button class="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95" (click)="volver()">
              Explorar Locales
            </button>
          </div>
        } @else {
          <!-- Order Items List -->
          <section class="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 class="font-bold text-lg mb-4">Tus Productos</h3>
            <div class="flex flex-col gap-4">
              @for (item of carrito.items(); track item.producto.id) {
                <div class="flex gap-4 items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative animate-fade-in-up">
                  <div class="size-16 rounded-lg bg-cover bg-center shrink-0" [style.background-image]="'url(' + item.producto.fotoUrl + ')'"></div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-sm truncate">{{ item.producto.nombre }}</h4>
                    <p class="text-xs text-slate-500 truncate">{{ item.local.nombre }}</p>
                    <p class="font-extrabold text-primary text-sm mt-1">\${{ (item.producto.precio * item.cantidad).toFixed(2) }}</p>
                  </div>
                  
                  <div class="flex flex-col items-end gap-2 shrink-0">
                    <button class="text-slate-400 hover:text-accent-red" (click)="carrito.eliminar(item.producto.id)">
                      <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                    <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 p-1">
                      <button class="size-6 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 bg-white dark:bg-slate-600 shadow-sm transition-colors" (click)="carrito.decrementar(item.producto.id)">
                        <span class="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span class="font-bold text-xs w-2 text-center">{{ item.cantidad }}</span>
                      <button class="size-6 flex items-center justify-center rounded-full hover:bg-primary/20 hover:text-primary bg-white dark:bg-slate-600 shadow-sm transition-colors" (click)="carrito.incrementar(item.producto.id)">
                        <span class="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>

          <!-- Delivery Details & Map -->
          <section class="p-4 border-b border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-primary">pin_drop</span>
              <h3 class="font-bold text-lg">¿Dónde entregamos?</h3>
            </div>
            
            <div class="flex flex-col gap-4">
              <!-- Written Address -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Dirección escrita</label>
                <textarea class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary shadow-inner" 
                          rows="2" placeholder="Ej: Casa azul de 2 pisos, frente al parque..."
                          [(ngModel)]="direccion"></textarea>
              </div>

              <!-- Map LocationPicker -->
              <div>
                <div class="flex justify-between items-end mb-2">
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ubicación exacta (GPS)</label>
                  @if (ubicacionSeleccionada()) {
                    <span class="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">check_circle</span> Seleccionada</span>
                  } @else {
                    <span class="text-[10px] font-bold text-accent-red bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">error</span> Requerida</span>
                  }
                </div>
                
                <div class="relative w-full h-48 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm z-0">
                  <div id="delivery-map" class="w-full h-full"></div>
                  
                  <!-- Map Overlay Controls -->
                  <div class="absolute bottom-3 right-3 flex flex-col gap-2 z-[400]">
                    <button class="size-10 bg-white text-primary rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 border border-slate-100" title="Usar mi ubicación actual" (click)="usarMiUbicacion()">
                      <span class="material-symbols-outlined">my_location</span>
                    </button>
                  </div>
                  
                  <!-- Map Helper Overlay -->
                  @if (!ubicacionSeleccionada()) {
                    <div class="absolute top-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-slate-200 z-[400] flex items-center gap-2 pointer-events-none">
                      <span class="material-symbols-outlined text-primary animate-bounce">touch_app</span>
                      <p class="text-xs font-bold text-slate-700">Toca el mapa para fijar el pin de entrega</p>
                    </div>
                  }
                </div>
              </div>

              <!-- Driver Notes -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notas para el motorizado</label>
                <div class="flex gap-2">
                  <span class="material-symbols-outlined text-slate-400 mt-2 shrink-0">motorcycle</span>
                  <input type="text" class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary shadow-inner" 
                         placeholder="Ej: Tocar el timbre azul"
                         [(ngModel)]="notas">
                </div>
              </div>
            </div>
          </section>

          <!-- Payment Details -->
          <section class="p-4">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-primary">account_balance</span>
              <h3 class="font-bold text-lg">Pago con Transferencia</h3>
            </div>
            
            <div class="bg-primary-blue text-white rounded-2xl p-5 shadow-lg relative overflow-hidden mb-6">
              <!-- Background Shape -->
              <div class="absolute -right-6 -bottom-6 size-32 bg-white/10 rounded-full blur-2xl"></div>
              
              <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <p class="text-white/70 text-xs font-medium uppercase tracking-wider">Banco</p>
                    <p class="font-bold text-lg">{{ datos.banco }}</p>
                  </div>
                  <span class="material-symbols-outlined text-3xl opacity-50">account_balance_wallet</span>
                </div>
                
                <div class="mb-4">
                  <p class="text-white/70 text-xs font-medium uppercase tracking-wider">Cuenta {{ datos.tipoCuenta }}</p>
                  <p class="font-extrabold text-2xl tracking-widest">{{ datos.numeroCuenta }}</p>
                </div>
                
                <div class="flex justify-between items-end">
                  <div>
                    <p class="text-white/70 text-xs font-medium uppercase tracking-wider">Titular</p>
                    <p class="font-bold text-sm">{{ datos.titular }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-white/70 text-xs font-medium uppercase tracking-wider">Cédula</p>
                    <p class="font-bold text-sm">{{ datos.cedula }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload Receipt -->
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Comprobante de pago</label>
              
              @if (!comprobanteSubido()) {
                <label class="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group">
                  <div class="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm group-hover:scale-110 transition-transform mb-3">
                    <span class="material-symbols-outlined text-primary text-2xl">upload_file</span>
                  </div>
                  <p class="text-sm font-bold text-center">Toca para subir captura</p>
                  <p class="text-xs text-slate-500 text-center mt-1">Sube la foto del comprobante de transferencia con el valor total a pagar.</p>
                  <input type="file" accept="image/*" class="hidden" (change)="subirComprobante($event)">
                </label>
              } @else {
                <div class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
                  <div class="flex items-center gap-3">
                    <div class="size-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                      <span class="material-symbols-outlined">check</span>
                    </div>
                    <div>
                      <p class="font-bold text-sm text-green-800 dark:text-green-300">Comprobante Listo</p>
                      <p class="text-xs text-green-600 dark:text-green-500">Documento adjunto exitosamente</p>
                    </div>
                  </div>
                  <button class="text-xs font-bold text-green-700 underline hover:text-green-800" (click)="comprobanteSubido.set(false)">
                    Cambiar
                  </button>
                </div>
              }
            </div>
          </section>
        }
      </main>

      <!-- Sticky Footer / Summary -->
      @if (carrito.items().length > 0) {
        <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[42rem] bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[100]">
          <div class="w-full">
            <div class="flex flex-col gap-2 mb-4 px-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 font-medium">Subtotal</span>
                <span class="font-bold">\${{ carrito.subtotal().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500 font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">two_wheeler</span> Costo de Envío</span>
                <span class="font-bold">\${{ carrito.envio().toFixed(2) }}</span>
              </div>
              <div class="h-px w-full bg-slate-200 dark:bg-slate-800 my-1"></div>
              <div class="flex justify-between items-end">
                <span class="font-bold">Total a transferir</span>
                <span class="font-extrabold text-2xl text-primary">\${{ carrito.total().toFixed(2) }}</span>
              </div>
            </div>
            
            <button class="w-full flex items-center justify-center gap-2 h-14 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    [class.bg-primary]="comprobanteSubido() && direccion.trim() && ubicacionSeleccionada()"
                    [class.bg-slate-400]="!comprobanteSubido() || !direccion.trim() || !ubicacionSeleccionada()"
                    [disabled]="!comprobanteSubido() || !direccion.trim() || !ubicacionSeleccionada()"
                    (click)="confirmarPedido()">
              <span class="material-symbols-outlined">send</span>
              Confirmar y Enviar Pedido
            </button>
            
            <p class="text-[10px] text-center mt-3 text-slate-500">
              Al confirmar enviaremos tu pedido y comprobante a un motorizado.
            </p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 300ms ease-out both;
    }
  `]
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
