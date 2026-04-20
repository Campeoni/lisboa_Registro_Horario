# Plan de Acción General

## 1. Definir arquitectura y stack tecnológico

- [x] Angular PWA + NestJS + PostgreSQL + Docker

## 2. Inicializar repositorios y proyectos base (Angular y NestJS, ambos dockerizados)

- [x] Crear estructura base del monorepo (frontend/backend)
- [x] Inicializar Angular y NestJS
- [x] Configurar Docker y PostgreSQL
- [x] Configurar TypeORM y conexión a la base de datos
- [x] Validar conexión y entidades base
- [x] Configurar migraciones TypeORM
- [ ] Configurar Dockerfile para backend
- [x] Configurar Prettier + ESLint (endOfLine: lf, singleQuote, trailingComma)
- [x] Configurar `.editorconfig` y `.gitattributes` para LF en todo el monorepo
- [x] Configurar `.vscode/settings.json` (formatOnSave, files.eol)
- [ ] Agregar validadores de código (husky, lint-staged, commitlint)
- [ ] Agregar templates y workflows de GitHub

### Subplan Detallado del Punto 2

#### Acciones realizadas y decisiones tomadas

- Se creó la estructura de carpetas `frontend/` y `backend/` en la raíz.
- Se inicializó Angular en `frontend` y NestJS en `backend`.
- Se decidió usar pnpm como gestor de paquetes por eficiencia en monorepos.
- Se creó un `docker-compose.yml` para levantar PostgreSQL en Docker.
- Se configuró TypeORM en NestJS usando variables de entorno.
- Se creó una entidad `User` de ejemplo para validar la conexión.
- Se detectó que el puerto 5432 ya estaba en uso, por lo que se cambió a 5433 en Docker y en `.env`.
- Se corrigió el orden de los pasos: primero levantar Docker, luego probar la conexión.
- Se instalaron dependencias faltantes (`typeorm`, `pg`, `dotenv`, `@nestjs/typeorm`, `@nestjs/config`).
- Se documentó cada error y solución aplicada.

#### Problemas encontrados

- Error de puerto ocupado al levantar PostgreSQL en Docker (`port is already allocated`).
- Faltaban dependencias de TypeORM y dotenv.
- Intento de conexión a la base de datos antes de levantar el contenedor Docker.
- Error de nombre de proyecto al crear Angular (`.` no es válido).
- Comando `ng` no reconocido por falta de instalación global de Angular CLI.

#### Soluciones aplicadas

- Cambio de puerto a 5433 y actualización de `.env` y `docker-compose.yml`.
- Instalación de dependencias necesarias con pnpm.
- Reordenamiento de pasos para asegurar que Docker esté corriendo antes de probar la conexión.
- Uso de `npx` para comandos Angular/NestJS si no están instalados globalmente.

---

## 3. Modelar base de datos y entidades principales (usuarios, roles, permisos, locales, fichajes, huellas, etc.)

- [x] Definir modelo de datos inicial y relaciones principales
- [x] Crear entidades: Role, Permission, RolePermission, User (con roleId)
- [x] Generar migraciones para cada entidad y relaciones
- [x] Modularizar backend con DatabaseModule y módulos por entidad
- [x] Crear y ejecutar seed de roles y permisos (con lógica profesional y reproducible)
- [x] Validar migraciones y seed en base de datos Docker
- [x] Crear entidades: Location, CheckIn, Fingerprint
- [x] Crear entidades pivot: LocationUser
- [x] Migraciones generadas y aplicadas para todas las entidades
- [x] DTOs con validación (`class-validator`) para Location y CheckIn
- [x] Módulos completos (controller + service) para Location y CheckIn
- [x] Entidad `Fingerprint` creada con soporte WebAuthn/PIN/biométrico — migración aplicada

### Subplan Detallado del Punto 3

- **Entidades principales:**
  - User (ya creada, ahora con campo `roleId` FK a Role)
  - Role (ROOT, SUPERVISOR, WORKER, etc.)
  - Permission (permiso granular, ej: LocationUser:read, CheckIn:create)
  - Location (local físico)
  - CheckIn (registro de fichaje: entrada/salida)
  - Fingerprint (huella biométrica o credencial WebAuthn)
  - RolePermission (relación N:M entre roles y permisos)
  - LocationUser (relación N:M entre usuarios y locales, si aplica)

- **Relaciones clave:**
  - Un usuario tiene un solo rol (campo `roleId` en User)
  - Un rol puede tener muchos permisos (N:M con Permission)
  - Un usuario puede estar asignado a uno o varios locales
  - Un fichaje pertenece a un usuario y a un local
  - Un usuario puede tener una o varias huellas/credenciales

- **Orden recomendado:**
  1.  Role
  2.  Permission
  3.  RolePermission
  4.  Location
  5.  LocationUser
  6.  CheckIn
  7.  Fingerprint

- **Notas:**
  - Se recomienda crear primero las entidades simples y luego las relaciones N:M.
  - Las migraciones deben generarse y probarse tras cada entidad/relación.
  - Documentar cualquier decisión de modelado o ajuste sobre la marcha.

## 4. Implementar registro y login de usuario (con roles)

- [x] Instalar dependencias: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`
- [x] `UserService` con `findByEmail`, `findById`, `create` (bcrypt hash)
- [x] `AuthService` con `register()` y `login()`
- [x] DTOs: `RegisterDto`, `LoginDto` con validaciones
- [x] `JwtStrategy` — valida token y adjunta User al request
- [x] `JwtAuthGuard` — protege rutas que requieren autenticación
- [x] `RolesGuard` + decorador `@Roles()` — control de acceso por rol
- [x] `AuthController` — `POST /auth/register`, `POST /auth/login`
- [x] `AuthModule` registrado en `AppModule`
- [x] Guards aplicados a endpoints de Location y CheckIn
- [x] `JWT_SECRET` y `JWT_EXPIRES_IN` en `.env`
- [x] Swagger actualizado con `ApiBearerAuth` y módulos Auth/Location/CheckIn

## 5. Implementar enrolamiento y validación de huella (WebAuthn)

- [ ] ...

## 6. Implementar lógica de geolocalización y validación de radio

- [ ] ...

## 7. Implementar generación y validación de QR dinámico por local

- [ ] ...

## 8. Implementar flujo de fichaje (ingreso/salida, marcas especiales)

- [ ] ...

## 9. Implementar PWA (manifest, service worker, push notifications)

- [ ] ...

## 10. Implementar panel básico para administración de usuarios/locales

- [ ] ...

## 11. Testeo, validación y ajustes finales

- [ ] ...

---

> Este documento se irá actualizando a medida que avancemos, registrando subplanes, problemas y decisiones relevantes.
