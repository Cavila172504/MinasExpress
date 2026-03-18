import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MotorizadoService, PedidosService, ChatService, AuthService } from '../../../core/services/data.service';
import { TARIFA_ENVIO, PORCENTAJE_MOTORIZADO, Pedido } from '../../../core/models/interfaces';

@Component({
  selector: 'app-motorizado',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-[100dvh] flex flex-col font-display">
      <header class="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between px-4 py-4">
          <div class="flex items-center gap-3">
            <div class="bg-primary/10 p-2 rounded-lg cursor-pointer" (click)="router.navigate(['/home'])">
              <span class="material-symbols-outlined text-primary">arrow_back</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight">Panel Motorizado</h1>
          </div>
          <div class="flex items-center gap-2">
            <!-- Disponibilidad Toggle -->
            <button class="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all"
                    [class.border-primary]="motoService.disponible()"
                    [class.bg-primary/10]="motoService.disponible()"
                    [class.text-primary]="motoService.disponible()"
                    [class.border-slate-300]="!motoService.disponible()"
                    [class.text-slate-500]="!motoService.disponible()"
                    (click)="motoService.toggleDisponible()">
               <span class="relative flex h-2.5 w-2.5">
                  @if (motoService.disponible()) {
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  }
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5" [class.bg-primary]="motoService.disponible()" [class.bg-slate-400]="!motoService.disponible()"></span>
               </span>
               <span class="text-sm font-bold">{{ motoService.disponible() ? 'Activo' : 'Inactivo' }}</span>
            </button>
            
            <div class="relative bg-primary/10 p-2 rounded-full hidden">
              <span class="material-symbols-outlined text-primary">notifications</span>
              <span class="absolute top-1 right-1 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
          </div>
        </div>
        
        <div class="px-4">
          <div class="flex gap-8">
            <button class="flex flex-col items-center justify-center pb-3 pt-2" [class.active-tab]="tab() === 'cerca'" [class.text-slate-500]="tab() !== 'cerca'" [class.dark:text-slate-400]="tab() !== 'cerca'" (click)="tab.set('cerca')">
              <span class="text-sm font-bold">Cerca de mí</span>
            </button>
            <button class="flex flex-col items-center justify-center pb-3 pt-2" [class.active-tab]="tab() === 'programados'" [class.text-slate-500]="tab() !== 'programados'" [class.dark:text-slate-400]="tab() !== 'programados'" (click)="tab.set('programados')">
              <span class="text-sm font-bold">Activos/Prog.</span>
            </button>
            <button class="flex flex-col items-center justify-center pb-3 pt-2" [class.active-tab]="tab() === 'historial'" [class.text-slate-500]="tab() !== 'historial'" [class.dark:text-slate-400]="tab() !== 'historial'" (click)="tab.set('historial')">
              <span class="text-sm font-bold">Historial</span>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        
        @if (tab() === 'cerca') {
            <!-- Ganancias Resumen -->
            <div class="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4 shadow-lg text-white flex justify-between items-center mb-6">
               <div>
                  <p class="text-white/80 text-sm font-medium">Ganancias de hoy</p>
                  <p class="text-3xl font-bold">\${{ ganancias().toFixed(2) }}</p>
               </div>
               <div class="text-right">
                   <p class="font-bold border border-white/30 bg-white/10 px-3 py-1 rounded-full text-sm">{{ entregas() }} entregas</p>
               </div>
            </div>

            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-bold">Pedidos Disponibles</h2>
              @if (pedidoNuevo()) {
                  <span class="animate-pulse text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">1 Nuevo</span>
              } @else {
                  <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">Buscando...</span>
              }
            </div>

            @if (pedidoNuevo(); as p) {
                <div class="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border-2 border-primary/50 flex flex-col gap-4 animate-fade-in-up">
                  <div class="flex justify-between items-start">
                    <div class="flex gap-4">
                      <div class="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-primary text-3xl">store</span>
                      </div>
                      <div>
                        <h3 class="font-bold text-base">{{ p.nombreLocal }}</h3>
                        <p class="text-slate-500 dark:text-slate-400 text-sm flex items-start gap-1 mt-1">
                            <span class="material-symbols-outlined text-[16px] shrink-0">location_on</span>
                            <span>{{ p.direccionEntrega }}</span>
                        </p>
                        <div class="mt-2 flex items-center gap-2">
                            <span class="text-primary font-bold text-lg">+\${{ (TARIFA_ENVIO * PORCENTAJE_MOTORIZADO).toFixed(2) }}</span>
                            <span class="text-slate-400 text-xs">• Ganancia estimada</span>
                        </div>
                        <div class="mt-2 flex flex-wrap gap-1">
                            @for (item of p.productos; track item.productoId) {
                                <span class="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{{ item.cantidad }}x {{ item.nombre }}</span>
                            }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2 mt-2">
                    <button class="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg font-bold text-sm hover:brightness-95 transition-all" (click)="rechazar()">Rechazar</button>
                    <button class="flex-[2] bg-primary text-white py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex justify-center items-center gap-2" (click)="aceptar()">
                        <span>Aceptar Pedido</span><span class="material-symbols-outlined text-sm font-bold">check</span>
                    </button>
                  </div>
                </div>
            } @else {
                <div class="flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                    <div class="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                        <span class="material-symbols-outlined text-3xl">radar</span>
                    </div>
                    <p class="font-bold text-slate-700 dark:text-slate-300">Esperando pedidos...</p>
                    <p class="text-sm text-slate-500 mt-1">Mantente activo para recibir solicitudes</p>
                </div>
            }

            <div class="relative rounded-xl overflow-hidden h-40 border border-slate-200 dark:border-slate-700 mt-6">
              <img alt="Mapa de la ciudad" class="w-full h-full object-cover" data-alt="Mapa interactivo con puntos de pedidos cercanos" data-location="Manizales" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR5gSC2Lh3KdpJA7wWwwvwDDJZ5FLQi_En3W_yPVcyD6fObUZofbc8k5p9lAxuyuypgyDovbNdeLSsfbV3L-1TAMhOa9Mqzg2ZVrRikOGcT2QXGeZC95ntJ3W0Y4dszFQNvqZc5e-K3c8BHDTTGpHBtzLdV7B-27F74l0tBGOBGSGa-A0l9Z1EoQNk_rlOBX3lHJghJ77yofTRPsKltfY3rr7QbzpXgNR3uOn9srJDYYdWmiFMHCcKlpNbUTaD4e8n8dNCEsBIBILL"/>
              <div class="absolute inset-0 bg-black/10"></div>
              <div class="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm backdrop-blur-sm">
                  Ver mapa de calor
              </div>
            </div>
        }

        @if (tab() === 'programados') {
            <h2 class="text-lg font-bold mb-4">Pedidos en Curso</h2>
            
            @if (pedidoActivo(); as p) {
                <div class="bg-white dark:bg-slate-900 rounded-xl p-0 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <div class="flex justify-between items-center mb-2">
                             <h4 class="font-bold text-lg text-primary">{{ p.nombreLocal }}</h4>
                             <span class="text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">{{ p.estado.replace('_', ' ') }}</span>
                        </div>
                        <p class="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-1">
                            <span class="material-symbols-outlined text-[18px] shrink-0 text-amber-500">pin_drop</span>
                            <span>{{ p.direccionEntrega }}</span>
                        </p>
                        @if (p.ubicacionGps) {
                          <button class="mt-3 w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-lg font-bold text-sm flex justify-center items-center gap-2 hover:bg-slate-50 transition-colors" (click)="abrirMapa(p.ubicacionGps)">
                             <span class="material-symbols-outlined text-base">map</span> Ver en mapa
                          </button>
                        }
                    </div>
                    
                    <div class="p-4">
                        <h5 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Productos a comprar</h5>
                        <ul class="space-y-2 mb-4">
                            @for (item of p.productos; track item.productoId) {
                                <li class="flex justify-between text-sm">
                                    <span class="font-medium">{{ item.cantidad }}x {{ item.nombre }}</span>
                                    <span class="text-slate-500">\${{ (item.precio * item.cantidad).toFixed(2) }}</span>
                                </li>
                            }
                        </ul>
                        
                        <div class="flex gap-2">
                             <button class="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors" (click)="abrirChat(p.id)">
                                <span class="material-symbols-outlined">chat</span>
                             </button>
                             
                             @switch (p.estado) {
                                @case ('asignado') {
                                    <button class="flex-1 bg-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20" (click)="marcarComprando(p.id)">
                                        <span class="material-symbols-outlined">shopping_cart</span> Llegué al local
                                    </button>
                                }
                                @case ('comprando') {
                                    <button class="flex-1 bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20" (click)="marcarEnCamino(p.id)">
                                        <span class="material-symbols-outlined">two_wheeler</span> En camino al cliente
                                    </button>
                                }
                                @case ('en_camino') {
                                    <button class="flex-1 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20" (click)="marcarEntregado(p.id)">
                                        <span class="material-symbols-outlined">check_circle</span> Entregado
                                    </button>
                                }
                             }
                        </div>
                    </div>
                </div>
            } @else {
                <div class="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">inbox</span>
                    <p class="text-slate-500 font-medium">No tienes pedidos activos en curso</p>
                </div>
            }
        }

        @if (tab() === 'historial') {
            <h2 class="text-lg font-bold mb-4">Historial de Hoy</h2>
            
            @if (historial().length === 0) {
                <div class="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">history</span>
                    <p class="text-slate-500 font-medium">Aún no has completado entregas hoy</p>
                </div>
            }
            
            <div class="space-y-3">
            @for (h of historial(); track h.id) {
                <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span class="material-symbols-outlined text-[20px]">check</span>
                        </div>
                        <div>
                            <p class="font-bold text-sm">{{ h.nombreLocal }}</p>
                            <p class="text-xs text-slate-500">{{ h.creadoEn | date:'shortTime' }} • #{{ h.id.split('-').pop()?.substring(0,4) | uppercase }}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-primary">+\${{ (TARIFA_ENVIO * PORCENTAJE_MOTORIZADO).toFixed(2) }}</p>
                        <p class="text-xs text-slate-400">Completado</p>
                    </div>
                </div>
            }
            </div>
        }

      </main>

      <!-- Bottom Nav -->
      <nav class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 pb-6 pt-3 fixed bottom-0 left-0 right-0 z-50">
        <div class="flex items-center justify-around max-w-lg mx-auto">
          <button class="flex flex-col items-center gap-1 text-slate-400" (click)="router.navigate(['/home'])">
            <span class="material-symbols-outlined">home</span>
            <span class="text-[10px] font-bold uppercase tracking-wider">Inicio</span>
          </button>
          <button class="flex flex-col items-center gap-1 text-slate-400" (click)="router.navigate(['/pedidos'])">
            <span class="material-symbols-outlined">receipt_long</span>
            <span class="text-[10px] font-bold uppercase tracking-wider">Tus Pedidos</span>
          </button>
          <div class="relative -top-8">
            <button class="bg-primary size-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/40 border-4 border-background-light dark:border-background-dark">
              <span class="material-symbols-outlined text-3xl">two_wheeler</span>
            </button>
            <span class="absolute -bottom-5 w-full text-center text-[10px] font-bold uppercase tracking-wider text-primary left-0">Moto</span>
          </div>
          <button class="flex flex-col items-center gap-1 text-slate-400 hidden">
            <span class="material-symbols-outlined">payments</span>
            <span class="text-[10px] font-bold uppercase tracking-wider">Ganancias</span>
          </button>
          <button class="flex flex-col items-center gap-1 text-slate-400" (click)="router.navigate(['/perfil'])">
            <span class="material-symbols-outlined">person</span>
            <span class="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  `,
  styles: [`
    .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
    .active-tab {
        border-bottom: 3px solid #22c55e;
        color: #22c55e;
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 300ms ease-out both;
    }
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
  
  // Tab state
  tab = signal<'cerca' | 'programados' | 'historial'>('cerca');

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
      this.tab.set('programados'); // Switch to active orders tab
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
    this.tab.set('historial');
  }

  abrirChat(pedidoId: string) {
    this.router.navigate(['/chat', pedidoId]);
  }

  abrirMapa(coords: { lat: number; lng: number }) {
    const url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    window.open(url, '_blank');
  }

  irASeguimiento(pedidoId: string) {
    this.router.navigate(['/seguimiento-moto', pedidoId]);
  }
}
