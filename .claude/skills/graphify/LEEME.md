# graphify — cómo se instaló aquí

Skill de terceros: <https://github.com/Graphify-Labs/graphify> (Apache-2.0).
Paquete en PyPI: **`graphifyy`** (con dos íes griegas), no `graphify`.

## Lo que se revisó antes de instalarla

- El wheel de PyPI 0.9.56 es idéntico byte a byte al código del repositorio en
  GitHub (`diff -rq` sobre el paquete instalado: solo sobra un `MIGRATION.md`).
- No hay `eval`, `exec`, `os.system`, `pickle` ni `shell=True` en todo el paquete.
- No hay telemetría. Las únicas URL del código son proveedores de LLM que tú
  eliges, CDN para el HTML del grafo, y un `print` con la web del proyecto.
- Respeta `.gitignore` y descarta a propósito `.env`, `.pem`, `id_rsa`,
  `credentials.json` y compañía antes de indexar.
- Trae `security.py` con guarda anti-SSRF y saneado de etiquetas, y un
  `SECURITY.md` con el modelo de amenazas escrito.

## Cómo se usa aquí

**Siempre con `--code-only`.** Sin ese flag, los documentos e imágenes se mandan
a un LLM externo, y en este repositorio hay descripciones de producto, precios y
notas internas. Con `--code-only` todo el análisis es local (tree-sitter, AST).

```bash
graphify . --code-only --no-viz    # construir o reconstruir el grafo
graphify query <nombre>            # buscar un símbolo y lo que lo rodea
graphify path <a> <b>              # camino de dependencias entre dos símbolos
graphify explain <nodo>            # todo lo conectado a un nodo
```

El grafo se escribe en `graphify-out/`, que está en `.gitignore`.

## Lo que NO se instaló

Los *hooks* `PreToolUse` que registra `graphify install` en
`~/.claude/settings.json`. Solo lanzan `graphify hook-guard` y son inofensivos,
pero modifican la configuración del agente y aquí no hacen falta. Si los quieres
en tu máquina: `uv tool install graphifyy && graphify install --platform claude`.
