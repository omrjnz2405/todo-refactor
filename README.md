# ToDo Refactor Starter

Proyecto inicial para **ToDo Refactor Lab**: refactorización, pruebas unitarias y Pair Programming.

## Inicio

```bash
npm install
npm test
```

Durante el desarrollo:

```bash
npm run test:watch
```

La primera prueba está preparada para fallar: es el punto de partida de la **Misión 2** y del ciclo **RED → GREEN → REFACTOR**.

## Estructura

- `src/legacy.js`: código funcional simple para analizar antes de cambiar.
- `src/taskService.js`: lógica de dominio que completarás misión por misión.
- `src/app.js`: interfaz inicial; en la Misión 9 deberá delegar la lógica a `taskService.js`.
- `tests/taskService.test.js`: suite incremental de pruebas unitarias con Vitest.

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

## Registro RED → GREEN → REFACTOR

Documenta al menos una iteración:

- **RED:** ¿qué prueba escribiste y por qué falló?
- **GREEN:** ¿cuál fue el cambio mínimo que la hizo pasar?
- **REFACTOR:** ¿qué mejoraste sin cambiar el comportamiento?

## Pair Programming

Registra por misión quién fue **Driver** y quién **Navigator**. Intercambien roles con frecuencia y no hagan commit hasta que ambos puedan explicar el código y la prueba.
