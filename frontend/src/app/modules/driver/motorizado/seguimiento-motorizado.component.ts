import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService } from '../../../core/services/data.service';
import { Pedido } from '../../../core/models/interfaces';

@Component({
  selector: 'app-seguimiento-motorizado',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex h-auto min-h-[100dvh] w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display">
      
      <!-- Top Navigation Bar -->
      <div class="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div class="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full" (click)="irAtras()">
          <span class="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 class="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 ml-2">Pedido en Curso</h2>
        <div class="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
          <span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          @if (pedido(); as p) {
              <span class="text-primary text-xs font-bold uppercase tracking-wider">{{ p.estado.replace('_', ' ') }}</span>
          } @else {
              <span class="text-primary text-xs font-bold uppercase tracking-wider">Cargando</span>
          }
        </div>
      </div>

      @if (pedido(); as p) {
          <!-- Map Section -->
          <div class="px-4 py-4">
            <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
              <div class="w-full h-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center" data-alt="Mapa de Belo Horizonte" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhuN7hiExTApit3uSZJWvydZqA9sA2RKGv_klAP0xZCNbYs7_2xBk1LrLKGAh0MteOqIhZFzaZLGWU6KLGjSKjJboVaDnI5VlYUSioKHmpQVXXq30oHOx-uLu0HYxrq3A-TvA-epcaBnGHH8ypynIJD513g8Wn3ssyNSWjypGZrk4-q6Kj1jIbkXM_yHnNX0ep-qiBLEXimt2rT_WppbIqLvtVVl7qtx82709HQytGy-kZN4xOT3LzY76ugHqJJAPf0pzJh4VPn-Q0');">
              </div>
              
              <!-- Overlay Route Info -->
              <div class="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-3 rounded-lg shadow-lg flex justify-between items-center border border-slate-100 dark:border-slate-700">
                <div class="flex items-center gap-3">
                  <div class="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
                    <span class="material-symbols-outlined text-sm">navigation</span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Tiempo estimado</p>
                    <p class="text-sm font-bold text-slate-900 dark:text-slate-100">8 min (2.4 km)</p>
                  </div>
                </div>
                <!-- Abrir en GPS button -->
                @if (p.ubicacionGps) {
                    <button class="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" (click)="abrirMapa(p.ubicacionGps)">
                      <span class="material-symbols-outlined">near_me</span>
                    </button>
                }
              </div>
            </div>
          </div>
          
          <!-- Delivery Details Section -->
          <div class="px-4 pb-2">
            <h3 class="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight py-2">Detalles de Entrega</h3>
            <div class="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in-up">
              <div class="flex items-center gap-4 w-full">
                <!-- Cliente Avatar (using a placeholder for now) -->
                <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 shrink-0 border-2 border-primary/20 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    <span class="material-symbols-outlined text-2xl">person</span>
                </div>
                <div class="flex flex-col justify-center flex-1">
                  <p class="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal">Cliente Anónimo</p>
                  <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-tight">{{ p.direccionEntrega }}</p>
                  @if (p.notas) {
                      <p class="text-primary text-xs font-semibold mt-1">Ref: {{ p.notas }}</p>
                  }
                </div>
                <div class="shrink-0 flex gap-2">
                  <div class="text-primary flex size-10 items-center justify-center bg-primary/10 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">
                    <span class="material-symbols-outlined">call</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Communication / Chat Card -->
          <div class="p-4">
            <div class="flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div class="flex items-center gap-3">
                <div class="bg-primary text-white p-2 rounded-lg">
                  <span class="material-symbols-outlined">chat_bubble</span>
                </div>
                <div class="flex flex-col">
                  <p class="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">Comunicación</p>
                  <p class="text-slate-500 dark:text-slate-400 text-sm font-normal">¿Necesitas contactar al cliente?</p>
                </div>
              </div>
              <button class="w-full flex cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-4 bg-primary text-white text-base font-bold shadow-md active:scale-95 transition-transform" (click)="abrirChat(p.id)">
                <span class="material-symbols-outlined">send</span>
                <span>Chatear con Usuario</span>
              </button>
            </div>
          </div>

          <!-- Order Items Summary  -->
          <div class="px-4 pb-28">
            <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{{ p.nombreLocal }}</span>
                <span class="text-slate-900 dark:text-slate-100 font-bold">\${{ p.total.toFixed(2) }}</span>
              </div>
              <div class="space-y-2">
                 @for (item of p.productos; track item.productoId) {
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-600 dark:text-slate-300 font-medium">{{ item.cantidad }}x {{ item.nombre }}</span>
                      <span class="text-slate-400">\${{ (item.precio * item.cantidad).toFixed(2) }}</span>
                    </div>
                 }
              </div>
            </div>
          </div>

          <!-- Footer Action Button -->
          <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50">
            @if (p.estado === 'en_camino') {
                <button class="w-full flex items-center justify-center gap-3 rounded-xl h-14 bg-primary hover:brightness-110 text-white text-lg font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all" (click)="marcarEntregado(p.id)">
                  <span class="material-symbols-outlined">check_circle</span>
                  <span>Marcar como Entregado</span>
                </button>
            } @else if (p.estado === 'comprando') {
                <button class="w-full flex items-center justify-center gap-3 rounded-xl h-14 bg-amber-500 hover:brightness-110 text-white text-lg font-bold shadow-lg shadow-amber-500/30 active:scale-95 transition-all" (click)="marcarEnCamino(p.id)">
                  <span class="material-symbols-outlined">two_wheeler</span>
                  <span>En camino al cliente</span>
                </button>
            }
          </div>
      }
    </div>
  `,
  styles: [`
    .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 300ms ease-out both;
    }
  `]
})
export class SeguimientoMotorizadoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pedidosService = inject(PedidosService);

  pedido = signal<Pedido | undefined>(undefined);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const p = this.pedidosService.getPedidoById(params['id']);
      if (p) {
        this.pedido.set(p);
      } else {
        // Fallback for testing/mock
        const pedidos = this.pedidosService.pedidos();
        if (pedidos.length > 0) this.pedido.set(pedidos[0]);
      }
    });
  }

  abrirMapa(coords: { lat: number; lng: number }) {
    const url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    window.open(url, '_blank');
  }

  abrirChat(pedidoId: string) {
    this.router.navigate(['/chat', pedidoId]);
  }

  marcarEnCamino(id: string) {
    this.pedidosService.cambiarEstado(id, 'en_camino');
    this.pedido.update(p => p ? { ...p, estado: 'en_camino' } : undefined);
  }

  marcarEntregado(id: string) {
    this.pedidosService.cambiarEstado(id, 'entregado');
    this.router.navigate(['/motorizado']); // Vuelve al panel al terminar
  }

  irAtras() {
    this.router.navigate(['/motorizado']);
  }
}
