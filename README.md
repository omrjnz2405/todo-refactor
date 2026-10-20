# ToDo Refactor Lab

Ingeniería de Software · Grupo A · Docente: José Guillermo Fierro Mendoza

Integrantes:
- Natalia Jaquelin Sánchez Morales
- [NOMBRE DE TU PAREJA]

## Inicio

```bash
npm install
npm test
```

Durante el desarrollo:

```bash
npm run test:watch
```

Resultado actual: **33 pruebas en verde, 0 pendientes**.

Para ver la app: abrir `index.html` con Live Server (usa módulos ES, no funciona con doble clic en el archivo).

## Estructura

- `src/legacy.js`: código funcional simple para analizar antes de cambiar.
- `src/taskService.js`: lógica de dominio que completarás misión por misión.
- `src/app.js`: adaptador de interfaz. Lee eventos, llama a `taskService.js` y renderiza. No contiene reglas.
- `tests/taskService.test.js`: 33 pruebas unitarias con Vitest (Arrange–Act–Assert).
- `evidencia/`: salida de la suite en verde, registros RED y captura de la app.

## Misión 0 · Antes de modificar código

Responde aquí:

1. **¿Dónde almacenarías ahora el estado `completada` de una tarea?**
   Con tareas como strings no hay dónde guardarlo. Habría que crear otro array paralelo (`completadas[i]`) o meter marcas dentro del texto, y ambas opciones se rompen al eliminar o reordenar. Por eso conviene que cada tarea sea un objeto con su propia propiedad `completada`.
2. **¿Qué ocurriría si mañana cada tarea necesita prioridad, fecha o responsable?**
   Tendríamos un array paralelo por cada dato nuevo y habría que mantenerlos sincronizados a mano. Cada cambio tocaría el render, el alta y la eliminación. Con objetos sólo se agrega una propiedad.
3. **¿Qué parte del código representa datos y qué parte representa interfaz?**
   Datos: el array `tareas`. Interfaz: `mostrarTareas()`, `document.querySelector`, `innerHTML` y el `<li>`. En `legacy.js` ambas cosas están mezcladas en la misma función: recorrer las tareas y pintar el DOM ocurren en el mismo `for`.
4. **¿Qué comportamiento debemos conservar durante el refactor?**
   Que la lista muestre todas las tareas en el orden en que se agregaron, que se puedan agregar y eliminar, y que no se acepten títulos vacíos.

### Tres comportamientos observables que NO deben cambiar

1. Al agregar un título válido aparece una tarea nueva al final de la lista y el total aumenta en 1.
2. Un título vacío (o sólo espacios) no se agrega y se muestra un mensaje.
3. Al eliminar una tarea desaparece sólo esa tarea; las demás conservan su orden.

## Pair Programming

| Misión | Driver | Navigator |
|---|---|---|
| 0 · Comprender antes de cambiar | Nat | [Pareja] |
| 1 · String → objeto | [Pareja] | Nat |
| 2 · crearTarea | Nat | [Pareja] |
| 3 · agregarTarea | [Pareja] | Nat |
| 4 · buscarTarea (find) | Nat | [Pareja] |
| 5 · pendientes / terminadas (filter) | [Pareja] | Nat |
| 6 · cambiarEstado (map) | Nat | [Pareja] |
| 7 · eliminarTarea | [Pareja] | Nat |
| 8 · obtenerResumen | Nat | [Pareja] |
| 9 · Integrar con la interfaz | [Pareja] | Nat |
| 10 · Refactor final | Nat | [Pareja] |
| 11 · Nuevo requerimiento | [Pareja] | Nat |

Regla: no hubo commit hasta que ambos pudieran explicar el código y su prueba. Hay un commit por misión.

## Decisiones de refactor

| Decisión | Por qué |
|---|---|
| Tarea como objeto `{ id, titulo, completada }` | Un string no puede guardar estado ni identidad. Con objetos se agregan propiedades sin arrays paralelos. |
| Funciones puras en `taskService.js` (reciben datos, devuelven datos nuevos) | Se prueban sin navegador y sin efectos secundarios. Las pruebas son deterministas. |
| `agregarTarea` con spread `[...tareas, nueva]` | No muta el array recibido; hay una prueba que lo verifica. |
| `buscarTarea` con `find()` | La intención es "encontrar uno". Devuelve `undefined` si no existe. |
| `obtenerPendientes` / `obtenerTerminadas` con `filter()` | Seleccionan un subconjunto sin transformar los elementos. Sin coincidencias devuelven `[]`. |
| `cambiarEstado` con `map()` + `{ ...tarea }` | Produce una colección del mismo tamaño y un objeto nuevo sólo para la tarea cambiada. |
| `eliminarTarea` con `filter()` | Eliminar = "conservar todos excepto el id". `find()` sólo encuentra uno y `map()` no cambia el tamaño. |
| `obtenerResumen` reutiliza `obtenerPendientes` y `obtenerTerminadas` | Comunica mejor la intención y no duplica la condición `completada`. Recorre la lista dos veces, pero con pocas tareas no importa y es más fácil de mantener. |
| Misión 10: `filtrarTareas(tareas, filtro)` | El `if` de filtros estaba en `app.js`; era una regla de dominio. Ahora tiene pruebas. |
| Misión 10: `siguienteId(tareas)` | El cálculo del id estaba mezclado con el evento `submit`. Se movió al servicio y se probó con colección vacía. |
| Misión 10: render con `createElement` + `textContent` en vez de `innerHTML` | Un título como `<b>x</b>` se interpretaba como HTML. Ahora se muestra como texto. |
| Misión 10: función `actualizar(nuevasTareas)` en `app.js` | Quita la repetición de "asignar estado + render()" en cada evento. |

## Casos de prueba

| Función | Casos |
|---|---|
| `crearTarea` | crea tarea pendiente con id y título |
| `agregarTarea` | agrega al final; resultado tiene un elemento más; no muta el original; colección vacía |
| `buscarTarea` | id existente; id inexistente → `undefined`; colección vacía |
| `obtenerPendientes` / `obtenerTerminadas` | colección mixta; sin coincidencias → `[]`; colección vacía; no altera la original |
| `cambiarEstado` | cambia la tarea indicada; doble cambio regresa a pendiente; no altera otra tarea; id inexistente; no muta el objeto original |
| `eliminarTarea` | elimina existente y conserva orden; id inexistente; colección vacía; no muta el original |
| `obtenerResumen` | 5 tareas (3 pendientes, 2 terminadas); colección vacía en ceros |
| `filtrarTareas` | todas; pendientes/terminadas; filtro desconocido |
| `siguienteId` | mayor + 1; colección vacía → 1 |
| `buscarPorTexto` | contiene el texto; ignora mayúsculas; ignora espacios; texto vacío → todas; sin coincidencias → `[]` |

**Respuesta (Misión 3):** si `agregarTarea` modificara el array recibido, la prueba "no modifica el array original" lo detecta: después de llamar la función, el array original debe seguir teniendo la misma longitud.

**Respuesta (Misión 5):** cuando no hay coincidencias, `filter()` devuelve un array vacío `[]`, nunca `undefined`.

## Extensión elegida (Misión 11): B · Buscar por texto

- Decisión: la búsqueda **ignora mayúsculas/minúsculas** y los espacios al inicio y al final. Un texto vacío muestra todas las tareas.
- Primero se escribieron 5 pruebas (fallaron, ver `evidencia/mision11-RED.txt`) y después `buscarPorTexto()`.
- Para integrarla sólo se tocó: una función nueva en `taskService.js`, un `<input>` en `index.html` y una línea de `render()`. No se modificó ninguna función existente, lo que muestra que el refactor sí facilitó el cambio.

## Registro RED → GREEN → REFACTOR

- **RED:** la prueba `crea una tarea pendiente con id y título` falló porque `crearTarea()` lanzaba `Error: Misión 2 pendiente: implementar crearTarea()` (ver `evidencia/mision2-RED.txt`).
- **GREEN:** el cambio mínimo fue `return { id, titulo, completada: false };`.
- **REFACTOR:** en la Misión 10 se quitaron los comentarios TODO y se movieron `filtrarTareas` y `siguienteId` al servicio. Después de cada cambio se corrió `npm test` y las pruebas siguieron en verde.

## Pruebas de integración manual

| Escenario | Acción | Resultado esperado | Resultado observado |
|---|---|---|---|
| Alta válida | Escribir "Escribir README" y Agregar | Aparece nueva tarea pendiente y cambia el resumen | OK · Total 4, Pendientes 4 |
| Alta inválida | Enviar título con sólo espacios | No se agrega; mensaje claro | OK · "Escribe un título antes de agregar." |
| Cambio de estado | Marcar "Diseñar pruebas" | Cambia estilo y contadores | OK · tachada, Pendientes 3, Terminadas 1 |
| Filtro | Elegir Pendientes | Sólo se muestran pendientes | OK |
| Eliminar | Eliminar "Revisar requisitos" | Desaparece y se actualiza el resumen | OK · Total 3 |
| Búsqueda | Escribir "PRUEBAS" | Sólo tareas que contienen "pruebas" | OK |

Fallo encontrado durante el refactor: entrada `<b>xss</b>` → resultado observado: se mostraba en negritas → resultado esperado: el texto literal → corrección: usar `textContent` en lugar de `innerHTML` (Misión 10).

## Reflexión de pareja

El cambio que más aumentó la mantenibilidad fue separar la lógica de dominio del DOM. En el código original, recorrer las tareas y pintarlas en pantalla ocurría en la misma función, así que cualquier regla nueva obligaba a tocar `innerHTML`. Al mover las reglas a `taskService.js` como funciones que reciben datos y devuelven datos nuevos, `app.js` quedó como un adaptador: lee el evento, llama al servicio y vuelve a renderizar. Esto se notó en la Misión 11: agregar la búsqueda por texto sólo requirió una función nueva, un campo en el HTML y una línea en `render()`, sin modificar nada de lo que ya funcionaba.

También fue importante cambiar el modelo de string a objeto. Con `{ id, titulo, completada }` dejamos de depender de la posición en el array para eliminar o marcar tareas, y pudimos usar `find()`, `filter()` y `map()` según la intención de cada operación.

La prueba que nos dio más confianza fue la de `cambiarEstado` que verifica que el objeto original no se modifica. Es fácil escribir un `map()` que "funcione" pero que cambie la tarea original por accidente; esa prueba lo detectaría de inmediato. En general, las pruebas de casos frontera (id inexistente, colección vacía) fueron más útiles que las del caso feliz, porque cubren justo lo que no revisamos a mano. Gracias a la suite pudimos hacer el refactor final en pasos pequeños, corriendo `npm test` después de cada cambio y sabiendo que el comportamiento seguía igual.
