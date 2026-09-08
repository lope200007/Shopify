# Dar de alta patitascalidas.com en Google Search Console

Comprobado el 8 de septiembre de 2026. Cinco minutos.

## Por qué merece la pena

Ahora mismo no sabemos **qué busca la gente que llega desde Google**. Sabemos
que llegan 22 sesiones, y nada más: ni con qué palabras, ni en qué posición
salimos, ni cuántas veces nos vieron sin hacer clic.

Search Console es la única fuente de ese dato, y es gratis. Además es donde se
pide la indexación de una página nueva en vez de esperar semanas a que Google
pase solo.

## Lo que ya está bien (no toques nada de esto)

| Comprobación | Estado |
| --- | --- |
| `sitemap.xml` | 200, con 5 sub-sitemaps |
| `robots.txt` | permite rastrear |
| Etiqueta `noindex` | no hay ninguna |
| `http://patitascalidas.com` | 301 → `https://patitascalidas.com/` |
| `https://www.patitascalidas.com` | 301 → `https://patitascalidas.com/` |
| Canonical | apunta a la versión sin www |

Una sola versión canónica y todo lo demás redirigido. Es como tiene que estar.

## Elige propiedad de DOMINIO, no de prefijo de URL

Google ofrece dos tipos y la diferencia importa:

- **Dominio** (`patitascalidas.com`) — cubre `http` y `https`, con `www` y sin
  `www`, y cualquier subdominio. Una sola propiedad para todo.
- **Prefijo de URL** (`https://patitascalidas.com`) — solo esa combinación
  exacta. Si algún día algo apunta a `www`, no lo verías.

**Usa Dominio.** Se verifica por DNS, y aquí eso es una ventaja: los
nameservers de patitascalidas.com son de Google
(`ns-cloud-e1..e4.googledomains.com`). Si el dominio está en la misma cuenta de
Google, la verificación suele ser automática o de un clic.

## Pasos

1. Entra en <https://search.google.com/search-console> con la cuenta de Google
   del negocio (la misma del dominio, si puede ser).
2. **Añadir propiedad** → columna izquierda, **Dominio**.
3. Escribe `patitascalidas.com`. Sin `https://`, sin `www`, sin barra final.
4. Google pedirá un registro **TXT** en el DNS.
   - Si el dominio está en esa misma cuenta, es probable que lo verifique solo.
   - Si no, copia el TXT y añádelo donde gestiones el DNS. Es un registro de
     tipo TXT, nombre `@` (o el dominio raíz) y el valor que te dé Google.
   - Tarda entre unos minutos y unas horas en propagarse. El botón *Verificar*
     se puede pulsar las veces que haga falta.
5. Verificada la propiedad: **Sitemaps** (menú izquierdo) → escribe
   `sitemap.xml` → **Enviar**.

## Qué mirar, y cuándo

**No mires nada los primeros días.** Search Console tarda entre 2 y 3 días en
tener datos, y las páginas nuevas de un dominio recién dado de alta tardan
semanas en indexarse. Ver ceros el primer día no significa nada.

A partir de la segunda semana, dos sitios:

- **Rendimiento → Consultas.** Con qué palabras nos ven. Esto es lo que hoy no
  sabemos y lo que decide sobre qué escribir después.
- **Indexación → Páginas.** Cuántas de las 37 fichas y los 3 artículos ha
  indexado Google, y cuáles ha descartado y por qué.

Si quieres acelerar un artículo concreto: pega su URL en la barra de arriba →
**Solicitar indexación**.

## Un extra que multiplica esto

Una vez verificada, se puede **conectar Search Console a la cuenta de
OpenRush** (el conector de datos de marketing de estas sesiones). Comprobado
hoy: `patitascalidas.com` todavía no está conectado ahí.

Con esa conexión yo puedo leer directamente clics, impresiones, posición media
y consultas reales en cada sesión, en vez de trabajar con estimaciones. Es la
diferencia entre suponer qué busca la gente y saberlo.
