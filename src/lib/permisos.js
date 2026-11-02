// Matriz de permisos aprobada el 2 de noviembre de 2026 (documento "Especificación App Ebptech").
export const ROLES = ['tecnico', 'administrador', 'gerente', 'desarrollador'];
export const ROL_NOMBRE = {
  tecnico: 'Técnico', administrador: 'Administrador', gerente: 'Gerente', desarrollador: 'Desarrollador'
};

const todas = (p) => p?.rol === 'gerente' || p?.rol === 'desarrollador';

export const puede = {
  verArea: (p, area) => area === 'inicio' || todas(p) || (p?.areas || []).includes(area),
  verRegistrosDelArea: (p) => p?.rol !== 'tecnico',
  verTodasLasAreas: todas,
  aprobar: (p) => ['administrador', 'gerente'].includes(p?.rol),
  borrar: (p) => p?.rol !== 'tecnico',
  gestionarUsuarios: todas,
  configurar: (p) => p?.rol === 'desarrollador'
};
