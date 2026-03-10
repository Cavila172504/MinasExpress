// Interfaces principales de MinasExpress

export interface Usuario {
  uid: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  fotoUrl: string;
  tipoUsuario: 'cliente' | 'local' | 'motorizado' | 'admin';
  creadoEn: Date;
}

export interface Local {
  id: string;
  nombre: string;
  categoria: CategoriaLocal;
  fotoUrl: string;
  direccion: string;
  telefono: string;
  horario: string;
  calificacion: number;
  activo: boolean;
  duenoId: string;
}

export type CategoriaLocal = 'comida' | 'tienda' | 'farmacia' | 'otro';

export interface Producto {
  id: string;
  localId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  fotoUrl: string;
  categoria: string;
  disponible: boolean;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  local: Local;
}

export interface Pedido {
  id: string;
  clienteId: string;
  localId: string;
  motorizadoId: string;
  productos: ItemPedido[];
  subtotal: number;
  envio: number;
  total: number;
  estado: EstadoPedido;
  direccionEntrega: string;
  notas: string;
  comprobanteTransferencia: string;
  ubicacionGps: { lat: number; lng: number } | null;
  creadoEn: Date;
  actualizadoEn: Date;
  nombreLocal?: string;
}

export interface ItemPedido {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  fotoUrl: string;
}

export type EstadoPedido =
  | 'recibido'
  | 'transferido'
  | 'asignado'
  | 'comprando'
  | 'en_camino'
  | 'entregado'
  | 'cancelado';

export interface Motorizado {
  id: string;
  userId: string;
  nombre: string;
  telefono: string;
  fotoUrl: string;
  disponible: boolean;
  ubicacion: { lat: number; lng: number } | null;
  gananciasDia: number;
}

export interface Mensaje {
  id: string;
  pedidoId: string;
  emisorId: string;
  texto: string;
  enviadoEn: Date;
  leido: boolean;
}

export interface DatosTransferencia {
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  titular: string;
  cedula: string;
}

export const CATEGORIAS_LOCAL: { id: CategoriaLocal; nombre: string; icono: string; color: string }[] = [
  { id: 'comida', nombre: 'Comida', icono: '🍗', color: '#ef4444' },
  { id: 'tienda', nombre: 'Tiendas', icono: '🏪', color: '#3b82f6' },
  { id: 'farmacia', nombre: 'Farmacias', icono: '💊', color: '#10b981' },
  { id: 'otro', nombre: 'Otro', icono: '📦', color: '#8b5cf6' },
];

export const ESTADOS_PEDIDO: { id: EstadoPedido; nombre: string; icono: string }[] = [
  { id: 'recibido', nombre: 'Recibido', icono: '📩' },
  { id: 'transferido', nombre: 'Transferido', icono: '💰' },
  { id: 'asignado', nombre: 'Asignado', icono: '🛵' },
  { id: 'comprando', nombre: 'Comprando', icono: '🛒' },
  { id: 'en_camino', nombre: 'En Camino', icono: '🚀' },
  { id: 'entregado', nombre: 'Entregado', icono: '✅' },
];

export const TARIFA_ENVIO = 1.50;
export const PORCENTAJE_MOTORIZADO = 0.60;
export const PORCENTAJE_ADMIN = 0.40;

export const DATOS_TRANSFERENCIA: DatosTransferencia = {
  banco: 'Banco Pichincha',
  tipoCuenta: 'Ahorro',
  numeroCuenta: '2205XXXXXX',
  titular: 'MinasExpress',
  cedula: '17XXXXXXXX',
};
