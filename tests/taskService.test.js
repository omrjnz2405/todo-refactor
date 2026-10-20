import { describe, it, expect } from "vitest";
import {
  crearTarea,
  agregarTarea,
  buscarTarea,
  obtenerPendientes,
  obtenerTerminadas,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen,
  filtrarTareas,
  siguienteId,
  buscarPorTexto
} from "../src/taskService.js";

/*
 * TODO REFACTOR LAB · SUITE STARTER
 *
 * Activa/crea pruebas misión por misión. No escribas todas las soluciones de
 * una vez. Para cada comportamiento sigue RED → GREEN → REFACTOR.
 */

describe("crearTarea", () => {
  it("crea una tarea pendiente con id y título", () => {
    // Arrange
    const id = 10;
    const titulo = "Diseñar pruebas";

    // Act
    const tarea = crearTarea(id, titulo);

    // Assert
    expect(tarea).toEqual({ id: 10, titulo: "Diseñar pruebas", completada: false });
  });
});

describe("agregarTarea", () => {
  it("devuelve una colección que incluye la nueva tarea al final", () => {
    // Arrange
    const tareas = [crearTarea(1, "Revisar requisitos")];
    const nueva = crearTarea(2, "Diseñar pruebas");

    // Act
    const resultado = agregarTarea(tareas, nueva);

    // Assert
    expect(resultado.at(-1)).toEqual(nueva);
  });

  it("el resultado contiene exactamente un elemento más", () => {
    const tareas = [crearTarea(1, "A"), crearTarea(2, "B")];

    const resultado = agregarTarea(tareas, crearTarea(3, "C"));

    expect(resultado).toHaveLength(tareas.length + 1);
  });

  it("no modifica el array original", () => {
    const tareas = [crearTarea(1, "A")];

    agregarTarea(tareas, crearTarea(2, "B"));

    expect(tareas).toHaveLength(1);
  });

  it("funciona con una colección vacía", () => {
    const resultado = agregarTarea([], crearTarea(1, "A"));

    expect(resultado).toEqual([{ id: 1, titulo: "A", completada: false }]);
  });
});
describe("buscarTarea", () => {
  const tareas = [crearTarea(1, "A"), crearTarea(2, "B"), crearTarea(3, "C")];

  it("encuentra la tarea con un id existente", () => {
    const tarea = buscarTarea(tareas, 2);

    expect(tarea).toEqual({ id: 2, titulo: "B", completada: false });
  });

  it("devuelve undefined con un id inexistente", () => {
    expect(buscarTarea(tareas, 99)).toBeUndefined();
  });

  it("devuelve undefined en una colección vacía", () => {
    expect(buscarTarea([], 1)).toBeUndefined();
  });
});
describe("obtenerPendientes / obtenerTerminadas", () => {
  const mixta = [
    { id: 1, titulo: "A", completada: false },
    { id: 2, titulo: "B", completada: true },
    { id: 3, titulo: "C", completada: false }
  ];

  it("colección mixta: separa pendientes y terminadas", () => {
    expect(obtenerPendientes(mixta).map(t => t.id)).toEqual([1, 3]);
    expect(obtenerTerminadas(mixta).map(t => t.id)).toEqual([2]);
  });

  it("sin coincidencias devuelve un array vacío (no undefined)", () => {
    const todasTerminadas = [{ id: 1, titulo: "A", completada: true }];

    expect(obtenerPendientes(todasTerminadas)).toEqual([]);
  });

  it("colección vacía devuelve un array vacío", () => {
    expect(obtenerPendientes([])).toEqual([]);
    expect(obtenerTerminadas([])).toEqual([]);
  });

  it("no altera la colección original", () => {
    const copia = structuredClone(mixta);

    obtenerPendientes(mixta);
    obtenerTerminadas(mixta);

    expect(mixta).toEqual(copia);
  });
});
describe("cambiarEstado", () => {
  it("cambia el estado de la tarea indicada", () => {
    const tareas = [crearTarea(1, "A"), crearTarea(2, "B")];

    const resultado = cambiarEstado(tareas, 1);

    expect(buscarTarea(resultado, 1).completada).toBe(true);
  });

  it("vuelve a pendiente si se cambia dos veces", () => {
    const tareas = [crearTarea(1, "A")];

    const resultado = cambiarEstado(cambiarEstado(tareas, 1), 1);

    expect(resultado[0].completada).toBe(false);
  });

  it("no altera otra tarea", () => {
    const tareas = [crearTarea(1, "A"), crearTarea(2, "B")];

    const resultado = cambiarEstado(tareas, 1);

    expect(resultado[1]).toEqual({ id: 2, titulo: "B", completada: false });
  });

  it("un id inexistente conserva el contenido", () => {
    const tareas = [crearTarea(1, "A"), crearTarea(2, "B")];

    expect(cambiarEstado(tareas, 99)).toEqual(tareas);
  });

  it("no muta el objeto original", () => {
    const original = crearTarea(1, "A");

    cambiarEstado([original], 1);

    expect(original.completada).toBe(false);
  });
});
describe("eliminarTarea", () => {
  it("elimina la tarea con un id existente y conserva el orden", () => {
    const tareas = [crearTarea(1, "A"), crearTarea(2, "B"), crearTarea(3, "C")];

    const resultado = eliminarTarea(tareas, 2);

    expect(resultado.map(t => t.id)).toEqual([1, 3]);
  });

  it("un id inexistente no elimina nada", () => {
    const tareas = [crearTarea(1, "A"), crearTarea(2, "B")];

    expect(eliminarTarea(tareas, 99)).toEqual(tareas);
  });

  it("colección vacía devuelve un array vacío", () => {
    expect(eliminarTarea([], 1)).toEqual([]);
  });

  it("no modifica el array original", () => {
    const tareas = [crearTarea(1, "A")];

    eliminarTarea(tareas, 1);

    expect(tareas).toHaveLength(1);
  });
});
describe("obtenerResumen", () => {
  it("cuenta total, pendientes y terminadas", () => {
    const tareas = [
      { id: 1, titulo: "A", completada: false },
      { id: 2, titulo: "B", completada: true },
      { id: 3, titulo: "C", completada: false },
      { id: 4, titulo: "D", completada: true },
      { id: 5, titulo: "E", completada: false }
    ];

    expect(obtenerResumen(tareas)).toEqual({ total: 5, pendientes: 3, terminadas: 2 });
  });

  it("colección vacía devuelve todo en cero", () => {
    expect(obtenerResumen([])).toEqual({ total: 0, pendientes: 0, terminadas: 0 });
  });
});

// MISIÓN 10: reglas que estaban en app.js y se movieron al dominio.
describe("filtrarTareas", () => {
  const tareas = [
    { id: 1, titulo: "A", completada: false },
    { id: 2, titulo: "B", completada: true }
  ];

  it("'todas' devuelve la colección completa", () => {
    expect(filtrarTareas(tareas, "todas")).toEqual(tareas);
  });

  it("'pendientes' y 'terminadas' delegan en filter()", () => {
    expect(filtrarTareas(tareas, "pendientes").map(t => t.id)).toEqual([1]);
    expect(filtrarTareas(tareas, "terminadas").map(t => t.id)).toEqual([2]);
  });

  it("un filtro desconocido devuelve todas", () => {
    expect(filtrarTareas(tareas, "otro")).toEqual(tareas);
  });
});

describe("siguienteId", () => {
  it("devuelve el id mayor + 1", () => {
    expect(siguienteId([crearTarea(1, "A"), crearTarea(7, "B")])).toBe(8);
  });

  it("colección vacía empieza en 1", () => {
    expect(siguienteId([])).toBe(1);
  });
});

// MISIÓN 11 · Extensión B: buscar por texto.
// Decisión: la búsqueda ignora mayúsculas/minúsculas y espacios al inicio/fin.
describe("buscarPorTexto", () => {
  const tareas = [
    crearTarea(1, "Revisar requisitos"),
    crearTarea(2, "Diseñar pruebas"),
    crearTarea(3, "Ejecutar PRUEBAS de regresión")
  ];

  it("encuentra tareas cuyo título contiene el texto", () => {
    expect(buscarPorTexto(tareas, "requisitos").map(t => t.id)).toEqual([1]);
  });

  it("ignora mayúsculas y minúsculas", () => {
    expect(buscarPorTexto(tareas, "Pruebas").map(t => t.id)).toEqual([2, 3]);
  });

  it("ignora espacios al inicio y al final", () => {
    expect(buscarPorTexto(tareas, "  revisar  ").map(t => t.id)).toEqual([1]);
  });

  it("texto vacío devuelve todas las tareas", () => {
    expect(buscarPorTexto(tareas, "")).toEqual(tareas);
  });

  it("sin coincidencias devuelve un array vacío", () => {
    expect(buscarPorTexto(tareas, "xyz")).toEqual([]);
  });
});
