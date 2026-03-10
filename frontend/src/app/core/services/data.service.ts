import { Injectable, signal, computed } from '@angular/core';
import {
    Usuario,
    Local,
    Producto,
    Pedido,
    Motorizado,
    Mensaje,
    ItemCarrito,
    EstadoPedido,
    TARIFA_ENVIO,
} from '../models/interfaces';

// ============================
// MOCK DATA
// ============================

const MOCK_LOCALES: Local[] = [
    {
        id: 'loc-1',
        nombre: 'Pollo Brostizado Don Pancho',
        categoria: 'comida',
        fotoUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop',
        direccion: 'Calle Bolívar y Sucre',
        telefono: '0991234567',
        horario: '8:00 - 20:00',
        calificacion: 4.5,
        activo: true,
        duenoId: 'user-1',
    },
    {
        id: 'loc-2',
        nombre: 'Farmacia San José',
        categoria: 'farmacia',
        fotoUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop',
        direccion: 'Parque Central',
        telefono: '0997654321',
        horario: '7:00 - 21:00',
        calificacion: 4.8,
        activo: true,
        duenoId: 'user-2',
    },
    {
        id: 'loc-3',
        nombre: 'Tienda La Esquina',
        categoria: 'tienda',
        fotoUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop',
        direccion: 'Av. Principal',
        telefono: '0993456789',
        horario: '6:00 - 22:00',
        calificacion: 4.2,
        activo: true,
        duenoId: 'user-3',
    },
    {
        id: 'loc-4',
        nombre: 'Restaurante Doña María',
        categoria: 'comida',
        fotoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
        direccion: 'Calle 10 de Agosto',
        telefono: '0998765432',
        horario: '7:00 - 16:00',
        calificacion: 4.7,
        activo: true,
        duenoId: 'user-4',
    },
    {
        id: 'loc-5',
        nombre: 'MiniMarket Express',
        categoria: 'tienda',
        fotoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=300&fit=crop',
        direccion: 'Barrio San Francisco',
        telefono: '0992345678',
        horario: '6:30 - 21:00',
        calificacion: 4.0,
        activo: true,
        duenoId: 'user-5',
    },
    {
        id: 'loc-6',
        nombre: 'Papelería Central',
        categoria: 'otro',
        fotoUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
        direccion: 'Junto al municipio',
        telefono: '0996543210',
        horario: '8:00 - 18:00',
        calificacion: 4.3,
        activo: true,
        duenoId: 'user-6',
    },
];

const MOCK_PRODUCTOS: Producto[] = [
    // Pollo Brostizado Don Pancho
    { id: 'prod-1', localId: 'loc-1', nombre: 'Pollo Brostizado 1/4', descripcion: 'Con papas fritas, ensalada y arroz', precio: 3.50, fotoUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=200&fit=crop', categoria: 'Platos Fuertes', disponible: true },
    { id: 'prod-2', localId: 'loc-1', nombre: 'Pollo Brostizado 1/2', descripcion: 'Media porción con papas y ensalada', precio: 6.00, fotoUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=200&fit=crop', categoria: 'Platos Fuertes', disponible: true },
    { id: 'prod-3', localId: 'loc-1', nombre: 'Hamburguesa Clásica', descripcion: 'Pan artesanal, carne, queso, lechuga, tomate', precio: 2.50, fotoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop', categoria: 'Hamburguesas', disponible: true },
    { id: 'prod-4', localId: 'loc-1', nombre: 'Salchipapa Grande', descripcion: 'Papas fritas con salchicha y salsas', precio: 2.00, fotoUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&h=200&fit=crop', categoria: 'Snacks', disponible: true },
    { id: 'prod-5', localId: 'loc-1', nombre: 'Gaseosa Personal', descripcion: 'Coca-Cola, Sprite o Fanta 500ml', precio: 0.75, fotoUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=200&fit=crop', categoria: 'Bebidas', disponible: true },

    // Farmacia San José
    { id: 'prod-6', localId: 'loc-2', nombre: 'Paracetamol 500mg', descripcion: 'Caja de 20 tabletas', precio: 1.50, fotoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop', categoria: 'Medicamentos', disponible: true },
    { id: 'prod-7', localId: 'loc-2', nombre: 'Ibuprofeno 400mg', descripcion: 'Caja de 10 tabletas', precio: 2.00, fotoUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=200&fit=crop', categoria: 'Medicamentos', disponible: true },
    { id: 'prod-8', localId: 'loc-2', nombre: 'Vitamina C 1000mg', descripcion: 'Tubo efervescente x10', precio: 3.50, fotoUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=200&fit=crop', categoria: 'Vitaminas', disponible: true },
    { id: 'prod-9', localId: 'loc-2', nombre: 'Alcohol Antiséptico', descripcion: '500ml', precio: 2.50, fotoUrl: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=300&h=200&fit=crop', categoria: 'Cuidado Personal', disponible: true },

    // Tienda La Esquina
    { id: 'prod-10', localId: 'loc-3', nombre: 'Arroz Conejo 1kg', descripcion: 'Arroz de primera calidad', precio: 1.20, fotoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop', categoria: 'Abarrotes', disponible: true },
    { id: 'prod-11', localId: 'loc-3', nombre: 'Aceite La Favorita 1L', descripcion: 'Aceite vegetal de girasol', precio: 2.80, fotoUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop', categoria: 'Abarrotes', disponible: true },
    { id: 'prod-12', localId: 'loc-3', nombre: 'Leche Vita 1L', descripcion: 'Leche entera', precio: 1.10, fotoUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop', categoria: 'Lácteos', disponible: true },
    { id: 'prod-13', localId: 'loc-3', nombre: 'Pan de Molde', descripcion: 'Bimbo 450g', precio: 1.80, fotoUrl: 'https://images.unsplash.com/photo-1549931319-a545753467c8?w=300&h=200&fit=crop', categoria: 'Panadería', disponible: true },

    // Restaurante Doña María
    { id: 'prod-14', localId: 'loc-4', nombre: 'Almuerzo del Día', descripcion: 'Sopa + segundo + jugo + postre', precio: 3.00, fotoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop', categoria: 'Almuerzos', disponible: true },
    { id: 'prod-15', localId: 'loc-4', nombre: 'Seco de Pollo', descripcion: 'Con arroz, menestra y maduro', precio: 3.50, fotoUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=300&h=200&fit=crop', categoria: 'Platos a la Carta', disponible: true },
    { id: 'prod-16', localId: 'loc-4', nombre: 'Encebollado', descripcion: 'Sopa ecuatoriana de albacora', precio: 3.00, fotoUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop', categoria: 'Sopas', disponible: true },

    // MiniMarket Express
    { id: 'prod-17', localId: 'loc-5', nombre: 'Coca-Cola 2L', descripcion: 'Botella familiar', precio: 1.75, fotoUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=200&fit=crop', categoria: 'Bebidas', disponible: true },
    { id: 'prod-18', localId: 'loc-5', nombre: 'Doritos 150g', descripcion: 'Sabor queso', precio: 1.50, fotoUrl: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=300&h=200&fit=crop', categoria: 'Snacks', disponible: true },

    // Papelería Central
    { id: 'prod-19', localId: 'loc-6', nombre: 'Cuaderno 100 hojas', descripcion: 'Cuadriculado espiral', precio: 1.50, fotoUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&h=200&fit=crop', categoria: 'Útiles', disponible: true },
    { id: 'prod-20', localId: 'loc-6', nombre: 'Pack de Esferos x3', descripcion: 'Azul, negro y rojo', precio: 1.00, fotoUrl: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=300&h=200&fit=crop', categoria: 'Útiles', disponible: true },
];

const MOCK_MOTORIZADO: Motorizado = {
    id: 'moto-1',
    userId: 'user-moto-1',
    nombre: 'Carlos López',
    telefono: '0987654321',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    disponible: true,
    ubicacion: { lat: 0.1575, lng: -78.3833 },
    gananciasDia: 5.40,
};

const MOCK_MENSAJES: Mensaje[] = [
    { id: 'msg-1', pedidoId: 'ped-1', emisorId: 'user-moto-1', texto: '¡Hola! Voy a comprar tu pedido 🛒', enviadoEn: new Date(Date.now() - 600000), leido: true },
    { id: 'msg-2', pedidoId: 'ped-1', emisorId: 'user-1', texto: 'Gracias! Por favor agrega una salsa extra de mayo', enviadoEn: new Date(Date.now() - 540000), leido: true },
    { id: 'msg-3', pedidoId: 'ped-1', emisorId: 'user-moto-1', texto: 'Listo, ya la agrego. Algo más?', enviadoEn: new Date(Date.now() - 480000), leido: true },
    { id: 'msg-4', pedidoId: 'ped-1', emisorId: 'user-1', texto: 'No, eso es todo. ¡Gracias! 😊', enviadoEn: new Date(Date.now() - 420000), leido: true },
    { id: 'msg-5', pedidoId: 'ped-1', emisorId: 'user-moto-1', texto: 'Ya tengo todo, voy en camino 🚀', enviadoEn: new Date(Date.now() - 120000), leido: false },
];

// ============================
// SERVICES
// ============================

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _usuario = signal<Usuario | null>({
        uid: 'user-1',
        nombre: 'Juan Pérez',
        telefono: '0991234567',
        email: 'juanperez@gmail.com',
        direccion: 'Calle Bolívar y Sucre, San José de Minas',
        fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        tipoUsuario: 'cliente',
        creadoEn: new Date(),
    });

    usuario = this._usuario.asReadonly();
    isLoggedIn = computed(() => !!this._usuario());

    login() {
        // Mock login - ya tiene usuario precargado
    }

    logout() {
        this._usuario.set(null);
    }

    cambiarTipoUsuario(tipo: 'cliente' | 'motorizado') {
        const u = this._usuario();
        if (u) {
            this._usuario.set({ ...u, tipoUsuario: tipo });
        }
    }
}

@Injectable({ providedIn: 'root' })
export class LocalesService {
    private _locales = signal<Local[]>(MOCK_LOCALES);
    locales = this._locales.asReadonly();

    getLocalesByCategoria(categoria: string): Local[] {
        if (!categoria || categoria === 'todos') return this._locales();
        return this._locales().filter((l) => l.categoria === categoria);
    }

    getLocalById(id: string): Local | undefined {
        return this._locales().find((l) => l.id === id);
    }

    buscarLocales(query: string): Local[] {
        const q = query.toLowerCase();
        return this._locales().filter(
            (l) =>
                l.nombre.toLowerCase().includes(q) ||
                l.categoria.toLowerCase().includes(q)
        );
    }
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
    private _productos = signal<Producto[]>(MOCK_PRODUCTOS);

    getProductosByLocal(localId: string): Producto[] {
        return this._productos().filter((p) => p.localId === localId);
    }

    getCategoriasByLocal(localId: string): string[] {
        const productos = this.getProductosByLocal(localId);
        return [...new Set(productos.map((p) => p.categoria))];
    }

    getProductosByLocalAndCategoria(localId: string, categoria: string): Producto[] {
        return this._productos().filter(
            (p) => p.localId === localId && p.categoria === categoria
        );
    }
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
    private _items = signal<ItemCarrito[]>([]);
    items = this._items.asReadonly();

    cantidadTotal = computed(() =>
        this._items().reduce((sum, i) => sum + i.cantidad, 0)
    );

    subtotal = computed(() =>
        this._items().reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0)
    );

    envio = computed(() => (this._items().length > 0 ? TARIFA_ENVIO : 0));

    total = computed(() => this.subtotal() + this.envio());

    agregar(producto: Producto, local: Local) {
        const items = [...this._items()];
        const idx = items.findIndex((i) => i.producto.id === producto.id);
        if (idx >= 0) {
            items[idx] = { ...items[idx], cantidad: items[idx].cantidad + 1 };
        } else {
            items.push({ producto, cantidad: 1, local });
        }
        this._items.set(items);
    }

    incrementar(productoId: string) {
        const items = this._items().map((i) =>
            i.producto.id === productoId
                ? { ...i, cantidad: i.cantidad + 1 }
                : i
        );
        this._items.set(items);
    }

    decrementar(productoId: string) {
        let items = this._items().map((i) =>
            i.producto.id === productoId
                ? { ...i, cantidad: i.cantidad - 1 }
                : i
        );
        items = items.filter((i) => i.cantidad > 0);
        this._items.set(items);
    }

    eliminar(productoId: string) {
        this._items.set(this._items().filter((i) => i.producto.id !== productoId));
    }

    vaciar() {
        this._items.set([]);
    }

    getCantidadProducto(productoId: string): number {
        const item = this._items().find((i) => i.producto.id === productoId);
        return item ? item.cantidad : 0;
    }
}

@Injectable({ providedIn: 'root' })
export class PedidosService {
    private _pedidos = signal<Pedido[]>([
        {
            id: 'ped-1',
            clienteId: 'user-1',
            localId: 'loc-1',
            motorizadoId: 'moto-1',
            productos: [
                { productoId: 'prod-1', nombre: 'Pollo Brostizado 1/4', precio: 3.50, cantidad: 2, fotoUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=200&fit=crop' },
                { productoId: 'prod-5', nombre: 'Gaseosa Personal', precio: 0.75, cantidad: 2, fotoUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=200&fit=crop' },
            ],
            subtotal: 8.50,
            envio: 1.50,
            total: 10.00,
            estado: 'en_camino',
            direccionEntrega: 'Calle Bolívar y Sucre, San José de Minas',
            notas: 'Agregar salsas extras por favor',
            comprobanteTransferencia: '',
            ubicacionGps: { lat: 0.1575, lng: -78.3833 },
            creadoEn: new Date(Date.now() - 1800000),
            actualizadoEn: new Date(Date.now() - 300000),
            nombreLocal: 'Pollo Brostizado Don Pancho',
        },
    ]);

    private _pedidoActivo = signal<Pedido | null>(null);

    pedidos = this._pedidos.asReadonly();
    pedidoActivo = this._pedidoActivo.asReadonly();

    crearPedido(pedido: Partial<Pedido>): Pedido {
        const nuevo: Pedido = {
            id: 'ped-' + Date.now(),
            clienteId: pedido.clienteId || 'user-1',
            localId: pedido.localId || '',
            motorizadoId: '',
            productos: pedido.productos || [],
            subtotal: pedido.subtotal || 0,
            envio: TARIFA_ENVIO,
            total: pedido.total || 0,
            estado: 'recibido',
            direccionEntrega: pedido.direccionEntrega || '',
            notas: pedido.notas || '',
            comprobanteTransferencia: pedido.comprobanteTransferencia || '',
            ubicacionGps: null,
            creadoEn: new Date(),
            actualizadoEn: new Date(),
            nombreLocal: pedido.nombreLocal || '',
        };
        this._pedidos.update((arr) => [nuevo, ...arr]);
        this._pedidoActivo.set(nuevo);
        return nuevo;
    }

    getPedidoById(id: string): Pedido | undefined {
        return this._pedidos().find((p) => p.id === id);
    }

    cambiarEstado(pedidoId: string, estado: EstadoPedido) {
        this._pedidos.update((arr) =>
            arr.map((p) =>
                p.id === pedidoId
                    ? { ...p, estado, actualizadoEn: new Date() }
                    : p
            )
        );
        const activo = this._pedidoActivo();
        if (activo && activo.id === pedidoId) {
            this._pedidoActivo.set({ ...activo, estado, actualizadoEn: new Date() });
        }
    }

    setPedidoActivo(pedido: Pedido | null) {
        this._pedidoActivo.set(pedido);
    }
}

@Injectable({ providedIn: 'root' })
export class MotorizadoService {
    private _motorizado = signal<Motorizado>(MOCK_MOTORIZADO);
    private _disponible = signal(true);

    motorizado = this._motorizado.asReadonly();
    disponible = this._disponible.asReadonly();

    toggleDisponible() {
        this._disponible.update((v) => !v);
        this._motorizado.update((m) => ({ ...m, disponible: !m.disponible }));
    }
}

@Injectable({ providedIn: 'root' })
export class ChatService {
    private _mensajes = signal<Mensaje[]>(MOCK_MENSAJES);
    mensajes = this._mensajes.asReadonly();

    getMensajesByPedido(pedidoId: string): Mensaje[] {
        return this._mensajes().filter((m) => m.pedidoId === pedidoId);
    }

    enviarMensaje(pedidoId: string, emisorId: string, texto: string): Mensaje {
        const msg: Mensaje = {
            id: 'msg-' + Date.now(),
            pedidoId,
            emisorId,
            texto,
            enviadoEn: new Date(),
            leido: false,
        };
        this._mensajes.update((arr) => [...arr, msg]);
        return msg;
    }

    mensajesNoLeidos(pedidoId: string, userId: string): number {
        return this._mensajes().filter(
            (m) => m.pedidoId === pedidoId && m.emisorId !== userId && !m.leido
        ).length;
    }
}
