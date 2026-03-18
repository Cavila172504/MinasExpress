import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    AuthService,
    LocalesService,
    CarritoService,
} from '../../../core/services/data.service';
import { CategoriaLocal, CATEGORIAS_LOCAL, Local } from '../../../core/models/interfaces';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-[100dvh] flex flex-col font-display">
      <!-- Header / Navbar -->
      <header class="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div class="flex items-center justify-between gap-3 max-w-2xl mx-auto">
          <div class="flex items-center gap-2 overflow-hidden">
            <div class="text-primary shrink-0">
              <span class="material-symbols-outlined text-3xl">location_on</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Entregar en</span>
              <h2 class="text-sm font-bold truncate">San José de Minas, Centro</h2>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 relative">
              <span class="material-symbols-outlined">notifications</span>
            </button>
            <button class="p-2 rounded-full bg-primary/10 text-primary" (click)="irAPerfil()">
              <span class="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="mt-3 max-w-2xl mx-auto">
          <label class="relative flex items-center w-full">
            <span class="material-symbols-outlined absolute left-4 text-slate-400">search</span>
            <input type="text" 
                   [(ngModel)]="searchQuery" 
                   (input)="buscar()" 
                   class="w-full h-12 pl-12 pr-4 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-base" 
                   placeholder="¿Qué se te antoja hoy?" />
          </label>
        </div>
      </header>

      <main class="flex-1 max-w-2xl mx-auto w-full pb-24">
        <!-- Categories Grid -->
        <section class="px-4 py-4">
          <h3 class="text-lg font-bold mb-4">Categorías</h3>
          <div class="grid grid-cols-4 gap-4">
            
            <button (click)="filtrarCategoria('restaurante')" 
               [class.ring-2]="categoriaActiva() === 'restaurante'"
               [class.ring-primary]="categoriaActiva() === 'restaurante'"
               class="flex flex-col items-center gap-2 group outline-none rounded-2xl">
              <div class="w-full aspect-square bg-primary/10 rounded-2xl flex items-center justify-center group-active:scale-95 transition-transform">
                <span class="material-symbols-outlined text-primary text-3xl">restaurant</span>
              </div>
              <span class="text-xs font-medium text-center">Restaurantes</span>
            </button>
            
            <button (click)="filtrarCategoria('farmacia')"
               [class.ring-2]="categoriaActiva() === 'farmacia'"
               [class.ring-blue-500]="categoriaActiva() === 'farmacia'"
               class="flex flex-col items-center gap-2 group outline-none rounded-2xl">
              <div class="w-full aspect-square bg-blue-500/10 rounded-2xl flex items-center justify-center group-active:scale-95 transition-transform">
                <span class="material-symbols-outlined text-blue-600 text-3xl">medical_services</span>
              </div>
              <span class="text-xs font-medium text-center">Farmacia</span>
            </button>
            
            <button (click)="filtrarCategoria('tienda')"
               [class.ring-2]="categoriaActiva() === 'tienda'"
               [class.ring-green-500]="categoriaActiva() === 'tienda'"
               class="flex flex-col items-center gap-2 group outline-none rounded-2xl">
              <div class="w-full aspect-square bg-green-500/10 rounded-2xl flex items-center justify-center group-active:scale-95 transition-transform">
                <span class="material-symbols-outlined text-green-600 text-3xl">shopping_basket</span>
              </div>
              <span class="text-xs font-medium text-center">Tiendas</span>
            </button>
            
            <button (click)="filtrarCategoria('todos')"
               [class.ring-2]="categoriaActiva() === 'todos'"
               [class.ring-slate-500]="categoriaActiva() === 'todos'"
               class="flex flex-col items-center gap-2 group outline-none rounded-2xl">
              <div class="w-full aspect-square bg-slate-500/10 rounded-2xl flex items-center justify-center group-active:scale-95 transition-transform">
                <span class="material-symbols-outlined text-slate-600 text-3xl">apps</span>
              </div>
              <span class="text-xs font-medium text-center">Todos</span>
            </button>
            
          </div>
        </section>

        <!-- Featured Shops -->
        <section class="px-4 py-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold">Locales Disponibles</h3>
            <span class="text-primary text-sm font-bold">{{ localesFiltrados().length }} locales</span>
          </div>
          
          @if (localesFiltrados().length === 0) {
            <div class="text-center py-8 text-slate-500">
              <span class="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p>No encontramos locales con ese filtro o búsqueda.</p>
            </div>
          }

          <div class="space-y-6">
            @for (local of localesFiltrados(); track local.id; let i = $index) {
              <div class="group cursor-pointer animate-fade-in-up" 
                   [style.animation-delay]="(i * 60) + 'ms'" 
                   (click)="verLocal(local)">
                <div class="relative w-full h-48 rounded-2xl overflow-hidden">
                  <img [src]="local.fotoUrl" [alt]="local.nombre" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div class="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <span class="material-symbols-outlined text-yellow-500 text-sm">star</span>
                    <span class="text-xs font-bold">{{ local.calificacion }}</span>
                  </div>
                  
                  @if (i < 2) {
                    <div class="absolute bottom-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                      Popular
                    </div>
                  }
                </div>
                
                <div class="mt-3 flex justify-between items-start">
                  <div>
                    <h4 class="font-bold text-base">{{ local.nombre }}</h4>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ getCategoryName(local.categoria) }} • {{ local.horario }}
                    </p>
                  </div>
                  <button class="p-1 rounded-full text-slate-400 hover:text-accent-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" (click)="$event.stopPropagation()">
                    <span class="material-symbols-outlined">favorite</span>
                  </button>
                </div>
              </div>
            }
          </div>
        </section>
      </main>

      <!-- Bottom Navigation Bar -->
      <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 pb-safe shadow-2xl">
        <div class="flex justify-around items-center h-16 max-w-2xl mx-auto px-4">
          <button class="flex flex-col items-center gap-1 text-primary">
            <span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>home</span>
            <span class="text-[10px] font-bold">Inicio</span>
          </button>
          
          <button class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">
            <span class="material-symbols-outlined">search</span>
            <span class="text-[10px] font-medium">Buscar</span>
          </button>
          
          <button class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors" (click)="irAPedidos()">
            <span class="material-symbols-outlined">receipt_long</span>
            <span class="text-[10px] font-medium">Pedidos</span>
          </button>
          
          <button class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors" (click)="irAPerfil()">
            <span class="material-symbols-outlined">person</span>
            <span class="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </nav>

      <!-- Floating Action Button for Cart -->
      @if (carrito.cantidadTotal() > 0) {
        <button class="fixed bottom-20 right-4 z-40 bg-primary text-white p-4 rounded-full shadow-lg shadow-green-500/40 flex items-center gap-2" 
                (click)="irAlCarrito()">
          <span class="material-symbols-outlined">shopping_cart</span>
          <span class="text-sm font-bold">{{ carrito.cantidadTotal() }} items • \${{ carrito.total().toFixed(2) }}</span>
        </button>
      }
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
    `]
})
export class HomeComponent {
    private localesService = inject(LocalesService);
    carrito = inject(CarritoService);
    private router = inject(Router);

    categorias = CATEGORIAS_LOCAL;
    categoriaActiva = signal<string>('todos');
    searchQuery = '';
    searchResults = signal<Local[] | null>(null);

    localesFiltrados = computed(() => {
        if (this.searchResults()) return this.searchResults()!;
        const cat = this.categoriaActiva();
        return this.localesService.getLocalesByCategoria(cat);
    });

    filtrarCategoria(cat: string) {
        this.categoriaActiva.set(cat);
        this.searchResults.set(null);
        this.searchQuery = '';
    }

    buscar() {
        if (this.searchQuery.trim()) {
            this.searchResults.set(this.localesService.buscarLocales(this.searchQuery));
        } else {
            this.searchResults.set(null);
        }
    }

    getCategoryName(cat: string): string {
        return CATEGORIAS_LOCAL.find(c => c.id === cat)?.nombre || 'Otro';
    }

    verLocal(local: Local) { this.router.navigate(['/local', local.id]); }
    irAlCarrito() { this.router.navigate(['/carrito']); }
    irAPedidos() { this.router.navigate(['/pedidos']); }
    irAMoto() { this.router.navigate(['/motorizado']); }
    irAPerfil() { this.router.navigate(['/perfil']); }
}

