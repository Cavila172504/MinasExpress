import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    AuthService,
    LocalesService,
    CarritoService,
} from '../../core/services/data.service';
import { CategoriaLocal, CATEGORIAS_LOCAL, Local } from '../../core/models/interfaces';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <!-- Header -->
    <header class="home-header">
      <div class="header-top">
        <div class="header-left">
          <div class="location-pin">📍</div>
          <div>
            <p class="location-label">Entregar en</p>
            <p class="location-text">San José de Minas</p>
          </div>
        </div>
        <button class="cart-btn" (click)="irAlCarrito()">
          🛒
          @if (carrito.cantidadTotal() > 0) {
            <span class="cart-badge">{{ carrito.cantidadTotal() }}</span>
          }
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          placeholder="¿Qué necesitas hoy?"
          [(ngModel)]="searchQuery"
          (input)="buscar()"
          class="search-input"
        />
      </div>
    </header>

    <!-- Content -->
    <main class="home-content">
      <!-- Hero Banner -->
      <div class="hero-banner">
        <div class="hero-text">
          <h2>Pedimos por ti 🛵</h2>
          <p>Tú eliges, nosotros compramos y entregamos</p>
        </div>
        <div class="hero-emoji">🏔️</div>
      </div>

      <!-- Categories -->
      <section class="categories-section">
        <h3 class="section-title">Categorías</h3>
        <div class="categories-grid">
          <button
            class="category-card"
            [class.active]="categoriaActiva() === 'todos'"
            (click)="filtrarCategoria('todos')"
          >
            <span class="cat-icon">🏠</span>
            <span class="cat-name">Todos</span>
          </button>
          @for (cat of categorias; track cat.id) {
            <button
              class="category-card"
              [class.active]="categoriaActiva() === cat.id"
              (click)="filtrarCategoria(cat.id)"
            >
              <span class="cat-icon">{{ cat.icono }}</span>
              <span class="cat-name">{{ cat.nombre }}</span>
            </button>
          }
        </div>
      </section>

      <!-- Locales -->
      <section class="locales-section">
        <h3 class="section-title">
          Locales disponibles
          <span class="count-badge">{{ localesFiltrados().length }}</span>
        </h3>

        @if (localesFiltrados().length === 0) {
          <div class="empty-state">
            <span class="empty-state-icon">🔍</span>
            <p class="empty-state-title">Sin resultados</p>
            <p class="empty-state-text">No encontramos locales con ese filtro</p>
          </div>
        }

        <div class="locales-grid">
          @for (local of localesFiltrados(); track local.id; let i = $index) {
            <div
              class="local-card animate-fade-in-up"
              [style.animation-delay]="(i * 60) + 'ms'"
              (click)="verLocal(local)"
            >
              <div class="local-img-wrapper">
                <img [src]="local.fotoUrl" [alt]="local.nombre" class="local-img" loading="lazy" />
                <span class="local-category-tag" [style.background]="getCategoryColor(local.categoria)">
                  {{ getCategoryIcon(local.categoria) }} {{ getCategoryName(local.categoria) }}
                </span>
              </div>
              <div class="local-info">
                <h4 class="local-name">{{ local.nombre }}</h4>
                <p class="local-address">📍 {{ local.direccion }}</p>
                <div class="local-meta">
                  <span class="local-rating">⭐ {{ local.calificacion }}</span>
                  <span class="local-hours">🕐 {{ local.horario }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </section>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <button class="nav-item active">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Inicio</span>
      </button>
      <button class="nav-item" (click)="irAPedidos()">
        <span class="nav-icon">📦</span>
        <span class="nav-label">Pedidos</span>
      </button>
      <button class="nav-item" (click)="irAMoto()">
        <span class="nav-icon">🛵</span>
        <span class="nav-label">Moto</span>
      </button>
      <button class="nav-item" (click)="irAPerfil()">
        <span class="nav-icon">👤</span>
        <span class="nav-label">Perfil</span>
      </button>
    </nav>
  `,
    styles: [`
    :host { display: block; background: var(--color-bg); min-height: 100vh; min-height: 100dvh; padding-bottom: 80px; }

    /* Header */
    .home-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--color-primary-gradient);
      padding: 16px 16px 20px;
      border-radius: 0 0 24px 24px;
      box-shadow: var(--shadow-md);
    }
    .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .location-pin { font-size: 1.4rem; }
    .location-label { font-size: 0.7rem; color: rgba(255,255,255,0.7); }
    .location-text { font-size: 0.9rem; font-weight: 600; color: white; }
    .cart-btn {
      position: relative;
      width: 44px; height: 44px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem;
      border: 1px solid rgba(255,255,255,0.2);
      transition: transform 0.2s;
    }
    .cart-btn:active { transform: scale(0.9); }
    .cart-badge {
      position: absolute; top: -4px; right: -4px;
      width: 22px; height: 22px;
      background: var(--color-danger);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid var(--color-primary);
      animation: bounceIn 400ms cubic-bezier(0.34,1.56,0.64,1);
    }

    /* Search */
    .search-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.95);
      border-radius: 14px;
      padding: 10px 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .search-icon { font-size: 1rem; opacity: 0.5; }
    .search-input {
      flex: 1; border: none; background: transparent; outline: none;
      font-size: 0.9rem; color: var(--color-text);
    }
    .search-input::placeholder { color: var(--color-text-light); }

    /* Content */
    .home-content { padding: 16px; }

    /* Hero */
    .hero-banner {
      background: linear-gradient(135deg, #2d5016 0%, #4a7c28 100%);
      border-radius: 20px;
      padding: 24px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      box-shadow: var(--shadow-glow);
      animation: fadeIn 600ms ease;
    }
    .hero-text h2 { font-size: 1.3rem; font-weight: 700; color: white; margin-bottom: 4px; }
    .hero-text p { font-size: 0.8rem; color: rgba(255,255,255,0.8); }
    .hero-emoji { font-size: 3rem; animation: pulse 3s ease infinite; }

    /* Categories */
    .section-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--color-text);
      margin-bottom: 12px;
      display: flex; align-items: center; gap: 8px;
    }
    .count-badge {
      background: var(--color-primary-bg);
      color: var(--color-primary);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 20px;
    }
    .categories-grid {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 8px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .categories-grid::-webkit-scrollbar { display: none; }
    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px 16px;
      background: white;
      border-radius: 16px;
      border: 2px solid var(--color-border);
      min-width: 72px;
      transition: all 0.25s;
    }
    .category-card.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      box-shadow: var(--shadow-glow);
    }
    .category-card.active .cat-name { color: white; }
    .cat-icon { font-size: 1.5rem; }
    .cat-name { font-size: 0.7rem; font-weight: 600; color: var(--color-text-secondary); white-space: nowrap; }
    .categories-section { margin-bottom: 24px; }

    /* Locales Grid */
    .locales-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .local-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .local-card:active { transform: scale(0.98); }
    .local-img-wrapper { position: relative; height: 160px; overflow: hidden; }
    .local-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .local-card:hover .local-img { transform: scale(1.05); }
    .local-category-tag {
      position: absolute; top: 12px; left: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 600;
      color: white;
      backdrop-filter: blur(4px);
    }
    .local-info { padding: 14px 16px; }
    .local-name { font-size: 1rem; font-weight: 700; color: var(--color-text); margin-bottom: 4px; }
    .local-address { font-size: 0.78rem; color: var(--color-text-light); margin-bottom: 8px; }
    .local-meta { display: flex; gap: 14px; font-size: 0.78rem; color: var(--color-text-secondary); }
    .local-rating { font-weight: 600; }

    /* Bottom Nav */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      background: white;
      padding: 8px 0 calc(8px + env(safe-area-inset-bottom, 0px));
      border-top: 1px solid var(--color-border-light);
      box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
      z-index: 200;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 16px;
      border-radius: 12px;
      transition: all 0.2s;
      background: transparent;
    }
    .nav-item.active { background: var(--color-primary-bg); }
    .nav-icon { font-size: 1.3rem; }
    .nav-label { font-size: 0.65rem; font-weight: 600; color: var(--color-text-light); }
    .nav-item.active .nav-label { color: var(--color-primary); font-weight: 700; }

    @keyframes bounceIn {
      0% { transform: scale(0); }
      70% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  `],
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

    getCategoryColor(cat: string): string {
        return CATEGORIAS_LOCAL.find(c => c.id === cat)?.color || '#6b7280';
    }
    getCategoryIcon(cat: string): string {
        return CATEGORIAS_LOCAL.find(c => c.id === cat)?.icono || '📦';
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
