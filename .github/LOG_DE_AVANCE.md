# Log de Avance del Proyecto

> Bitácora cronológica de acciones, comandos, problemas y soluciones.

---

## 2025-08-21

- **[Punto 1]** Definición de arquitectura y stack tecnológico (Angular PWA + NestJS + PostgreSQL + Docker).
- **[Punto 2]** Creación de carpetas base `frontend/` y `backend/`.
- **[Punto 2]** Inicialización de Angular en `frontend`.
  - Comando: `npx @angular/cli@latest new frontend --strict --routing --style=scss --skip-git`
  - Problema: Error por nombre de proyecto `.` no válido. Solución: usar nombre `frontend`.
  - Problema: Comando `ng` no reconocido. Solución: usar `npx` o instalar Angular CLI global.
- **[Punto 2]** Inicialización de NestJS en `backend`.
  - Comando: `npx @nestjs/cli@latest new backend --strict --skip-git`
- **[Punto 2]** Decisión de usar `pnpm` como gestor de paquetes.
- **[Punto 2]** Instalación de dependencias faltantes en backend:
  - Comando: `pnpm add typeorm pg dotenv @nestjs/typeorm @nestjs/config`
- **[Punto 2]** Creación de `docker-compose.yml` para PostgreSQL.
  - Problema: Puerto 5432 ocupado. Solución: cambiar a 5433 en Docker y `.env`.
  - Comando: `docker-compose up -d db`
- **[Punto 2]** Creación de `.env` y configuración de TypeORM en NestJS.
- **[Punto 2]** Creación de entidad `User` y módulo correspondiente.
- **[Punto 2]** Validación de conexión exitosa a la base de datos.
  - Problema: Intento de conexión antes de levantar Docker. Solución: reordenar pasos.

## 2025-08-22

- **[Punto 3]** Configuración de migraciones con TypeORM en backend (NestJS).
  - Creación de carpeta `backend/migrations` para almacenar migraciones versionadas.
  - Ajuste de la ruta de migraciones en `ormconfig.ts` para apuntar a la carpeta correcta.
  - Agregado de scripts en `package.json` para:
    - `migration:generate`: Generar migraciones (ajustado para compatibilidad Windows, se debe pasar el nombre manualmente).
    - `migration:run`: Ejecutar migraciones pendientes.
    - `migration:revert`: Revertir la última migración.
  - **Problema multiplataforma:** La sintaxis `$(date ...)` y `$(npm_package_name)` no funciona en PowerShell/cmd. Solución: dejar el script limpio y pasar el nombre manualmente, ejemplo:
    - `pnpm run migration:generate -- ./migrations/UserInit`
  - Generación exitosa de la migración inicial para la entidad `User`.
  - Ejecución de la migración en la base de datos Docker:
    - Comando: `pnpm run migration:run`
  - Resultado: Tabla `User` creada correctamente en la base de datos PostgreSQL.

---

> Este log se irá actualizando con cada avance, comando, problema y solución relevante.
