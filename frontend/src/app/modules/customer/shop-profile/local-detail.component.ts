import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalesService, ProductosService, CarritoService } from '../../../core/services/data.service';
import { Producto, Local } from '../../../core/models/interfaces';

@Component({
    selector: 'app-local-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (local(); as loc) {
    <div class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-[100dvh]">
      <!-- Top Navigation -->
      <header class="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div class="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
          <button class="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors" (click)="volver()">
            <span class="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
          </button>
          <div class="flex flex-col items-center">
            <img alt="MinasExpress Logo" class="h-6 mb-0.5 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhDI8IBNJQRFiQHDhDaLqURGNqQmvgYDL7W0O5MKX6uwVBAH9mgFivfT1Sl1LQrmow08rBfknqh04EdsZXMygrskJX8ct7AG10NH7GVZanGgIlFn3tbDl3w2Pv4EKjyXIf8FHzHHSlVkgooL_LHeFzj1BxxtDubqvAESkQLYOGo__nDNP8AKdlifFkriE76kVPUpMLwODHCgYL4ub5q_kYlZljf0W4vlDIdkLcfVb6rrqXhRz2y_A3Qm1rhnMoDAK6X-kHyYPNaIh-"/>
            <h2 class="text-sm font-bold leading-tight tracking-tight">{{ loc.nombre }}</h2>
          </div>
          <div class="flex gap-2">
            <button class="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
              <span class="material-symbols-outlined text-slate-900 dark:text-slate-100">share</span>
            </button>
            <button class="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
              <span class="material-symbols-outlined text-slate-900 dark:text-slate-100">search</span>
            </button>
          </div>
        </div>
      </header>
      
      <main class="max-w-2xl mx-auto pb-32">
        <!-- Shop Cover -->
        <div class="px-0 sm:px-4 py-0 sm:py-3">
          <div class="w-full h-48 sm:h-64 bg-center bg-cover sm:rounded-xl relative overflow-hidden shadow-lg" 
               [style.background-image]="'url(' + loc.fotoUrl + ')'">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </div>
        
        <!-- Shop Info Header -->
        <div class="flex p-4 flex-col gap-4">
          <div class="flex gap-4 items-center">
            <div class="bg-center bg-cover rounded-xl h-20 w-20 shadow-md border-2 border-white dark:border-background-dark" 
                 [style.background-image]="'url(' + loc.fotoUrl + ')'"></div>
            <div class="flex flex-col">
              <h1 class="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100">{{ loc.nombre }}</h1>
              <p class="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-1">
                <span class="material-symbols-outlined text-primary text-sm">restaurant</span> {{ loc.categoria }}
              </p>
              <div class="flex items-center gap-2 mt-1">
                <span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Abierto ahora</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-3 px-4 mb-6">
          <div class="flex flex-col items-center justify-center gap-1 rounded-xl p-3 bg-white dark:bg-white/5 border border-primary/10 shadow-sm">
            <span class="material-symbols-outlined text-primary">star</span>
            <p class="text-slate-900 dark:text-slate-100 text-sm font-bold">{{ loc.calificacion }} (50+)</p>
            <p class="text-slate-500 text-[10px] font-medium">Calificación</p>
          </div>
          <div class="flex flex-col items-center justify-center gap-1 rounded-xl p-3 bg-white dark:bg-white/5 border border-primary/10 shadow-sm">
            <span class="material-symbols-outlined text-primary">schedule</span>
            <p class="text-slate-900 dark:text-slate-100 text-sm font-bold">20-30 min</p>
            <p class="text-slate-500 text-[10px] font-medium">Entrega</p>
          </div>
          <div class="flex flex-col items-center justify-center gap-1 rounded-xl p-3 bg-white dark:bg-white/5 border border-primary/10 shadow-sm">
            <span class="material-symbols-outlined text-primary">payments</span>
            <p class="text-slate-900 dark:text-slate-100 text-sm font-bold">$1.50</p>
            <p class="text-slate-500 text-[10px] font-medium">Envío</p>
          </div>
        </div>
        
        <!-- Categories Tabs -->
        <div class="sticky top-[72px] z-40 bg-background-light dark:bg-background-dark border-b border-primary/10">
          <div class="flex px-4 gap-6 overflow-x-auto no-scrollbar">
            <a *ngFor="let cat of categorias()" 
               class="flex flex-col items-center justify-center pb-3 pt-4 shrink-0 cursor-pointer border-b-2"
               [class.border-primary]="categoriaActiva() === cat"
               [class.text-primary]="categoriaActiva() === cat"
               [class.border-transparent]="categoriaActiva() !== cat"
               [class.text-slate-500]="categoriaActiva() !== cat"
               (click)="categoriaActiva.set(cat)">
              <p class="text-sm font-bold tracking-tight">{{ cat }}</p>
            </a>
          </div>
        </div>
        
        <!-- Product List -->
        <div class="p-4 flex flex-col gap-4">
          <h3 class="text-lg font-bold mt-2">Los más pedidos</h3>
          
          <!-- Product Items -->
          @for (producto of productosFiltrados(); track producto.id) {
            <div class="flex gap-4 p-3 bg-white dark:bg-white/5 rounded-xl border border-primary/5 hover:border-primary/20 transition-all shadow-sm">
              <div class="bg-center bg-cover rounded-lg size-24 shrink-0" 
                   [style.background-image]="'url(' + producto.fotoUrl + ')'"></div>
              <div class="flex flex-col justify-between flex-1">
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-slate-100">{{ producto.nombre }}</h4>
                  <p class="text-slate-500 text-xs line-clamp-2 mt-1">{{ producto.descripcion }}</p>
                </div>
                <div class="flex justify-between items-end mt-2">
                  <span class="text-primary font-bold">\${{ producto.precio.toFixed(2) }}</span>
                  
                  <div class="flex items-center gap-2">
                    @if (getCantidad(producto) > 0) {
                      <button class="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 size-8 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform" 
                              (click)="decrementar(producto)">
                        <span class="material-symbols-outlined text-xl">remove</span>
                      </button>
                      <span class="font-bold text-sm min-w-[20px] text-center">{{ getCantidad(producto) }}</span>
                    }
                    <button class="bg-primary text-white size-8 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform" 
                            (click)="agregar(producto)">
                      <span class="material-symbols-outlined text-xl">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
          
          <!-- Custom Request Section -->
          <div class="mt-8 p-6 bg-green-500/5 rounded-2xl border-2 border-dashed border-green-500/30">
            <div class="flex items-center gap-3 mb-4">
              <span class="material-symbols-outlined text-primary text-3xl">edit_note</span>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-slate-100">¿No encuentras algo?</h4>
                <p class="text-slate-500 text-xs">Pide algo personalizado de este local.</p>
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <textarea class="w-full rounded-xl border-green-500/20 dark:bg-background-dark/50 focus:border-primary focus:ring-primary text-sm placeholder:text-slate-400" 
                        placeholder="Describe qué necesitas (ej: 2 pupusas de queso sin cebolla...)" rows="3"></textarea>
              <button class="w-full bg-green-500/10 hover:bg-green-500/20 text-primary font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-lg">add_circle</span>
                Añadir petición especial
              </button>
            </div>
          </div>
          
          <!-- Shop Description -->
          <div class="mt-4 px-2">
            <h4 class="font-bold text-slate-900 dark:text-slate-100 mb-2">Información del local</h4>
            <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Ubicados en el corazón de la ciudad, ofrecemos el auténtico sabor de casa. Todo preparado al momento.
            </p>
            <div class="mt-4 flex flex-col gap-2">
              <div class="flex items-center gap-3 text-slate-500 text-sm">
                <span class="material-symbols-outlined text-primary text-lg">location_on</span>
                <span>{{ loc.direccion }}</span>
              </div>
              <div class="flex items-center gap-3 text-slate-500 text-sm">
                <span class="material-symbols-outlined text-primary text-lg">call</span>
                <span>+503 2222-3333</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Floating Action Button (Cart) -->
      @if (carrito.cantidadTotal() > 0) {
        <div class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[42rem] z-50">
          <button class="w-full bg-primary text-white py-4 px-6 rounded-2xl shadow-xl flex items-center justify-between hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-95" 
                  (click)="irAlCarrito()">
            <div class="flex items-center gap-3">
              <div class="bg-white/20 px-2 py-1 rounded text-xs font-bold">{{ carrito.cantidadTotal() }}</div>
              <span class="font-bold tracking-tight uppercase text-sm">Ver Carrito</span>
            </div>
            <div>
              <span class="text-[10px] opacity-80 font-medium mr-2">Envío no incl.</span>
              <span class="font-extrabold text-lg">\${{ carrito.total().toFixed(2) }}</span>
            </div>
          </button>
        </div>
      }
    </div>
    }
  `,
    styles: [`
      .no-scrollbar::-webkit-scrollbar {
          display: none;
      }
      .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
      }
    `]
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
