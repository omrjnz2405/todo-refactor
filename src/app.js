/*
 * MISIÓN 9 · ADAPTADOR DE INTERFAZ
 *
 * El DOM sólo lee eventos, delega las reglas a taskService.js y renderiza
 * el nuevo estado: evento → app.js → taskService.js → nuevo estado → render() → DOM
 */
import {
  crearTarea,
  agregarTarea,
  obtenerPendientes,
  obtenerTerminadas,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen
} from "./taskService.js";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");
const filters = [...document.querySelectorAll("[data-filter]")];

let tareas = [
  crearTarea(1, "Revisar requisitos"),
  crearTarea(2, "Diseñar pruebas"),
  crearTarea(3, "Refactorizar código")
];
let filtro = "todas";

function render() {
  let visibles = tareas;
  if (filtro === "pendientes") visibles = obtenerPendientes(tareas);
  if (filtro === "terminadas") visibles = obtenerTerminadas(tareas);

  list.innerHTML = "";
  visibles.forEach(tarea => {
    const li = document.createElement("li");
    li.className = tarea.completada ? "task done" : "task";
    li.innerHTML = `<label><input type="checkbox" data-toggle="${tarea.id}" ${tarea.completada ? "checked" : ""}>
      <span class="title">${tarea.titulo}</span></label>
      <span class="task-actions"><button data-delete="${tarea.id}">Eliminar</button></span>`;
    list.appendChild(li);
  });

  const r = obtenerResumen(tareas);
  summary.textContent = `Total: ${r.total} · Pendientes: ${r.pendientes} · Terminadas: ${r.terminadas}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titulo = input.value.trim();
  if (!titulo) {
    message.textContent = "Escribe un título antes de agregar.";
    return;
  }
  const id = tareas.length ? Math.max(...tareas.map(t => t.id)) + 1 : 1;
  tareas = agregarTarea(tareas, crearTarea(id, titulo));
  input.value = "";
  message.textContent = "";
  render();
});

list.addEventListener("click", (event) => {
  const { toggle, delete: borrar } = event.target.dataset;
  if (toggle !== undefined) tareas = cambiarEstado(tareas, Number(toggle));
  if (borrar !== undefined) tareas = eliminarTarea(tareas, Number(borrar));
  render();
});

filters.forEach(button => button.addEventListener("click", () => {
  filtro = button.dataset.filter;
  filters.forEach(b => b.classList.toggle("active", b === button));
  message.textContent = "";
  render();
}));

render();
