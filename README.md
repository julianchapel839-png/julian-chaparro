# Julián Chaparro — Sitio personal

Sitio web personal de **Julián Ernesto Chaparro Pinzón** — abogado titulado (Universidad Santo Tomás) y desarrollador de
*software legal*. Presenta su cargo actual en **Litigando**, los desarrollos que hizo allí para clientes de la banca y del
sector público (Davivienda, Banco Popular, Superintendencia de Industria y Comercio y Ministerio de Hacienda) y sus
proyectos propios: **ATALAYA**, **ÉGIDA**, **JustiDocs**, **Superintendencias**, **NÚCLEO**, el sistema disciplinario de
**Américas BPS** y **Laboraleando**.

Sitio **100 % estático** (HTML / CSS / JS), sin backend y sin paso de compilación.

## Privacidad de los desarrollos para clientes

La sección «Desarrollos para clientes» describe **qué hace cada herramienta y cómo se construyó**, sin datos de procesos,
cifras de las carteras, capturas, enlaces ni accesos: esa información pertenece a cada cliente y está protegida por las
Leyes 1581 de 2012 y 1266 de 2008. Cualquier cambio a esa sección debe mantener ese criterio.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La página (contenido, metadatos Open Graph y datos estructurados `Person`) |
| `styles.css` | Identidad visual: azul nocturno + dorado, Spectral / Inter / JetBrains Mono |
| `script.js` | Menú móvil, animaciones de entrada, barra de progreso, constelación del hero y resaltado del menú |
| `assets/img/` | Retrato (WebP + JPEG), avatar y la imagen para compartir en redes (`og-julian-chaparro.jpg`, 1200×630) |
| `cv.html` → `CV-Julian-Chaparro.pdf` | CV de una página (tamaño carta) que se descarga desde el sitio |

## Uso local
Abrir `index.html` en el navegador, o servir la carpeta:

```bash
python3 -m http.server 4321
# http://localhost:4321
```

## Regenerar el CV en PDF
El PDF se genera desde `cv.html` con Chrome / Chromium (una sola página, tamaño carta):

- Abrir `http://localhost:4321/cv.html` → **Imprimir** → **Guardar como PDF**, con *Gráficos de fondo* activado y sin
  encabezados ni pies de página; o
- con Playwright: `page.pdf({ format: "Letter", printBackground: true, preferCSSPageSize: true })`.

## Despliegue en Render (Blueprint)
El repositorio incluye `render.yaml`. En Render: **New +** → **Blueprint** → conectar este
repositorio. Render crea un **Static Site** (publish path `.`), sin build, con
**auto-deploy** en cada `push` a `main`.

Las etiquetas Open Graph y la URL canónica apuntan a `https://julian-chaparro.onrender.com/`; si el sitio se publica en
otro dominio, actualícelas en `index.html`.

## Despliegue en GitHub Pages
**Settings → Pages → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
Queda disponible en `https://<usuario>.github.io/<repo>/`.
