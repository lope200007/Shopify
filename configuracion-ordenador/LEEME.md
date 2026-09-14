# Instalar Claude en el ordenador de Pablo

Windows. Escrito para alguien que no ha usado nunca una terminal.

## Qué instalar

**La aplicación de escritorio**, no la versión de terminal.

https://claude.com/download

Es una ventana normal, con botones. La otra versión se maneja escribiendo
comandos en una pantalla negra y no compensa en este caso.

Requisitos: Windows 10 (versión 1809 o posterior), 4 GB de RAM, y una
suscripción Pro o Max. **El plan gratuito no incluye esto.**

## Los dos archivos de este directorio

| Archivo | Dónde va | Qué hace |
| --- | --- | --- |
| `settings.json` | `C:\Users\<tu usuario>\.claude\settings.json` | Las reglas de permisos. Es lo que bloquea. |
| `CLAUDE.md` | En la carpeta de trabajo del proyecto | Las normas de comportamiento. Es lo que guía. |

Para llegar a la carpeta `.claude`: abre el explorador de archivos, pega
`%USERPROFILE%\.claude` en la barra de direcciones y pulsa Enter. Si no existe,
arranca Claude una vez y se crea sola.

## Qué bloquean las reglas, de verdad

`settings.json` impide que las herramientas de Claude lean:

- Claves SSH, credenciales de AWS y de Google Cloud, claves GPG
- El almacén de credenciales de Windows
- Los perfiles de Chrome, Edge y Firefox, que es donde viven las contraseñas
  guardadas del navegador
- Cualquier archivo `.env`, `.pem`, `.key`, `.p12`, `.pfx`, `id_rsa`, `.netrc`,
  `.npmrc`, `.git-credentials`
- Las carpetas `Documents\Banco` y `Documents\Privado` (créalas si quieres un
  sitio donde guardar cosas fuera de su alcance)

Y exige confirmación antes de: `git push`, subir un paquete, enviar datos por
`curl` o PowerShell, copiar archivos a otra máquina.

Además:
- `defaultMode: "default"` → **pregunta antes de ejecutar cualquier comando**
  que no sea de solo lectura. Esa es la red de seguridad de verdad.
- `disableBypassPermissionsMode: "disable"` → el modo que se salta todas las
  preguntas queda desactivado y no se puede volver a activar desde dentro.

## Lo que estas reglas NO hacen

Esto es importante y no lo voy a suavizar.

**No son una caja fuerte del sistema operativo.** Son reglas dentro del
programa. Según la documentación de Anthropic:

- Las reglas de lectura cubren las herramientas propias de Claude y los
  comandos de archivo que reconoce (`cat`, `head`, `sed`, redirecciones). **No
  cubren** un script de Python o de Node que abra archivos por su cuenta, ni un
  `grep -r` lanzado desde la carpeta que contiene el archivo.
- Bloquear la herramienta de navegación web **no corta el acceso a internet**:
  si los comandos de terminal están permitidos, `curl` o `wget` siguen pudiendo
  llegar a cualquier sitio.

Para un encierro real a nivel de sistema haría falta **WSL 2** con el modo
sandbox activado, que en Windows nativo no está disponible. Eso es una
instalación bastante más complicada.

**Traducido:** estas reglas protegen bien contra el accidente y contra el
descuido, que es el 99 % de los casos. No son un blindaje contra algo que se
proponga saltárselas.

## La protección que más vale y no está en ningún archivo

**Abre Claude solo dentro de la carpeta del proyecto.** Por defecto solo lee
dentro de la carpeta desde la que arranca. Si lo abres en `C:\Users\Pablo`,
le estás dando el ordenador entero. Si lo abres en `C:\Users\Pablo\patitas`,
ve esa carpeta y poco más.

Crea una carpeta para esto y trabaja siempre ahí.

## Y lo que no se hace nunca

**No le des tus contraseñas, ni códigos de dos pasos, ni los pegues en el chat.**
Ninguna herramienta legítima te los va a pedir. Si algo te los pide, eso solo es
el aviso de que algo va mal.
