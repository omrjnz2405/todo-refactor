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

1. ¿Dónde almacenarías ahora el estado `completada` de una tarea?
En el código inicial (`legacy.js`), las tareas son simples cadenas de texto (`strings`), por lo que no existe una estructura para almacenar metadatos. La mejor solución es evolucionar la representación de cada tarea hacia un objeto de JavaScript (por ejemplo: `{ id: 1, titulo: "Diseñar pruebas", completada: false }`). De esta manera, el estado `completada` se convierte en una propiedad booleana encapsulada dentro de la misma entidad sin depender de arreglos paralelos.
2. ¿Qué ocurriría si mañana cada tarea necesita prioridad, fecha o responsable?
Si mantuviéramos el modelo basado únicamente en cadenas de texto, el código se volvería insostenible y frágil. Nos obligaría a recurrir a soluciones deficientes como parsear texto con separadores (ej. `"Revisar requisitos|alta|2026-10-20"`) o gestionar múltiples arreglos en paralelo sincronizados por índice. Al transformar las tareas en un array de objetos, el modelo se vuelve extensible y permite agregar propiedades como `prioridad`, `fechaLimite` o `responsable` sin romper la estructura existente ni la lógica de la aplicación.
3. ¿Qué parte del código representa datos y qué parte representa interfaz?
Datos (Modelo / Dominio): El arreglo `let tareas = [...]` que contiene la colección de elementos a gestionar.
Interfaz (Vista / DOM): La referencia `lista`, la manipulación directa de `lista.innerHTML = ""` y la concatenación de etiquetas `<li>${tareas[i]}</li>` dentro de la función `mostrarTareas()`.
5. ¿Qué comportamiento debemos conservar durante el refactor?
### Tres comportamientos observables que NO deben cambiar
1. Conservación del texto: Cada tarea procesada debe mantener íntegramente su título original al mostrarse en pantalla o consultarse en la lista.
2. Listado completo: La interfaz debe mostrar la totalidad de las tareas existentes en el modelo, sin omitir ni duplicar elementos al actualizar la vista.
3. Manejo de lista vacía: Si no hay tareas guardadas, el contenedor visual debe quedar limpio y sin elementos residuales, sin arrojar ningún error en la consola.

## Registro RED → GREEN → REFACTOR

Documenta al menos una iteración:

- **RED:** ¿qué prueba escribiste y por qué falló?
- **GREEN:** ¿cuál fue el cambio mínimo que la hizo pasar?
- **REFACTOR:** ¿qué mejoraste sin cambiar el comportamiento?

## Pair Programming

Registra por misión quién fue **Driver** y quién **Navigator**. Intercambien roles con frecuencia y no hagan commit hasta que ambos puedan explicar el código y la prueba.

Mision 0 -  Driver: Velazquez Jinez Omar 
            Nvigator: Sanchez Morales Natalia Jaquelin
