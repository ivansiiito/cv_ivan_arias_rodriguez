# Iván Arias · Web personal

Web profesional en español, creada con **Next.js 16, React 19 y TypeScript**.

La dirección visual combina marfil, verde salvia y verde bosque, tipografía Manrope y DM Sans, composiciones editoriales e ilustraciones originales en SVG y CSS. Las fuentes y los gráficos se sirven localmente.

## Abrir la web en tu ordenador

Las dependencias ya están instaladas en este proyecto. Desde la carpeta `site`:

```powershell
npm run dev
```

Abre **http://127.0.0.1:3000** en el navegador. Mantén la terminal abierta mientras uses la web; `Ctrl+C` detiene el servidor.

En Windows también puedes hacer doble clic en **`iniciar-web.cmd`**. Si el puerto 3000 ya está ocupado, Next.js indicará en la terminal el puerto alternativo.

Para una instalación nueva, necesitas Node.js 20.9 o posterior y ejecutar `npm ci` antes de `npm run dev`. La instalación necesita conexión a Internet; después, la web, sus fuentes, sus ilustraciones y la descarga del CV en Word funcionan localmente. Los enlaces a LinkedIn y latostadora abren servicios externos, y el correo abre tu aplicación de email.

## Qué incluye

- Presentación y biografía adaptadas al perfil aportado.
- Seis etapas profesionales desplegables, con fechas y responsabilidades.
- Cinco titulaciones, tres certificaciones y ocho idiomas con sus niveles.
- Portfolio filtrable por producto, lenguaje e ingeniería.
- Tres fichas individuales basadas en la trayectoria documentada: latostadora, investigación y docencia en la UCM, y redes y sistemas móviles en Nokia.
- Contacto por correo, copia de la dirección, LinkedIn y descarga del CV completo en Word (.docx).
- Navegación móvil, acceso por teclado, enlace para saltar al contenido y respeto a la preferencia de movimiento reducido.
- Metadatos, favicon e imagen de presentación para compartir.
- Gemelo digital conversacional, conectado directamente a LM Studio desde el servidor de Next.js.

Los periodos se han conservado tal como aparecen en el PDF, incluido el final del puesto de CTO en octubre de 2026. Las fichas resumen trabajo documentado y sus ilustraciones son interpretaciones visuales; no son capturas de los productos originales.

## Conversar con el gemelo digital

Abre **«Habla con mi gemelo»** en la esquina inferior derecha, o el acceso de la sección «Sobre mí». El panel permite hacer preguntas sobre la carrera, la formación, los proyectos y los idiomas de Iván. Incluye preguntas sugeridas, respuestas progresivas, contexto entre preguntas, un botón para detener la respuesta y otro para iniciar una conversación nueva.

La conexión predeterminada es **`http://172.23.32.1:1234/v1`**. Mantén LM Studio abierto, con el servidor activado y un modelo de conversación disponible. El modelo se detecta automáticamente mediante `/v1/models`; no queda fijado al que había durante el desarrollo.

El navegador llama a **`POST /api/gemelo`** en la propia web. El servidor de Next.js añade la ficha profesional y habla con LM Studio a través de `/v1/chat/completions`. Esto evita configurar CORS en LM Studio y mantiene las claves fuera del navegador. Se utiliza la [API compatible documentada por LM Studio](https://lmstudio.ai/docs/developer/openai-compat/chat-completions).

El gemelo se presenta como una representación de IA y recibe instrucciones para basarse en el perfil, conservar fechas y reconocer datos desconocidos. Estas instrucciones orientan al modelo, pero sus respuestas pueden contener errores. Al actualizar `src/data/profile.ts`, también actualizas la fuente del gemelo. Cambiar únicamente el CV descargable no actualiza esa ficha.

El historial se mantiene en memoria en la pestaña, incluso al cerrar y volver a abrir el panel o al navegar entre proyectos. Se borra al recargar o al pulsar «Nueva conversación». La web no lo escribe en disco, cookies ni almacenamiento del navegador. LM Studio puede conservar sus propios registros según su configuración. Para mantener acotado el contexto, se envían los intercambios completos más recientes, hasta 19 mensajes y 18.000 caracteres, además del perfil. Cada pregunta admite hasta 2.000 caracteres.

### Cambiar conexión, modelo o autenticación

No hace falta modificar el `.env` actual para la configuración predeterminada. `.env.example` documenta estas variables opcionales, que puedes añadir a `.env.local` o a `.env`:

```dotenv
LM_STUDIO_BASE_URL=http://172.23.32.1:1234/v1
LM_STUDIO_MODEL=
LM_STUDIO_REASONING_EFFORT=none
LM_STUDIO_API_KEY=
```

- **`LM_STUDIO_BASE_URL`**: dirección del servidor. Acepta la URL con o sin `/v1`.
- **`LM_STUDIO_MODEL`**: identificador del modelo; vacío permite la selección automática.
- **`LM_STUDIO_REASONING_EFFORT`**: `none` solicita respuestas directas, comprobadas con el Qwen cargado en LM Studio. Esto evita que el modelo consuma el presupuesto de salida en razonamiento sin llegar a responder. Usa `default` para omitir el parámetro o un nivel admitido por tu modelo, como `low`. Solo afecta a las peticiones de esta web; no cambia los ajustes globales de LM Studio.
- **`LM_STUDIO_API_KEY`**: clave específica si activas autenticación. Si está vacía, las peticiones salen sin clave. Únicamente si LM Studio responde 401 o 403 se reintenta con `OPENROUTER_API_KEY`, la variable que ya existía en el `.env` aportado, si está definida.

Ninguna clave se incluye en el contexto del modelo ni se expone al navegador. No se contacta con OpenRouter: el nombre de la variable existente solo sirve como alternativa de autenticación para el servidor configurado. Reinicia Next.js después de modificar las variables. La conexión está concentrada en `src/lib/lm-studio.ts` para facilitar un cambio posterior a otro proveedor compatible.

Si el servidor está apagado, no hay un modelo disponible o la respuesta falla, el panel muestra un mensaje y permite reintentar. La espera máxima del servidor es de dos minutos. «Detener respuesta» cancela la petición en curso; «Nueva conversación» también la cancela y limpia el historial.

## Personalizar el contenido

**`src/data/profile.ts`** reúne los datos de contacto, la experiencia, la formación, los idiomas, las certificaciones y los proyectos.

Para añadir un proyecto, incorpora un objeto al array `projects` con un `slug` único, su título, categoría, periodo, descripción y contribuciones. La tarjeta, el filtro, la ruta `/proyectos/tu-slug` y la navegación al siguiente proyecto se generan a partir de ese contenido. Las categorías actuales son `Producto`, `Lenguaje` e `Ingeniería`. `externalUrl` y `externalLabel` permiten añadir el enlace a un portfolio, repositorio o proyecto publicado.

Los colores, tamaños, espacios y adaptaciones a móvil están en **`src/app/globals.css`**. Los textos de presentación se encuentran en **`src/app/page.tsx`**. El CV descargable en Word está en [public/cv-ivan-arias-rodriguez.docx](public/cv-ivan-arias-rodriguez.docx). Los enlaces «Descargar CV» usan esta ruta desde `profile.cv`.

La configuración predeterminada no requiere añadir claves ni variables de entorno. Se conserva el `.env` que ya existía. Si en el futuro publicas la web, puedes definir `NEXT_PUBLIC_SITE_URL` con tu dominio para que las imágenes de los metadatos usen esa dirección. El servidor que aloje Next.js deberá poder alcanzar el proveedor del chat; la dirección local de LM Studio solo funciona dentro de tu red.

## Compilación y comprobaciones

```powershell
npm run build
npm start
```

Este modo sirve la compilación de producción en **http://127.0.0.1:3000**.

```powershell
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

Las pruebas utilizan la compilación de producción, por lo que hay que ejecutar `npm run build` primero. Playwright abre un servidor temporal en el puerto 3100 y comprueba navegación, proyectos, filtros, descargas, portapapeles, accesibilidad con axe, movimiento reducido, página 404 y ausencia de desbordamientos en anchuras de 320 a 1440 píxeles. Las capturas se guardan en `.local/screenshots/`.

Las pruebas habituales del chat usan respuestas controladas y un servidor temporal de prueba: no necesitan LM Studio. Comprueban historial, reintentos, cancelación, accesibilidad, autenticación opcional, validación de peticiones y lectura de respuestas progresivas, incluida la separación de campos de razonamiento.

Para comprobar también el modelo real de LM Studio con preguntas sobre Nokia, una pregunta de seguimiento y un dato desconocido:

```powershell
$env:LM_STUDIO_LIVE_TEST = "1"
npm run test:e2e
```

Esta prueba utiliza la conexión configurada y consume recursos del modelo local. Las capturas del chat real se guardan como `twin-live-desktop.png` y `twin-live-mobile.png` en `.local/screenshots/`.

Si ya tienes un navegador Chromium instalado en una ubicación específica, puedes usar `PLAYWRIGHT_CHROMIUM_EXECUTABLE` para indicar su ruta antes de lanzar las pruebas. La instalación de navegadores solo es necesaria para las pruebas, no para usar la web.

## Archivos principales

```text
src/
  app/
    page.tsx                    Página de inicio
    globals.css                 Diseño y estilos adaptables
    layout.tsx                  Fuentes y metadatos
    proyectos/[slug]/page.tsx    Fichas de proyectos
    opengraph-image.tsx          Imagen para compartir
    not-found.tsx               Página 404
    api/gemelo/route.ts          API de conversación y validación
    twin.css                    Diseño del chat
  components/                   Navegación, ilustraciones, portfolio y contacto
  data/profile.ts               Contenido editable
  lib/lm-studio.ts               Adaptador del proveedor local
  lib/twin-knowledge.ts          Personalidad y contexto profesional
  lib/chat-protocol.ts           Protocolo y límites compartidos del chat
public/cv-ivan-arias-rodriguez.docx  CV descargable en Word
tests/site.spec.ts               Pruebas de navegador
iniciar-web.cmd                  Inicio rápido en Windows
```
