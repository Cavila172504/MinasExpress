import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService, MotorizadoService } from '../../../core/services/data.service';
import { ESTADOS_PEDIDO, Pedido } from '../../../core/models/interfaces';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-[100dvh] flex flex-col font-display">
      <!-- Header -->
      <header class="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 sticky top-0 z-50">
        <button class="text-slate-900 dark:text-slate-100 p-2 hover:bg-primary/10 rounded-full transition-colors flex items-center justify-center" (click)="volver()">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="flex-1 text-center">
          <h1 class="text-lg font-bold leading-tight tracking-tight">Rastreio de Pedido</h1>
          @if (pedido(); as p) {
            <p class="text-xs font-semibold">Pedido #{{ p.id.split('-').pop()?.substring(0,6) | uppercase }}</p>
          }
        </div>
        <button class="text-slate-900 dark:text-slate-100 p-2 hover:bg-primary/10 rounded-full transition-colors flex items-center justify-center">
          <span class="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      @if (pedido(); as p) {
        <!-- Main Content Area (Map) -->
        <main class="flex-1 relative overflow-hidden bg-slate-200 dark:bg-slate-800">
          <!-- Leaflet Map Container -->
          <div id="tracking-map" class="absolute inset-0 z-0"></div>

          <!-- Decorative/Static Map Overlay (while map loads or if no GPS) -->
          @if (!mapInitialized()) {
            <div class="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" 
                 style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBHI_Gf1OggUnhgnShJos9o5W8fXC8_EJg3kd7IK9GtVJRiz4bltoaqxQ-pFK4U9bplO8ETLX4gtikOxdBC_E9biVpF4KJNxYa48UYdboka8bCmoMZnZ7OSZ3FL23S5MottF3WhWBgf0WBuSDPXlgY6OFLD_9NluOC24oi4543bYIaJXadnrqBcHogQCLNc3xCjcAXnrf25dDGAEudYMqg2oCU3VXy35PbQIweabCQnJrKpNY0yIpHAHydFV4-gRxS3tfNE4l7Oy9S3"); background-size: cover; background-position: center; opacity: 0.5;'>
            </div>
          }

          <!-- Float Status Info -->
          <div class="absolute top-4 left-4 right-4 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 dark:border-slate-800 flex items-center justify-between z-10 animate-fade-in-down">
            <div class="flex flex-col">
              <span class="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Tempo estimado</span>
              <span class="text-2xl font-bold leading-tight text-primary">12-15m</span>
            </div>
            <div class="h-10 w-px bg-slate-300 dark:bg-slate-700 mx-4"></div>
            <div class="flex-1">
              <span class="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Status</span>
              <div class="flex items-center gap-1.5">
                <span class="relative flex h-2.5 w-2.5">
                  @if (p.estado === 'comprando' || p.estado === 'en_camino') {
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  }
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5" [class.bg-primary]="p.estado !== 'entregado'" [class.bg-slate-400]="p.estado === 'entregado'"></span>
                </span>
                <span class="font-bold text-slate-900 dark:text-slate-100 truncate w-32">{{ getEstadoNombre(p.estado) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Demo Action Toolbar Overlay (Floating at bottom of map) -->
          <div class="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-10 flex flex-col gap-2">
             <p class="text-[10px] font-bold text-center text-slate-500 uppercase tracking-wider">Demo: Simular avanço</p>
             <div class="flex justify-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                @for (estado of estados; track estado.id) {
                    <button class="shrink-0 size-8 flex items-center justify-center rounded-full text-xs font-medium transition-all"
                            [class.bg-primary]="p.estado === estado.id"
                            [class.text-white]="p.estado === estado.id"
                            [class.shadow-md]="p.estado === estado.id"
                            [class.scale-110]="p.estado === estado.id"
                            [class.bg-slate-100]="p.estado !== estado.id"
                            [class.dark:bg-slate-800]="p.estado !== estado.id"
                            [class.text-slate-600]="p.estado !== estado.id"
                            [class.dark:text-slate-400]="p.estado !== estado.id"
                            (click)="cambiarEstado(estado.id)">
                        {{ estado.icono }}
                    </button>
                }
             </div>
          </div>

        </main>

        <!-- Bottom Tracking Panel -->
        <section class="bg-white dark:bg-background-dark rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)] border-t border-slate-200 dark:border-slate-800 px-6 pt-4 pb-2 relative z-20">
          <!-- Handlebar -->
          <div class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
          
          <!-- Driver Info -->
          @if (['asignado', 'comprando', 'en_camino', 'entregado'].includes(p.estado)) {
              <div class="flex items-center gap-4 mb-6">
                <div class="relative shrink-0">
                  <div class="size-14 rounded-full overflow-hidden border-2 border-primary bg-primary/20">
                    <img [src]="motoService.motorizado().fotoUrl" alt="Motorizado" class="w-full h-full object-cover">
                  </div>
                  <div class="absolute -bottom-1 -right-1 bg-primary size-4 rounded-full border-2 border-white dark:border-background-dark"></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100 truncate">{{ motoService.motorizado().nombre }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">Sua entrega 🛵 • <span class="font-mono font-bold">{{ motoService.motorizado().telefono }}</span></p>
                  <div class="flex items-center text-xs text-amber-500 mt-0.5">
                    <span class="material-symbols-outlined text-[14px] filled-icon">star</span>
                    <span class="ml-1 font-bold">4.9</span>
                    <span class="ml-1 text-slate-400">(entregador)</span>
                  </div>
                </div>
                
                <div class="flex gap-2.5 shrink-0">
                  <button class="w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-primary hover:bg-slate-200 transition-colors shadow-sm" (click)="abrirChat()">
                    <span class="material-symbols-outlined">chat</span>
                  </button>
                  <a [href]="'tel:' + motoService.motorizado().telefono" class="w-11 h-11 flex items-center justify-center rounded-full bg-primary text-white hover:brightness-110 transition-colors shadow-lg shadow-primary/30">
                    <span class="material-symbols-outlined">call</span>
                  </a>
                </div>
              </div>
          } @else {
              <div class="flex items-center justify-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div class="size-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center text-slate-400">
                      <span class="material-symbols-outlined">person_search</span>
                  </div>
                  <div class="flex-1">
                      <h3 class="font-bold text-slate-700 dark:text-slate-300 animate-pulse">Buscando entregador...</h3>
                      <p class="text-xs text-slate-500">Aguardando confirmação</p>
                  </div>
              </div>
          }

          <!-- Progress Steps (Simplified) -->
          <div class="relative pb-4">
            <div class="flex items-center justify-between mb-3 px-2">
              
              <!-- Step 1: Confirmed -->
              <div class="flex flex-col items-center relative z-10 transition-all duration-300">
                <div class="size-8 rounded-full flex items-center justify-center shadow-md transition-colors duration-300"
                     [class.bg-primary]="isStepDone('transferido') || p.estado === 'transferido'"
                     [class.text-white]="isStepDone('transferido') || p.estado === 'transferido'"
                     [class.bg-slate-200]="!isStepDone('transferido') && p.estado !== 'transferido'"
                     [class.dark:bg-slate-800]="!isStepDone('transferido') && p.estado !== 'transferido'"
                     [class.text-slate-400]="!isStepDone('transferido') && p.estado !== 'transferido'">
                  <span class="material-symbols-outlined text-base font-bold">check</span>
                </div>
              </div>
              
              <div class="h-1.5 flex-1 mx-[-2px] rounded-full transition-colors duration-500"
                   [class.bg-primary]="isStepDone('asignado') || p.estado === 'asignado' || isStepDone('comprando') || p.estado === 'comprando' || isStepDone('en_camino') || p.estado === 'en_camino'"
                   [class.bg-slate-200]="!(isStepDone('asignado') || p.estado === 'asignado' || isStepDone('comprando') || p.estado === 'comprando' || isStepDone('en_camino') || p.estado === 'en_camino')"
                   [class.dark:bg-slate-800]="!(isStepDone('asignado') || p.estado === 'asignado' || isStepDone('comprando') || p.estado === 'comprando' || isStepDone('en_camino') || p.estado === 'en_camino')"></div>
              
              <!-- Step 2: On the way / In progress -->
              <div class="flex flex-col items-center relative z-10 transition-all duration-300"
                   [class.scale-110]="['asignado', 'comprando', 'en_camino'].includes(p.estado)">
                <div class="rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                     [class.size-10]="['asignado', 'comprando', 'en_camino'].includes(p.estado)"
                     [class.size-8]="!(['asignado', 'comprando', 'en_camino'].includes(p.estado))"
                     [class.bg-primary]="isStepDone('transferido')"
                     [class.text-white]="isStepDone('transferido')"
                     [class.ring-4]="['asignado', 'comprando', 'en_camino'].includes(p.estado)"
                     [class.ring-primary/20]="['asignado', 'comprando', 'en_camino'].includes(p.estado)"
                     [class.bg-slate-200]="!isStepDone('transferido')"
                     [class.dark:bg-slate-800]="!isStepDone('transferido')"
                     [class.text-slate-400]="!isStepDone('transferido')">
                  <span class="material-symbols-outlined" [class.text-xl]="['asignado', 'comprando', 'en_camino'].includes(p.estado)" [class.text-base]="!(['asignado', 'comprando', 'en_camino'].includes(p.estado))">delivery_dining</span>
                </div>
              </div>
              
              <div class="h-1.5 flex-1 mx-[-2px] rounded-full transition-colors duration-500"
                   [class.bg-primary]="isStepDone('en_camino') || p.estado === 'entregado'"
                   [class.bg-slate-200]="!(isStepDone('en_camino') || p.estado === 'entregado')"
                   [class.dark:bg-slate-800]="!(isStepDone('en_camino') || p.estado === 'entregado')"></div>
              
              <!-- Step 3: Delivered -->
              <div class="flex flex-col items-center relative z-10 transition-all duration-300">
                <div class="size-8 rounded-full flex items-center justify-center transition-colors duration-300"
                     [class.bg-primary]="p.estado === 'entregado'"
                     [class.text-white]="p.estado === 'entregado'"
                     [class.shadow-md]="p.estado === 'entregado'"
                     [class.bg-slate-200]="p.estado !== 'entregado'"
                     [class.dark:bg-slate-800]="p.estado !== 'entregado'"
                     [class.text-slate-400]="p.estado !== 'entregado'">
                  <span class="material-symbols-outlined text-base">check_circle</span>
                </div>
              </div>
              
            </div>
            
            <div class="flex justify-between text-[10px] font-bold uppercase tracking-wide px-1">
              <span class="transition-colors duration-300" [class.text-primary]="isStepDone('transferido') || p.estado === 'transferido'" [class.text-slate-400]="!isStepDone('transferido') && p.estado !== 'transferido'">Confirmado</span>
              <span class="transition-colors duration-300" [class.text-primary]="['asignado', 'comprando', 'en_camino'].includes(p.estado)" [class.text-slate-400]="!(['asignado', 'comprando', 'en_camino'].includes(p.estado))">A caminho</span>
              <span class="transition-colors duration-300" [class.text-primary]="p.estado === 'entregado'" [class.text-slate-400]="p.estado !== 'entregado'">Entregue</span>
            </div>
          </div>
          
          <!-- Order details expander (optional, for demo) -->
          <details class="group mt-2 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
             <summary class="flex justify-between items-center p-3 text-sm font-bold cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                 Ver detalhes do pedido
                 <span class="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
             </summary>
             <div class="p-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                 <p class="font-bold mb-1 text-slate-800 dark:text-slate-200">{{ p.nombreLocal }}</p>
                 <ul class="space-y-1 mb-2">
                     @for (item of p.productos; track item.productoId) {
                         <li class="flex justify-between">
                             <span>{{ item.cantidad }}x {{ item.nombre }}</span>
                             <span class="font-medium text-slate-800 dark:text-slate-200">\${{ (item.precio * item.cantidad).toFixed(2) }}</span>
                         </li>
                     }
                 </ul>
                 <div class="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                 <div class="flex justify-between font-bold text-sm text-slate-900 dark:text-slate-100">
                     <span>Total Geral</span>
                     <span>\${{ p.total.toFixed(2) }}</span>
                 </div>
             </div>
          </details>
          
        </section>
      }
    </div>
  `,
  styles: [`
    .font-display { font-family: 'Public Sans', sans-serif; }
    .filled-icon { font-variation-settings: 'FILL' 1; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-down {
      animation: fadeInDown 400ms ease-out both;
    }
  `]
})
export class SeguimientoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pedidosService = inject(PedidosService);
  motoService = inject(MotorizadoService);

  pedido = signal<Pedido | undefined>(undefined);
  estados = ESTADOS_PEDIDO;
  
  // Dummy signal to bypass TS error in template if we want to add map logic later
  mapInitialized = signal(false);

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

  getEstadoNombre(estado: string): string {
    return this.estados.find(e => e.id === estado)?.nombre || 'Confirmando...';
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
