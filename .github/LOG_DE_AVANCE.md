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

## 2025-08-25

- Creación de entidades: `Role`, `Permission`, `RolePermission` (pivot N:M), y relación `roleId` en `User`.
- Generación y ejecución de migraciones para crear las tablas y relaciones.
- Validación de base de datos limpia y conectada tras reinicio de Docker y recreación de volumen.
- Prueba de conexión exitosa desde DBeaver y desde backend.
- Documentación y actualización del plan de acción y subplan con el modelo de roles/permisos profesional.
- Estado: Listo para poblar roles/permisos base (seed) y avanzar con nuevas entidades.

## 2025-08-26

- **[Punto 3]** Corrección de imports relativos en `database.module.ts` para compatibilidad con scripts y ts-node.
- **[Punto 3]** Ejecución exitosa del seed de roles y permisos (`pnpm run seed:roles-permissions`).
  - Problema: Error `Cannot find module 'src/user/user.entity'` al ejecutar el seed. Solución: cambiar imports absolutos a relativos.
  - Resultado: Base de datos poblada correctamente con roles y permisos iniciales.

## 2025-09-07

- **[Punto 3]** Implementación inicial de entidades relacionadas con locales:
  - Se crearon las entidades `Location`, `LocationUser` y `CheckIn` con sus módulos, servicio y controlador mínimos en `src/`.
  - Estas entidades fueron registradas en `DatabaseModule` para detección por TypeORM y generación de migraciones.
  - Estado: migración generada y aplicada; tablas físicas `location` y `location_user` (y `check_in`) creadas en la base de datos.
  - Nota: seed de `Location` descartada por ahora (según indicación del equipo).
  - Próximo paso recomendado: crear DTOs y documentación de respuestas; implementar la entidad `Fingerprint` cuando se decida su alcance.

## 2026-04-14

- **[Punto 2/Infra]** Configuración de calidad de código y entorno:
  - Agregado `endOfLine: lf` a `backend/.prettierrc` para evitar errores `Delete '␍'` en Windows.
  - Creado `.editorconfig` en la raíz del monorepo con `end_of_line = lf`.
  - Creado `.gitattributes` con `* text=auto eol=lf` para normalizar line endings en Git.
  - Actualizado `.vscode/settings.json` con `formatOnSave`, `files.eol: \n` y `source.fixAll.eslint`.
  - Normalización masiva de todos los `.ts` existentes con `prettier --write`.
  - Agregado `ValidationPipe` global (`whitelist: true`, `transform: true`) en `main.ts`.
  - Actualizado `backend/README.md` con instrucciones completas de arranque (Docker, migraciones, seed, Swagger).

- **[Punto 3]** Cierre de deuda técnica en entidades y módulos:
  - Instalado `class-validator` y `class-transformer`.
  - Creados DTOs con validaciones para `Location`: `CreateLocationDto`, `AssignUserDto`.
  - `LocationService` actualizado para usar `CreateLocationDto` en lugar de `Partial<Location>`.
  - Creado módulo completo `CheckIn`: service, controller, DTOs con validaciones.
    - Endpoints: `GET /check-ins`, `GET /check-ins/user/:id`, `GET /check-ins/location/:id`, `POST /check-ins`.
  - Creada entidad `Fingerprint` (campos: userId, type, credential, credentialId, isActive, meta).
    - Migración generada y aplicada — tabla `fingerprint` creada en DB.
    - Registrada en `DatabaseModule`.
  - Registrados `UserModule`, `RoleModule`, `PermissionModule`, `CheckInModule` en `AppModule`.

- **[Punto 4]** Implementación de Auth (registro, login, JWT, guards por rol):
  - Instalado: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt` + types.
  - Creado `UserService` con `findByEmail`, `findById`, `create` (hash bcrypt con salt 10).
  - Creado `AuthService` con `register()` y `login()` — lanza `UnauthorizedException` en credenciales inválidas.
  - Creados `RegisterDto` y `LoginDto` con validaciones (`class-validator`).
  - Creada `JwtStrategy` — extrae token del header Bearer, valida user activo, adjunta al request.
  - Creado `JwtAuthGuard` — wrapper de `AuthGuard('jwt')` de Passport.
  - Creado `RolesGuard` — lee metadata `@Roles()` y valida `user.role.name`.
  - Creado decorador `@Roles(...roles)` basado en `SetMetadata`.
  - Creado `AuthController` con `POST /auth/register` y `POST /auth/login`.
  - Creado `AuthModule` — registra `JwtModule`, `PassportModule`, `JwtStrategy`, `JwtAuthGuard`.
  - `AuthModule` importado en `AppModule`.
  - Guards aplicados:
    - `Location GET` → `JwtAuthGuard` (cualquier usuario autenticado)
    - `Location POST /create` y `POST /assign` → `JwtAuthGuard` + `RolesGuard` + `@Roles('ROOT', 'SUPERVISOR')`
    - `CheckIn` todos los endpoints → `JwtAuthGuard`
  - Variables `JWT_SECRET` y `JWT_EXPIRES_IN=8h` agregadas a `.env`.
  - Problema: `signOptions.expiresIn` — tipo estricto de `@nestjs/jwt`. Solución: cast a template literal type.
  - Swagger actualizado: `AuthModule` incluido en `include[]`, `ApiBearerAuth` en controllers protegidos.

> Este log se irá actualizando con cada avance, comando, problema y solución relevante.
