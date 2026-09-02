# Cambiar el avatar

El avatar ya funciona en todas las páginas que cargan `JS/perrito.js`.

## Usar un solo GIF o una sola imagen

1. Copia el archivo nuevo dentro de la carpeta `IMG`.
2. Abre `JS/perrito.config.js`.
3. Cambia únicamente esta línea:

```js
imagenUnica: "mi-perrito.gif",
```

Se admiten archivos GIF, PNG, JPG y WebP. El mismo archivo se mostrará al saludar, hablar, caminar, comer, celebrar y dormir. Para recuperar los movimientos originales, deja la opción vacía:

```js
imagenUnica: "",
```

Después guarda el archivo y actualiza el navegador con `Ctrl + F5`.

## Cambiar cada movimiento por separado

Con `imagenUnica: ""`, puedes reemplazar los nombres de archivo dentro de `estados` en `JS/perrito.config.js`. Todos los archivos deben estar dentro de `IMG`.

En ese mismo archivo también puedes cambiar las frases, los tiempos o desactivar el movimiento automático.
