import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidosService, MotorizadoService } from '../../../core/services/data.service';
import { TARIFA_ENVIO, PORCENTAJE_MOTORIZADO } from '../../../core/models/interfaces';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
<!-- Sidebar Navigation -->
<div class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen relative flex w-full">
<aside class="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark hidden lg:flex flex-col fixed h-full">
<div class="p-6 flex items-center gap-3">
<div class="bg-primary text-white p-2 rounded-lg">
<span class="material-symbols-outlined">rocket_launch</span>
</div>
<h1 class="text-xl font-bold tracking-tight">MinasExpress</h1>
</div>
<nav class="flex-1 px-4 space-y-2 mt-4">
<a class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold" href="#">
<span class="material-symbols-outlined">dashboard</span>
                    Dashboard
                </a>
<a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<span class="material-symbols-outlined">shopping_cart</span>
                    Pedidos Activos
                </a>
<a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<span class="material-symbols-outlined">delivery_dining</span>
                    Repartidores
                </a>
<a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<span class="material-symbols-outlined">analytics</span>
                    Estadísticas
                </a>
<div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
<a class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<span class="material-symbols-outlined">settings</span>
                        Configuración
                    </a>
</div>
</nav>
<div class="p-4 border-t border-slate-200 dark:border-slate-800">
<div class="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" (click)="salir()">
<div class="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
<div class="flex-1 min-w-0">
<p class="text-sm font-semibold truncate">Juan Delgado</p>
<p class="text-xs text-slate-500 truncate">Admin Principal</p>
</div>
<span class="material-symbols-outlined text-slate-400 text-sm">logout</span>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 lg:ml-64 flex flex-col min-h-screen">
<!-- Top Navbar -->
<header class="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark sticky top-0 z-10 px-4 sm:px-8 flex items-center justify-between">
    <div class="flex lg:hidden items-center gap-3 text-primary mr-4 cursor-pointer" (click)="salir()">
        <span class="material-symbols-outlined">menu</span>
    </div>
<div class="flex items-center gap-4 flex-1">
<div class="relative max-w-md w-full">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
<input class="w-full pl-10 pr-4 py-2 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all" placeholder="Buscar pedido, cliente..." type="text"/>
</div>
</div>
<div class="flex items-center gap-3">
<button class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 relative">
<span class="material-symbols-outlined">notifications</span>
<span class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
</button>
<button class="p-2 hidden sm:block rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
<span class="material-symbols-outlined">help</span>
</button>
</div>
</header>
<!-- Dashboard Content -->
<div class="p-4 sm:p-8">
<div class="mb-8">
<h2 class="text-2xl font-bold text-slate-900 dark:text-white">Panel de Control</h2>
<p class="text-slate-500 dark:text-slate-400">Resumen operativo de MinasExpress para hoy</p>
</div>
<!-- Stats Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
<div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
<div class="flex justify-between items-start mb-4">
<div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
<span class="material-symbols-outlined">payments</span>
</div>
<span class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+12.5%</span>
</div>
<p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Ventas Totales</p>
<h3 class="text-2xl font-bold mt-1">$1,240.50</h3>
</div>
<div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in" style="animation-delay: 50ms;">
<div class="flex justify-between items-start mb-4">
<div class="p-2 bg-primary/10 text-primary rounded-lg">
<span class="material-symbols-outlined">inventory_2</span>
</div>
<span class="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-full">En curso</span>
</div>
<p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Pedidos Activos</p>
<h3 class="text-2xl font-bold mt-1">42</h3>
</div>
<div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in" style="animation-delay: 100ms;">
<div class="flex justify-between items-start mb-4">
<div class="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
<span class="material-symbols-outlined">account_balance_wallet</span>
</div>
<span class="text-xs font-bold text-slate-500">Admin Fee</span>
</div>
<p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Comisión Admin ($0.60/env)</p>
<h3 class="text-2xl font-bold mt-1">$25.20</h3>
</div>
<div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in" style="animation-delay: 150ms;">
<div class="flex justify-between items-start mb-4">
<div class="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
<span class="material-symbols-outlined">motorcycle</span>
</div>
<span class="text-xs font-bold text-slate-500">Motorizados</span>
</div>
<p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Pago a Riders ($0.90/env)</p>
<h3 class="text-2xl font-bold mt-1">$37.80</h3>
</div>
</div>
<!-- Active Orders Table -->
<div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in" style="animation-delay: 200ms;">
<div class="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
<h3 class="font-bold text-lg">Pedidos en Tiempo Real</h3>
<div class="flex gap-2 w-full sm:w-auto">
<button class="flex-1 sm:flex-none text-sm font-semibold px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Exportar CSV</button>
<button class="flex-1 sm:flex-none text-sm font-semibold px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">Nuevo Pedido</button>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse min-w-[800px]">
<thead>
<tr class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
<th class="px-6 py-4 font-bold">ID Pedido</th>
<th class="px-6 py-4 font-bold">Cliente</th>
<th class="px-6 py-4 font-bold">Local</th>
<th class="px-6 py-4 font-bold text-center">Cant.</th>
<th class="px-6 py-4 font-bold">Total</th>
<th class="px-6 py-4 font-bold bg-primary/5 dark:bg-primary/10 text-primary border-x border-primary/10 text-center">Reparto Envío (Admin/Moto)</th>
<th class="px-6 py-4 font-bold">Estado</th>
</tr>
</thead>
<tbody class="divide-y divide-slate-100 dark:divide-slate-800">
@for (p of activeOrders(); track p.id) {
<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" (click)="verDetalle(p.id)">
<td class="px-3 sm:px-6 py-4 font-mono text-sm max-w-[100px] truncate">#{{ p.id.split('-').pop()?.substring(0,4) | uppercase }}</td>
<td class="px-3 sm:px-6 py-4 max-w-[150px]">
<p class="font-semibold text-sm truncate">Cliente Anónimo</p>
<p class="text-xs text-slate-500 truncate">{{ p.direccionEntrega }}</p>
</td>
<td class="px-3 sm:px-6 py-4 max-w-[150px]">
<span class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 truncate max-w-full">{{ p.nombreLocal }}</span>
</td>
<td class="px-3 sm:px-6 py-4 text-center text-sm">{{ p.productos.length }}</td>
<td class="px-3 sm:px-6 py-4 font-bold text-sm">\${{ p.total.toFixed(2) }}</td>
<td class="px-3 sm:px-6 py-4 text-center border-x border-slate-100 dark:border-slate-800 min-w-[120px]">
<div class="flex items-center justify-center gap-2">
<span class="text-xs font-bold text-primary">\${{ tarifaAdmin().toFixed(2) }}</span>
<span class="text-slate-300">|</span>
<span class="text-xs font-bold text-slate-600 dark:text-slate-300">\${{ tarifaMoto().toFixed(2) }}</span>
</div>
</td>
<td class="px-3 sm:px-6 py-4 min-w-[120px]">
@if (p.estado === 'recibido') {
<span class="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full whitespace-nowrap">
<span class="size-1.5 rounded-full bg-slate-400"></span>Pendiente
</span>
} @else if (p.estado === 'asignado') {
<span class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full whitespace-nowrap">
<span class="size-1.5 rounded-full bg-emerald-600"></span>Asignado
</span>
} @else if (p.estado === 'comprando') {
<span class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full whitespace-nowrap">
<span class="size-1.5 rounded-full bg-blue-600"></span>Comprando
</span>
} @else if (p.estado === 'en_camino') {
<span class="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full whitespace-nowrap">
<span class="size-1.5 rounded-full bg-amber-600 animate-pulse"></span>En camino
</span>
}
</td>
</tr>
}
@if (activeOrders().length === 0) {
    <tr><td colspan="7" class="text-center py-8 text-slate-500">No hay pedidos activos en este momento.</td></tr>
}
</tbody>
</table>
</div>
<div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
<p class="text-xs text-slate-500 font-medium tracking-wide">MOSTRANDO {{ activeOrders().length }} PEDIDOS ACTIVOS</p>
<div class="flex gap-1">
<button class="p-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-700 transition-colors">
<span class="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button class="p-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-700 transition-colors">
<span class="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- Footer Summary info -->
<div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8 animate-fade-in" style="animation-delay: 300ms;">
<div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
<h4 class="font-bold mb-4">Rendimiento Semanal</h4>
<div class="h-48 w-full flex items-end justify-between gap-2 px-2">
<div class="flex-1 bg-primary/20 rounded-t-lg h-[60%] hover:bg-primary transition-colors cursor-pointer group relative">
<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$850</div>
</div>
<div class="flex-1 bg-primary/20 rounded-t-lg h-[40%] hover:bg-primary transition-colors cursor-pointer group relative">
<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$520</div>
</div>
<div class="flex-1 bg-primary/20 rounded-t-lg h-[85%] hover:bg-primary transition-colors cursor-pointer group relative">
<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$1100</div>
</div>
<div class="flex-1 bg-primary/20 rounded-t-lg h-[70%] hover:bg-primary transition-colors cursor-pointer group relative">
<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$920</div>
</div>
<div class="flex-1 bg-primary/20 rounded-t-lg h-[95%] hover:bg-primary transition-colors cursor-pointer group relative">
<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$1350</div>
</div>
<div class="flex-1 bg-primary/20 rounded-t-lg h-[50%] hover:bg-primary transition-colors cursor-pointer group relative">
<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$680</div>
</div>
<div class="flex-1 bg-primary/40 rounded-t-lg h-[25%] hover:bg-primary transition-colors cursor-pointer group relative">
<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$310</div>
</div>
</div>
<div class="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
<span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span><span>Dom</span>
</div>
</div>
<div class="bg-primary rounded-2xl p-8 text-white relative overflow-hidden shadow-lg shadow-primary/20">
<div class="relative z-10">
<h4 class="text-xl font-bold mb-2">Sistema de Reparto MinasExpress</h4>
<p class="text-white/80 mb-6 max-w-sm text-sm">Distribución automática de costos de envío calculada por transacción.</p>
<div class="space-y-4">
<div class="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
<div class="size-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-xl">$0.60</div>
<div>
<p class="font-bold">Administración</p>
<p class="text-xs text-white/60">Tarifa fija de gestión por cada envío realizado.</p>
</div>
</div>
<div class="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
<div class="size-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-xl">$0.90</div>
<div>
<p class="font-bold">Pago a Motorizado</p>
<p class="text-xs text-white/60">Compensación directa al repartidor por servicio.</p>
</div>
</div>
</div>
</div>
<!-- Abstract Design Elements -->
<div class="absolute -right-12 -bottom-12 size-64 bg-white/10 rounded-full"></div>
<div class="absolute right-10 top-10 size-24 border-4 border-white/5 rounded-full"></div>
</div>
</div>
</div>
</main>
</div>
  `,
  styles: [
    `
      .font-display {
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        animation: fadeIn 400ms ease-out both;
      }
    `,
  ],
})
export class AdminComponent {
  private router = inject(Router);
  private pedidosService = inject(PedidosService);
  private motorizadoService = inject(MotorizadoService);

  readonly tarifaAdmin = computed(
    () => TARIFA_ENVIO * (1 - PORCENTAJE_MOTORIZADO)
  );
  readonly tarifaMoto = computed(() => TARIFA_ENVIO * PORCENTAJE_MOTORIZADO);

  // Real active orders
  activeOrders = computed(() => {
    return this.pedidosService
      .pedidos()
      .filter((p) => p.estado !== 'entregado' && p.estado !== 'cancelado');
  });

  salir() {
    this.router.navigate(['/splash']);
  }

  verDetalle(id: string) {
    this.router.navigate(['/seguimiento', id]);
  }
}
