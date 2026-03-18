import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidosService } from '../../../core/services/data.service';
import { ESTADOS_PEDIDO } from '../../../core/models/interfaces';

@Component({
    selector: 'app-pedidos',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-[100dvh] flex flex-col font-display">
      <!-- Header -->
      <header class="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div class="flex items-center gap-3 max-w-2xl mx-auto">
          <button class="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" (click)="volver()">
            <span class="material-symbols-outlined text-slate-700 dark:text-slate-200">arrow_back</span>
          </button>
          <h2 class="text-base font-bold">Mis Pedidos</h2>
        </div>
      </header>

      <main class="flex-1 max-w-2xl mx-auto w-full p-4 pb-24 flex flex-col gap-4">
        @if (pedidosService.pedidos().length === 0) {
          <div class="flex flex-col items-center justify-center h-[50vh] text-center px-4">
            <div class="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-4xl text-slate-300">receipt_long</span>
            </div>
            <h3 class="text-lg font-bold mb-2">Sin pedidos aún</h3>
            <p class="text-slate-500 text-sm mb-6">Tus pedidos recientes aparecerán aquí</p>
            <button class="bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all active:scale-95" (click)="volver()">
              Explorar Locales
            </button>
          </div>
        }

        @for (pedido of pedidosService.pedidos(); track pedido.id; let i = $index) {
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer animate-fade-in-up hover:shadow-md transition-all active:scale-[0.98]" 
               [style.animation-delay]="(i * 60) + 'ms'" 
               (click)="verSeguimiento(pedido.id)">
            
            <div class="flex justify-between items-start mb-3">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" [ngClass]="getEstadoClasses(pedido.estado)">
                <span class="material-symbols-outlined text-[14px]">{{ getEstadoIconoRef(pedido.estado) }}</span>
                {{ getEstadoNombre(pedido.estado) }}
              </span>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ pedido.creadoEn | date:'dd/MM HH:mm' }}</span>
            </div>
            
            <div class="mb-3">
              <h4 class="font-bold text-base text-slate-900 dark:text-slate-100">{{ pedido.nombreLocal || 'Local' }}</h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ pedido.productos.length }} producto(s) • #{{ pedido.id.split('-').pop()?.substring(0,6) | uppercase }}</p>
            </div>
            
            <div class="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <span class="text-lg font-extrabold text-primary">\${{ pedido.total.toFixed(2) }}</span>
              <div class="flex items-center text-primary text-sm font-bold gap-1">
                <span>Ver detalles</span>
                <span class="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            </div>
          </div>
        }
      </main>

      <!-- Bottom Navigation Bar -->
      <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div class="flex justify-around items-center h-16 max-w-2xl mx-auto px-4">
          <button class="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" (click)="volver()">
            <span class="material-symbols-outlined">home</span>
            <span class="text-[10px] font-medium">Inicio</span>
          </button>
          
          <button class="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <span class="material-symbols-outlined">search</span>
            <span class="text-[10px] font-medium">Buscar</span>
          </button>
          
          <button class="flex flex-col items-center gap-1 text-primary">
            <span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>receipt_long</span>
            <span class="text-[10px] font-bold">Pedidos</span>
          </button>
          
          <button class="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" (click)="irAPerfil()">
            <span class="material-symbols-outlined">person</span>
            <span class="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  `,
    styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 400ms ease-out both;
    }
    .pb-safe {
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
  `],
})
export class PedidosComponent {
    pedidosService = inject(PedidosService);
    router = inject(Router);

    volver() { this.router.navigate(['/home']); }
    irAPerfil() { this.router.navigate(['/perfil']); }

    getEstadoNombre(estado: string): string {
        return ESTADOS_PEDIDO.find(e => e.id === estado)?.nombre || estado;
    }
    
    getEstadoIconoRef(estado: string): string {
      switch(estado) {
        case 'recibido': return 'inventory_2';
        case 'transferido': return 'payments';
        case 'asignado': return 'person_check';
        case 'comprando': return 'shopping_cart';
        case 'en_camino': return 'two_wheeler';
        case 'entregado': return 'check_circle';
        case 'cancelado': return 'cancel';
        default: return 'receipt';
      }
    }

    getEstadoClasses(estado: string): string {
      switch(estado) {
        case 'recibido': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
        case 'transferido': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
        case 'asignado': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
        case 'comprando': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        case 'en_camino': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        case 'entregado': return 'bg-primary/10 text-primary bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'cancelado': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      }
    }

    verSeguimiento(id: string) {
        this.router.navigate(['/seguimiento', id]);
    }
}
