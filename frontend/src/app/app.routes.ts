import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'splash', pathMatch: 'full' },
    {
        path: 'splash',
        loadComponent: () =>
            import('./modules/customer/auth/splash.component').then((m) => m.SplashComponent),
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./modules/customer/auth/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./modules/customer/home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: 'local/:id',
        loadComponent: () =>
            import('./modules/customer/shop-profile/local-detail.component').then(
                (m) => m.LocalDetailComponent
            ),
    },
    {
        path: 'carrito',
        loadComponent: () =>
            import('./modules/customer/checkout/carrito.component').then(
                (m) => m.CarritoComponent
            ),
    },
    {
        path: 'pedidos',
        loadComponent: () =>
            import('./modules/customer/order-tracking/pedidos.component').then(
                (m) => m.PedidosComponent
            ),
    },
    {
        path: 'seguimiento/:id',
        loadComponent: () =>
            import('./modules/customer/order-tracking/seguimiento.component').then(
                (m) => m.SeguimientoComponent
            ),
    },
    {
        path: 'chat/:id',
        loadComponent: () =>
            import('./modules/customer/chat/chat.component').then((m) => m.ChatComponent),
    },
    {
        path: 'motorizado',
        loadComponent: () =>
            import('./modules/driver/motorizado/motorizado.component').then(
                (m) => m.MotorizadoComponent
            ),
    },
    {
        path: 'seguimiento-moto/:id',
        loadComponent: () =>
            import('./modules/driver/motorizado/seguimiento-motorizado.component').then(
                (m) => m.SeguimientoMotorizadoComponent
            ),
    },
    {
        path: 'perfil',
        loadComponent: () =>
            import('./modules/customer/profile/perfil.component').then(
                (m) => m.PerfilComponent
            ),
    },
    {
        path: 'admin',
        loadComponent: () =>
            import('./modules/admin/dashboard/admin.component').then(
                (m) => m.AdminComponent
            ),
    },
    { path: '**', redirectTo: 'splash' },
];
