# Origen de las habilidades copiadas el 23-09-2026

Pablo pidió "Los mejores 5 plugins para dominar Claude": Superpowers, Frontend
Design, Context7 y Ralph Loop.

- **Superpowers** (obra/superpowers, licencia MIT): dispatching-parallel-agents, executing-plans, finishing-a-development-branch,
  receiving-code-review, requesting-code-review, subagent-driven-development,
  systematic-debugging, using-git-worktrees, using-superpowers,
  verification-before-completion, writing-plans y writing-skills. Copiadas tal
  cual del repo `libre`, donde ya estaban revisadas. `test-driven-development` ya
  existía aquí y no se ha tocado.
- **Frontend Design** (anthropics/skills, Apache 2.0, con su LICENSE.txt):
  copiada de `libre/.agents/skills/frontend-design`.
- **Context7** no se copia: su habilidad solo llama a dos herramientas de su
  servidor MCP (`resolve-library-id` y `query-docs`), que no están instaladas
  porque instalar complementos de terceros necesita la aprobación de Pablo. Su
  servicio sin clave devolvió 429 desde aquí. Para la documentación de Shopify ya
  hay conector propio (`search_docs_chunks`).
- **Ralph Loop** no se instala: es un gancho que no deja terminar a Claude y le
  repite la misma orden en bucle. Gasta mucho cupo semanal y cambia los ajustes
  del proyecto. Para tareas repetidas ya existe `/loop` y las rutinas.
- **brainstorming** se quedó fuera de este repo: su servidor de apoyo
  (`scripts/server.cjs`, una variable que se llama «token» pero es una etiqueta) hace saltar
  el detector de claves. Es una falsa alarma, pero no se debilita el detector ni
  se toca código ajeno. Sigue disponible en el repo `libre`, que se carga en
  todas las sesiones.
