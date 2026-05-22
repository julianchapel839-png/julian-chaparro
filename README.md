# Julián Chaparro — Sitio personal

Sitio web personal de **Julián Ernesto Chaparro Pinzón** — abogado y desarrollador *legaltech*.
Funciona como marca paraguas de sus proyectos: **ATALAYA**, **ÉGIDA**, **NÚCLEO** y **Américas BPS**.

Sitio **100 % estático** (HTML / CSS / JS), sin backend y sin paso de compilación.

## Uso local
Abrir `index.html` en el navegador, o servir la carpeta:

```bash
python3 -m http.server 4321
# http://localhost:4321
```

## Despliegue en Render (Blueprint)
El repositorio incluye `render.yaml`. En Render: **New +** → **Blueprint** → conectar este
repositorio. Render crea un **Static Site** (publish path `.`), sin build, con
**auto-deploy** en cada `push` a `main`.

## Despliegue en GitHub Pages
**Settings → Pages → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
Queda disponible en `https://<usuario>.github.io/<repo>/`.
