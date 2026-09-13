# Revisión del repo addyosmani/agent-skills que mandó Pablo

13 de septiembre de 2026. Clonado, revisado y **no instalado, porque no hace falta**.

## Veredicto de seguridad: limpio

| | |
|---|---|
| Licencia | MIT |
| Tamaño | 2,3 MB, 196 ficheros |
| Descargas remotas en scripts | **ninguna** |
| Código ofuscado o en base64 | **ninguno** |
| Acceso a credenciales (`~/.ssh`, `.aws`, claves de API) | **ninguno** |

Se buscaron los patrones que delatan un repo malicioso —`curl | bash`, `eval()`,
`base64 -d`, `nc -e`, `/dev/tcp/`, lectura de `~/.ssh` o de variables con `KEY`,
`TOKEN` o `SECRET`— y las **únicas** coincidencias están dentro de
`skills/security-and-hardening/SKILL.md`, que son ejemplos de buenas prácticas: justo
lo contrario de código dañino.

El único fichero que se ejecutaría solo es `hooks/session-start.sh`, y lo que hace es
leer un `SKILL.md` del propio repo, escaparlo con `jq` e inyectarlo como contexto de
la sesión. No baja nada de internet ni toca nada del sistema.

## Pero ya las tienes: las 25

```
skills en el repo: 25
que ya están instaladas: 25
las que faltarían: ninguna
```

Están todas en `.claude/skills/`: `api-and-interface-design`,
`browser-testing-with-devtools`, `ci-cd-and-automation`, `code-review-and-quality`,
`code-simplification`, `constraint-driven-development`, `context-engineering`,
`debugging-and-error-recovery`, `deprecation-and-migration`, `documentation-and-adrs`,
`doubt-driven-development`, `frontend-ui-engineering`, `git-workflow-and-versioning`,
`idea-refine`, `incremental-implementation`, `interview-me`,
`observability-and-instrumentation`, `performance-optimization`,
`planning-and-task-breakdown`, `security-and-hardening`, `shipping-and-launch`,
`source-driven-development`, `spec-driven-development`, `test-driven-development` y
`using-agent-skills`.

**Conclusión: no hay nada que descargar.** Si en algún momento el repo publica skills
nuevas, la forma de traerlas es comparar la lista otra vez y copiar solo las que
falten, no clonar encima de lo que ya hay.

## El otro repo de la captura: OmniRoute

`github.com/diegosouzapw/OmniRoute` es un enrutador de modelos de lenguaje: reparte
peticiones entre varios proveedores de IA. No está revisado porque **no tiene que ver
con la tienda**: no sirve para buscar productos, ni para fichas, ni para Shopify. Si
en algún momento quieres abaratar el servidor de agentes de `libre` repartiendo entre
proveedores, entonces sí merece una revisión seria —tiene 247 issues y 291 pull
requests abiertos, que no es poco— pero hoy no pinta nada aquí.
