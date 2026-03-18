import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/data.service';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-[100dvh] flex flex-col font-display pb-24">
      <!-- Header -->
      <header class="flex items-center gap-3 p-4 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors">
        <button class="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" (click)="router.navigate(['/home'])">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 class="text-lg font-bold">Mi Perfil</h2>
      </header>

      @if (auth.usuario(); as user) {
        <main class="flex-1 p-4 flex flex-col gap-4 max-w-2xl mx-auto w-full">
          <!-- Avatar Card -->
          <div class="flex flex-col items-center bg-gradient-to-b from-primary to-green-700 rounded-3xl p-8 shadow-lg shadow-primary/20 text-white w-full animate-fade-in-up">
            <img [src]="user.fotoUrl" [alt]="user.nombre" class="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-xl mb-4" />
            <h3 class="text-xl font-extrabold">{{ user.nombre }}</h3>
            <p class="text-sm font-medium text-white/80 mt-1 uppercase tracking-wide">{{ user.tipoUsuario === 'cliente' ? '👤 Cliente' : '🛵 Motorizado' }}</p>
          </div>

          <!-- Info Items -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 animate-fade-in-up" style="animation-delay: 100ms;">
            <div class="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-primary text-xl">call</span>
                <div>
                  <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Teléfono</p>
                  <p class="text-sm font-semibold">{{ user.telefono }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-primary text-xl">mail</span>
                <div>
                  <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Email</p>
                  <p class="text-sm font-semibold">{{ user.email }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-primary text-xl">pin_drop</span>
                <div>
                  <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Dirección principal</p>
                  <p class="text-sm font-semibold">{{ user.direccion }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 animate-fade-in-up" style="animation-delay: 200ms;">
             <!-- Items are the same, refactored with tailwind -->
            <button class="w-full flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" (click)="router.navigate(['/pedidos'])">
              <span class="material-symbols-outlined text-slate-400">inventory_2</span>
              <span class="flex-1 text-left text-sm font-bold">Historial de Pedidos</span>
              <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            </button>
            <button class="w-full flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" (click)="router.navigate(['/motorizado'])">
              <span class="material-symbols-outlined text-slate-400">two_wheeler</span>
              <span class="flex-1 text-left text-sm font-bold">Panel Motorizado</span>
              <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            </button>
             <button class="w-full flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <span class="material-symbols-outlined text-slate-400">star</span>
              <span class="flex-1 text-left text-sm font-bold">Calificar App</span>
              <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            </button>
             <button class="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <span class="material-symbols-outlined text-slate-400">support_agent</span>
              <span class="flex-1 text-left text-sm font-bold">Soporte Técnico</span>
              <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            </button>
          </div>

          <!-- Version Info -->
          <div class="text-center py-4 animate-fade-in-up" style="animation-delay: 300ms;">
            <p class="text-xs font-bold text-slate-400">🏔️ MinasExpress v1.0.0</p>
            <p class="text-[10px] text-slate-500 mt-1">Hecho con ❤️ en San José de Minas</p>
          </div>

          <!-- Logout Button -->
          <button class="mt-2 w-full flex items-center justify-center gap-2 h-14 bg-accent-red text-white py-3 rounded-xl font-bold shadow-lg shadow-accent-red/20 active:scale-95 transition-transform animate-fade-in-up" style="animation-delay: 400ms;" (click)="cerrarSesion()">
            <span class="material-symbols-outlined">logout</span>
            Cerrar Sesión
          </button>
        </main>
      }
      
      <!-- Bottom Navigation Bar -->
      <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div class="flex justify-around items-center h-16 max-w-2xl mx-auto px-4">
          <button class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors" (click)="router.navigate(['/home'])">
            <span class="material-symbols-outlined">home</span>
            <span class="text-[10px] font-medium">Inicio</span>
          </button>
          
          <button class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors" (click)="router.navigate(['/pedidos'])">
            <span class="material-symbols-outlined">inventory_2</span>
            <span class="text-[10px] font-medium">Pedidos</span>
          </button>
          
          <button class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors" (click)="router.navigate(['/motorizado'])">
            <span class="material-symbols-outlined">two_wheeler</span>
            <span class="text-[10px] font-medium">Moto</span>
          </button>
          
          <button class="flex flex-col items-center gap-1 text-primary">
            <span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'>person</span>
            <span class="text-[10px] font-bold">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  `,
    styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 400ms ease-out both;
    }
    `],
})
export class PerfilComponent {
    auth = inject(AuthService);
    router = inject(Router);

    cerrarSesion() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
