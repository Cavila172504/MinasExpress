import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'splash', pathMatch: 'full' },
    {
        path: 'splash',
        loadComponent: () =>
            import('./features/auth/splash.component').then((m) => m.SplashComponent),
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./features/home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: 'local/:id',
        loadComponent: () =>
            import('./features/locales/local-detail.component').then(
                (m) => m.LocalDetailComponent
            ),
    },
    {
        path: 'carrito',
        loadComponent: () =>
            import('./features/carrito/carrito.component').then(
                (m) => m.CarritoComponent
            ),
    },
    {
        path: 'pedidos',
        loadComponent: () =>
            import('./features/pedidos/pedidos.component').then(
                (m) => m.PedidosComponent
            ),
    },
    {
        path: 'seguimiento/:id',
        loadComponent: () =>
            import('./features/pedidos/seguimiento.component').then(
                (m) => m.SeguimientoComponent
            ),
    },
    {
        path: 'chat/:id',
        loadComponent: () =>
            import('./features/chat/chat.component').then((m) => m.ChatComponent),
    },
    {
        path: 'motorizado',
        loadComponent: () =>
            import('./features/motorizado/motorizado.component').then(
                (m) => m.MotorizadoComponent
            ),
    },
    {
        path: 'perfil',
        loadComponent: () =>
            import('./features/perfil/perfil.component').then(
                (m) => m.PerfilComponent
            ),
    },
    { path: '**', redirectTo: 'splash' },
];
