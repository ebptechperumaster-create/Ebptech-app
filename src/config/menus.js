// Menús tomados de la hoja "Base para APP Ebptech tecnico" (AppSheet).
// `ruta` indica la pantalla de la app; los módulos sin pantalla aún muestran "Próximamente".

export const AREAS = [
  { id: 'inicio', nombre: 'Inicio', icono: '⏻' },
  { id: 'sst', nombre: 'S.S.T.', icono: '🛡' },
  { id: 'comercial', nombre: 'Comercial', icono: '📋' },
  { id: 'logistica', nombre: 'Logística', icono: '🚚' },
  { id: 'operaciones', nombre: 'Operaciones', icono: '🛠' },
  { id: 'administracion', nombre: 'Administración', icono: '🗂' },
  { id: 'contabilidad', nombre: 'Contabilidad', icono: '🧾' },
  { id: 'gerencia', nombre: 'Gerencia', icono: '📊' }
];

export const MENUS = {
  inicio: [
    {
      id: 'MP001', nombre: 'Registro de Ingreso', icono: '⏰',
      opciones: [
        { id: 'MP1001', nombre: 'Registro de Ingreso', ruta: '/inicio/marcador' },
        { id: 'MP1002', nombre: 'Registro de Viaje' },
        { id: 'MP1003', nombre: 'Registro de Movilidad Viaje' }
      ]
    },
    {
      id: 'MP002', nombre: 'Asignación de trabajo', icono: '📅',
      opciones: [
        { id: 'MP2001', nombre: 'Calendario Vaporizador' },
        { id: 'MP2002', nombre: 'Calendario Quemadores' },
        { id: 'MP2003', nombre: 'Particular' },
        { id: 'MP2004', nombre: 'Registro de Servicios' }
      ]
    },
    {
      id: 'MP003', nombre: 'Check List', icono: '✅',
      opciones: [
        { id: 'MP3001', nombre: 'Check List EPPs' },
        { id: 'MP3002', nombre: 'Check List Herramientas' },
        { id: 'MP3003', nombre: 'Check List Extintores' },
        { id: 'MP3004', nombre: 'Check List Vehículo' },
        { id: 'MP3005', nombre: 'Check List Botiquín' },
        { id: 'MP3006', nombre: 'Check List Luces emergencia' },
        { id: 'MP3007', nombre: 'Check List Detectores de Humo' },
        { id: 'MP3008', nombre: 'Check List Instalaciones' },
        { id: 'MP3009', nombre: 'Check List de Charla de 5min' }
      ]
    },
    {
      id: 'MP004', nombre: 'Rendiciones de Viáticos', icono: '🧮',
      opciones: [
        { id: 'MP4001', nombre: 'Ingresar documento' },
        { id: 'MP4002', nombre: 'Registro documento - usuario' }
      ]
    },
    {
      id: 'MP005', nombre: 'Reporte de Actos y Condiciones', icono: '🚨',
      opciones: [
        { id: 'MP5001', nombre: 'Reporte Actos y Condiciones Sub Estándar' },
        { id: 'MP5002', nombre: 'Reporte Incidentes' },
        { id: 'MP5003', nombre: 'Reporte Accidentes' },
        { id: 'MP5004', nombre: 'Reporte de Buenas Prácticas' },
        { id: 'MP5005', nombre: 'Registro de OPT' },
        { id: 'MP5006', nombre: 'Registro Visitas Gerenciales' },
        { id: 'MP5007', nombre: 'Estadísticas' }
      ]
    },
    {
      id: 'MP006', nombre: 'Capacitaciones', icono: '🎓',
      opciones: [
        { id: 'MP6001', nombre: 'Capacitaciones SST' },
        { id: 'MP6002', nombre: 'Capacitaciones Salud' },
        { id: 'MP6003', nombre: 'Capacitaciones Puesto de trabajo' },
        { id: 'MP6004', nombre: 'Registro de Capacitaciones' }
      ]
    },
    { id: 'MP007', nombre: 'Clientes', icono: '👥', opciones: [] }
  ],
  sst: [
    { id: 'MSS-DOC', nombre: 'Documentos SST', icono: '📚', opciones: [
      { id: 'DOC1', nombre: 'Instructivos' }, { id: 'DOC2', nombre: 'IPERC' },
      { id: 'DOC3', nombre: 'Manuales' }, { id: 'DOC4', nombre: 'PETS' }, { id: 'DOC5', nombre: 'Políticas SST' }
    ] },
    { id: 'MSS001', nombre: 'Registro de EMOs', opciones: [] },
    { id: 'MSS002', nombre: 'Registro de SCTR', opciones: [] },
    { id: 'MSS003', nombre: 'Registro de Seguro Vida Ley', opciones: [] },
    { id: 'MSS004', nombre: 'Registro de EPPs', opciones: [] },
    { id: 'MSS005', nombre: 'Registro de Equipos especiales', opciones: [] },
    { id: 'MSS006', nombre: 'Registro de Capacitaciones', opciones: [] },
    { id: 'MSS007', nombre: 'Registro de Calibraciones', opciones: [] },
    { id: 'MSS008', nombre: 'Registro de Check List', opciones: [] },
    { id: 'MSS009', nombre: 'Registro Charla 5 minutos', opciones: [] },
    { id: 'MSS010', nombre: 'Inventario de EPPs', opciones: [] },
    { id: 'MSS011', nombre: 'Inventario de Equipos especiales', opciones: [] },
    { id: 'MSS012', nombre: 'Registro de Actos y Condiciones inseguras', opciones: [] },
    { id: 'MSS013', nombre: 'Registro de Accidentes', opciones: [] },
    { id: 'MSS014', nombre: 'Registro Médico', opciones: [] },
    { id: 'MSS015', nombre: 'Resumen', opciones: [] }
  ],
  comercial: [
    { id: 'MCM001', nombre: 'Cotizaciones', opciones: [] },
    { id: 'MCM002', nombre: 'Órdenes de Compra', opciones: [] },
    { id: 'MCM003', nombre: 'Dashboard', opciones: [] },
    { id: 'MCM004', nombre: 'Marketing', opciones: [] }
  ],
  logistica: [
    { id: 'MLG001', nombre: 'Stock de Repuestos y equipos', opciones: [] },
    { id: 'MLG002', nombre: 'Registro de custodia', opciones: [] },
    { id: 'MLG003', nombre: 'Registro de entrega', opciones: [] },
    { id: 'MLG004', nombre: 'Rendiciones', opciones: [
      { id: 'MSR-01', nombre: 'OTS' }, { id: 'MSR-02', nombre: 'Registro de transferencias' },
      { id: 'MSR-03', nombre: 'Rendiciones General' }
    ] }
  ],
  operaciones: [
    { id: 'MOP001', nombre: 'Programación', opciones: [] },
    { id: 'MOP002', nombre: 'Estado de Informe', opciones: [] },
    { id: 'MOP003', nombre: 'Mantenimiento Programación', opciones: [] },
    { id: 'MOP004', nombre: 'Registro Mantenimiento Vaporizadores', opciones: [] },
    { id: 'MOP005', nombre: 'Registro Mantenimiento Quemadores', opciones: [] },
    { id: 'MOP006', nombre: 'Control de Vaporizadores', opciones: [] },
    { id: 'MOP007', nombre: 'Ubicación de Personal', ruta: '/operaciones/ubicacion', opciones: [] },
    { id: 'MOP008', nombre: 'Resumen Operaciones', opciones: [] },
    { id: 'MOP009', nombre: 'Dashboard Solgas', opciones: [] },
    { id: 'MOP010', nombre: 'Proyectos', opciones: [] }
  ],
  administracion: [
    { id: 'MAD001', nombre: 'Solicitud de vacaciones', opciones: [] },
    { id: 'MAD002', nombre: 'Descanso médico', opciones: [] },
    { id: 'MAD003', nombre: 'Legajo del trabajador', opciones: [] }
  ],
  contabilidad: [
    { id: 'MCO001', nombre: 'Documentos contables', opciones: [] }
  ],
  gerencia: [
    { id: 'MGE001', nombre: 'Dashboard general', opciones: [] }
  ]
};
