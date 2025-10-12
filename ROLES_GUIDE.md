# 🔐 Guía de Roles del Sistema Granme

## 📋 Descripción General

El sistema Granme utiliza 3 niveles de roles para controlar el acceso y permisos de los usuarios.

---

## 🎭 Tipos de Roles

### 1️⃣ 👁️ VIEWER (Visor)
**Nivel de Acceso:** Solo Lectura

**Permisos:**
- ✅ Ver todas las secciones del sistema
- ✅ Consultar información de cabras
- ✅ Ver reportes y estadísticas
- ✅ Visualizar ventas
- ✅ Ver productos y proveedores
- ❌ **NO PUEDE** crear, editar o eliminar registros
- ❌ **NO PUEDE** modificar configuraciones

**Ideal para:**
- Visitantes temporales
- Auditores externos
- Personal de consulta

---

### 2️⃣ 👤 USER (Usuario)
**Nivel de Acceso:** Lectura y Escritura

**Permisos:**
- ✅ Todos los permisos de VIEWER
- ✅ Crear nuevas cabras
- ✅ Editar información de cabras
- ✅ Registrar ventas
- ✅ Agregar productos
- ✅ Gestionar proveedores
- ✅ Generar reportes PDF
- ⚠️ **LIMITADO:** No puede eliminar registros críticos
- ❌ **NO PUEDE** gestionar otros usuarios
- ❌ **NO PUEDE** cambiar configuraciones del sistema

**Ideal para:**
- Personal operativo de la granja
- Empleados de confianza
- Encargados de área

---

### 3️⃣ 👑 ADMIN (Administrador)
**Nivel de Acceso:** Control Total

**Permisos:**
- ✅ Todos los permisos de USER
- ✅ Eliminar cualquier registro
- ✅ Gestionar usuarios (crear, editar, eliminar)
- ✅ Cambiar configuraciones del sistema
- ✅ Acceso completo a todas las funcionalidades
- ✅ Modificar roles de otros usuarios
- ✅ Ver logs del sistema

**Ideal para:**
- Propietarios de la granja
- Gerentes generales
- Administradores del sistema

---

## 🆕 Cómo Asignar un Rol al Registrarse

### Desde la Página de Registro (`/register`)

1. **Completa tus datos:**
   - Nombre completo
   - Correo electrónico
   - Contraseña (mín. 6 caracteres)
   - Confirmar contraseña

2. **Selecciona tu rol:**
   - Verás 3 tarjetas visuales con los roles disponibles
   - Haz clic en la tarjeta del rol que deseas
   - La tarjeta seleccionada se resaltará con color

3. **Confirma tu selección:**
   - Aparecerá un mensaje verde confirmando el rol seleccionado
   - Por defecto está seleccionado **USER**

4. **Crea tu cuenta:**
   - Haz clic en "CREAR CUENTA"
   - Serás redirigido al sistema con el rol que elegiste

---

## 🎨 Selector Visual de Roles

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│     👁️      │  │     👤      │  │     👑      │
│             │  │             │  │             │
│   VISOR     │  │  USUARIO    │  │    ADMIN    │
│             │  │             │  │             │
│ Solo lectura│  │  Permisos   │  │  Control    │
│             │  │  estándar   │  │   total     │
└─────────────┘  └─────────────┘  └─────────────┘
    (Azul)          (Verde)         (Morado)
```

---

## 🔄 Cambiar de Rol

**Opción 1: Durante el registro**
- Selecciona el rol deseado en el selector visual

**Opción 2: Después de registrado**
- Solo un usuario **ADMIN** puede cambiar el rol de otros usuarios
- No puedes cambiar tu propio rol (seguridad)

---

## 📊 Matriz de Permisos

| Función                    | VIEWER | USER | ADMIN |
|---------------------------|--------|------|-------|
| Ver información           |   ✅   |  ✅  |  ✅   |
| Crear registros           |   ❌   |  ✅  |  ✅   |
| Editar registros          |   ❌   |  ✅  |  ✅   |
| Eliminar registros        |   ❌   |  ❌  |  ✅   |
| Generar reportes PDF      |   ✅   |  ✅  |  ✅   |
| Gestionar usuarios        |   ❌   |  ❌  |  ✅   |
| Configurar sistema        |   ❌   |  ❌  |  ✅   |

---

## 🛡️ Seguridad

- Los roles están validados tanto en el **frontend** como en el **backend**
- El token JWT incluye el rol del usuario
- Cada petición al servidor verifica el rol antes de ejecutar acciones
- No es posible escalar privilegios sin autenticación

---

## 💡 Recomendaciones

1. **Primer usuario:** Regístrate como ADMIN para tener control total
2. **Personal nuevo:** Regístralos como USER inicialmente
3. **Visitantes:** Usa el rol VIEWER para demostrar el sistema
4. **Seguridad:** Cambia contraseñas periódicamente
5. **Auditoría:** Revisa los logs de acciones críticas

---

## 🚀 Estado Actual

**✅ Implementado:**
- Selector visual de roles en el registro
- Validación de roles en backend
- Token JWT con información de rol
- Diferenciación visual en el dashboard

**📝 Pendiente (opcional):**
- Middleware de autorización por ruta
- Página de gestión de usuarios (solo ADMIN)
- Logs de auditoría detallados
- Permisos granulares por funcionalidad

---

**Última actualización:** 11 de Octubre de 2025  
**Sistema:** Granme CAPRI v1.0
