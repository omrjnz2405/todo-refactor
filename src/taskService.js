/*
 * TODO REFACTOR LAB · LÓGICA DE DOMINIO
 *
 * Funciones puras: reciben datos y devuelven datos nuevos, sin tocar el DOM
 * ni mutar la colección recibida.
 */

export function crearTarea(id, titulo) {
  return { id, titulo, completada: false };
}

export function agregarTarea(tareas, nuevaTarea) {
  return [...tareas, nuevaTarea];
}

export function buscarTarea(tareas, id) {
  return tareas.find(t => t.id === id);
}

export function obtenerPendientes(tareas) {
  return tareas.filter(t => !t.completada);
}

export function obtenerTerminadas(tareas) {
  return tareas.filter(t => t.completada);
}

export function cambiarEstado(tareas, id) {
  return tareas.map(tarea =>
    tarea.id === id
      ? { ...tarea, completada: !tarea.completada }
      : tarea
  );
}

export function eliminarTarea(tareas, id) {
  return tareas.filter(t => t.id !== id);
}

export function obtenerResumen(tareas) {
  return {
    total: tareas.length,
    pendientes: obtenerPendientes(tareas).length,
    terminadas: obtenerTerminadas(tareas).length
  };
}

const FILTROS = {
  pendientes: obtenerPendientes,
  terminadas: obtenerTerminadas
};

export function filtrarTareas(tareas, filtro) {
  const aplicar = FILTROS[filtro];
  return aplicar ? aplicar(tareas) : tareas;
}

export function siguienteId(tareas) {
  return tareas.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

export function buscarPorTexto(tareas, texto) {
  const buscado = texto.trim().toLowerCase();
  return tareas.filter(t => t.titulo.toLowerCase().includes(buscado));
}
