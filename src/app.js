/*
 * ADAPTADOR DE INTERFAZ
 *
 * evento → app.js → taskService.js → nuevo estado → render() → DOM
 * Este archivo no contiene reglas de negocio: sólo lee eventos, llama al
 * servicio y pinta el resultado.
 */
import {
  crearTarea,
  agregarTarea,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen,
  filtrarTareas,
  siguienteId
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

function crearElementoTarea(tarea) {
  const li = document.createElement("li");
  li.className = tarea.completada ? "task done" : "task";

  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = tarea.completada;
  checkbox.dataset.toggle = tarea.id;

  const titulo = document.createElement("span");
  titulo.className = "title";
  titulo.textContent = tarea.titulo; // textContent: el título no se interpreta como HTML

  const acciones = document.createElement("span");
  acciones.className = "task-actions";
  const eliminar = document.createElement("button");
  eliminar.textContent = "Eliminar";
  eliminar.dataset.delete = tarea.id;

  label.append(checkbox, " ", titulo);
  acciones.append(eliminar);
  li.append(label, acciones);
  return li;
}

function render() {
  list.replaceChildren(...filtrarTareas(tareas, filtro).map(crearElementoTarea));

  const { total, pendientes, terminadas } = obtenerResumen(tareas);
  summary.textContent = `Total: ${total} · Pendientes: ${pendientes} · Terminadas: ${terminadas}`;
}

function actualizar(nuevasTareas) {
  tareas = nuevasTareas;
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titulo = input.value.trim();
  if (!titulo) {
    message.textContent = "Escribe un título antes de agregar.";
    return;
  }
  input.value = "";
  message.textContent = "";
  actualizar(agregarTarea(tareas, crearTarea(siguienteId(tareas), titulo)));
});

list.addEventListener("click", (event) => {
  const { toggle, delete: borrar } = event.target.dataset;
  if (toggle !== undefined) actualizar(cambiarEstado(tareas, Number(toggle)));
  if (borrar !== undefined) actualizar(eliminarTarea(tareas, Number(borrar)));
});

filters.forEach(button => button.addEventListener("click", () => {
  filtro = button.dataset.filter;
  filters.forEach(b => b.classList.toggle("active", b === button));
  render();
}));

render();
