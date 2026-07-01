import { DataSource } from 'typeorm';

import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';
import { RolePermission } from '../role-permission/role-permission.entity';
import { NestFactory } from '@nestjs/core/nest-factory';
import { AppModule } from '../app.module';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  // Roles base
  const roles = [
    { name: 'ROOT', description: 'Superusuario del sistema' },
    { name: 'SUPERVISOR', description: 'Supervisor de local' },
    { name: 'WORKER', description: 'Empleado' },
  ];

  // Recursos principales del sistema
  const resources = [
    { name: 'User', description: 'Usuarios del sistema' },
    { name: 'Role', description: 'Roles de usuario' },
    { name: 'Permission', description: 'Permisos granulares' },
    { name: 'LocationUser', description: 'Usuarios asignados a locales' },
    { name: 'Location', description: 'Locales físicos' },
    { name: 'CheckIn', description: 'Fichajes de ingreso/salida' },
  ];

  // Acciones estándar
  const actions = [
    { key: 'create', label: 'Crear' },
    { key: 'read', label: 'Ver' },
    { key: 'update', label: 'Actualizar' },
    { key: 'delete', label: 'Eliminar' },
    { key: 'full', label: 'Acceso total' },
  ];

  // Generar todos los permisos posibles
  const permissions = resources.flatMap((resource) =>
    actions.map((action) => ({
      name: `${resource.name}:${action.key}`,
      description: `${action.label} ${resource.description}`,
    })),
  );

  // Insert roles
  for (const r of roles) {
    await dataSource.getRepository(Role).upsert(r, ['name']);
  }

  // Insert permissions
  for (const p of permissions) {
    await dataSource.getRepository(Permission).upsert(p, ['name']);
  }

  // Asociar permisos a roles (ejemplo: ROOT tiene todos, SUPERVISOR algunos, WORKER solo fichaje)
  const allPerms = await dataSource.getRepository(Permission).find();
  const root = await dataSource.getRepository(Role).findOneBy({ name: 'ROOT' });
  const supervisor = await dataSource
    .getRepository(Role)
    .findOneBy({ name: 'SUPERVISOR' });
  const worker = await dataSource
    .getRepository(Role)
    .findOneBy({ name: 'WORKER' });

  // Limpia asociaciones previas
  await dataSource.getRepository(RolePermission).clear();

  // ROOT: solo permisos 'full' de cada recurso
  for (const perm of allPerms.filter((p) => p.name.endsWith(':full'))) {
    await dataSource
      .getRepository(RolePermission)
      .upsert({ roleId: root?.id, permissionId: perm.id }, [
        'roleId',
        'permissionId',
      ]);
  }
  // SUPERVISOR: solo permisos CRUD (sin 'full') de cada recurso
  for (const perm of allPerms.filter((p) => !p.name.endsWith(':full'))) {
    await dataSource
      .getRepository(RolePermission)
      .upsert({ roleId: supervisor?.id, permissionId: perm.id }, [
        'roleId',
        'permissionId',
      ]);
  }
  // WORKER: solo fichaje
  for (const perm of allPerms.filter(
    (p) => p.name === 'CheckIn:create' || p.name === 'CheckIn:read',
  )) {
    await dataSource
      .getRepository(RolePermission)
      .upsert({ roleId: worker?.id, permissionId: perm.id }, [
        'roleId',
        'permissionId',
      ]);
  }

  await dataSource.destroy();
  //console.log('Seed de roles y permisos completado.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
