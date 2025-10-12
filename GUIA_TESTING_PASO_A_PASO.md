# 🧪 GUÍA DE TESTING PASO A PASO - Medicamentos

**Fecha**: 11 de octubre de 2025  
**Módulo**: Medicamentos  
**Estado Servidores**: ✅ Backend y Frontend corriendo

---

## 📍 PASO 1: Acceder a la Página de Medicamentos

### Acción:
1. Abrir el navegador en: `http://localhost:5173`
2. Si no estás logueado, hacer login
3. En el menú lateral (Sidebar), hacer click en **"Medicamentos"** 💊

### ✅ Verificar:
- [ ] La URL cambia a `/medicamentos`
- [ ] La página carga sin errores
- [ ] El sidebar marca "Medicamentos" como activo (resaltado)

### 🐛 Si hay error:
- Abrir consola del navegador (F12)
- Buscar errores en rojo
- Reportar el error

---

## 📍 PASO 2: Verificar el Header

### ✅ Verificar que veas:
- [ ] Header con gradiente verde/teal (emerald to cyan)
- [ ] Emoji de pastilla 💊 dentro de un círculo con efecto blur
- [ ] Título: "Inventario de Medicamentos"
- [ ] Subtítulo: "Gestión de medicamentos y alertas de stock"
- [ ] Botón blanco "Nuevo Medicamento" a la derecha

### 🎨 Detalles visuales:
- [ ] El header tiene sombra
- [ ] El botón tiene efecto hover (se agranda ligeramente)
- [ ] Los textos son blancos y legibles

---

## 📍 PASO 3: Verificar las Tarjetas de Estadísticas

### ✅ Debe haber 4 tarjetas horizontales:

#### Tarjeta 1: Total Medicamentos
- [ ] Icono: 📦 en círculo verde
- [ ] Texto superior: "TOTAL MEDICAMENTOS"
- [ ] Número grande (ej: 0, 5, 10...)
- [ ] Efecto hover: se agranda ligeramente

#### Tarjeta 2: Stock Bajo
- [ ] Icono: 📉 en círculo amarillo
- [ ] Texto: "STOCK BAJO"
- [ ] Número en amarillo
- [ ] Efecto hover

#### Tarjeta 3: Por Vencer
- [ ] Icono: ⚠️ en círculo rojo
- [ ] Texto: "POR VENCER"
- [ ] Número en rojo
- [ ] Efecto hover

#### Tarjeta 4: Valor Inventario
- [ ] Icono: 📊 en círculo verde
- [ ] Texto: "VALOR INVENTARIO"
- [ ] Número con formato de dinero (ej: $450,000)
- [ ] Efecto hover

### 🎨 Detalles:
- [ ] Las tarjetas tienen bordes sutiles
- [ ] Tienen sombra
- [ ] Al pasar el mouse, aumentan de tamaño
- [ ] Los números son grandes y negros

---

## 📍 PASO 4: Verificar Barra de Búsqueda y Filtros

### ✅ Debe haber:
- [ ] Input de búsqueda con icono 🔍
- [ ] Placeholder: "Buscar medicamentos..."
- [ ] Select de filtro con icono de filtro
- [ ] Opciones en el select:
  - Todos los tipos
  - Vacunas
  - Antibióticos
  - Antiparasitarios
  - Vitaminas
  - Suplementos
  - Otros

### 🎨 Detalles:
- [ ] Bordes de 2px
- [ ] Al hacer focus, aparece un anillo verde
- [ ] Input tiene sombra sutil

---

## 📍 PASO 5: Crear el Primer Medicamento

### Acción:
1. Click en botón **"Nuevo Medicamento"**

### ✅ Debe aparecer un modal con:
- [ ] Header verde con título "Nuevo Medicamento"
- [ ] Botón X para cerrar (arriba derecha)
- [ ] Formulario con secciones:
  - Información Básica
  - Administración
  - Información del Producto
  - Inventario
  - Almacenamiento

### Llenar el formulario:

**Información Básica:**
```
Nombre: Ivermectina 1%
Tipo: ANTIPARASITARIO
Descripción: Antiparasitario de amplio espectro para control de parásitos internos y externos
```

**Administración:**
```
Dosis: 1ml por cada 50kg de peso corporal
Vía de Administración: Subcutánea
```

**Información del Producto:**
```
Fabricante: MSD Animal Health
Lote: IV2024-10
Fecha de Vencimiento: 2026-12-31
```

**Inventario:**
```
Stock Actual: 100
Stock Mínimo: 20
Unidad de Medida: ml
Precio Unitario: 45000
```

**Almacenamiento:**
```
Ubicación: Estante A-1
Condiciones: Temperatura ambiente (15-25°C)
Notas: Proteger de la luz solar directa
```

### Acción:
2. Click en botón **"Crear Medicamento"** (verde, abajo)

### ✅ Verificar:
- [ ] El botón dice "Guardando..." mientras procesa
- [ ] El modal se cierra automáticamente
- [ ] Aparece el medicamento en la tabla
- [ ] Las estadísticas se actualizan (Total Medicamentos = 1)

### 🐛 Si hay error:
- Ver consola del navegador
- Verificar que el backend esté corriendo
- Verificar la respuesta de red en DevTools > Network

---

## 📍 PASO 6: Verificar el Medicamento en la Tabla

### ✅ En la tabla debe aparecer:

**Columnas visibles:**
- [ ] **Nombre**: "Ivermectina 1%" (en negrita)
- [ ] **Tipo**: Badge verde "ANTIPARASITARIO"
- [ ] **Stock**: "100 ml" en verde, debajo "Mín: 20"
- [ ] **Dosis**: "1ml por cada 50kg de peso corporal"
- [ ] **Vencimiento**: "31/12/2026"
- [ ] **Ubicación**: "Estante A-1"
- [ ] **Acciones**: 4 botones

### 🎨 Detalles del badge de tipo:
- [ ] Fondo verde claro
- [ ] Texto verde oscuro
- [ ] Bordes redondeados
- [ ] Borde de 2px

### 🎨 Detalles del stock:
- [ ] Número en verde (porque está bien)
- [ ] Font en negrita

---

## 📍 PASO 7: Probar Búsqueda

### Acción:
1. En el input de búsqueda, escribir: **"iver"**

### ✅ Verificar:
- [ ] La tabla filtra en tiempo real
- [ ] Solo muestra medicamentos que contengan "iver"
- [ ] El filtro es case-insensitive (funciona con mayúsculas/minúsculas)

### Acción:
2. Borrar la búsqueda

### ✅ Verificar:
- [ ] Vuelven a aparecer todos los medicamentos

---

## 📍 PASO 8: Probar Filtro por Tipo

### Acción:
1. En el select, elegir: **"Antiparasitarios"**

### ✅ Verificar:
- [ ] Solo muestra medicamentos de tipo ANTIPARASITARIO
- [ ] El contador en estadísticas se mantiene correcto

### Acción:
2. Cambiar a: **"Todos los tipos"**

### ✅ Verificar:
- [ ] Vuelven a aparecer todos

---

## 📍 PASO 9: Editar el Medicamento

### Acción:
1. Click en el botón de editar (✏️ azul) en la fila del medicamento

### ✅ Debe aparecer modal con:
- [ ] Título: "Editar Medicamento"
- [ ] Todos los campos precargados con los datos
- [ ] Botón dice: "Actualizar"

### Acción:
2. Cambiar el stock mínimo a: **30**
3. Click en **"Actualizar"**

### ✅ Verificar:
- [ ] El modal se cierra
- [ ] En la tabla, ahora dice "Mín: 30"
- [ ] Las estadísticas se actualizan (puede que ahora esté en Stock Bajo)

---

## 📍 PASO 10: Incrementar Stock

### Acción:
1. Click en el botón verde con ➕ (PlusCircle)

### ✅ Debe aparecer modal:
- [ ] Título: "Ajustar Stock"
- [ ] Muestra el medicamento: "Ivermectina 1%"
- [ ] Stock Actual: "100 ml"
- [ ] Botón "Incrementar" seleccionado (verde)
- [ ] Botón "Decrementar" (gris)

### Acción:
2. En cantidad, escribir: **50**
3. En motivo (opcional): **"Compra nueva - Lote IV2024-11"**
4. Click en **"Incrementar"**

### ✅ Verificar:
- [ ] El modal muestra "Stock Resultante: 150 ml"
- [ ] Si está sobre el mínimo, el fondo es verde
- [ ] Click en botón verde "Incrementar"
- [ ] El modal se cierra
- [ ] En la tabla, el stock ahora es: "150 ml"

---

## 📍 PASO 11: Decrementar Stock

### Acción:
1. Click en el botón amarillo con ➖ (MinusCircle)

### ✅ Debe aparecer modal:
- [ ] Mismo modal de ajuste
- [ ] Click en botón "Decrementar"
- [ ] El botón cambia a rojo

### Acción:
2. En cantidad, escribir: **120**
3. En motivo: **"Aplicación masiva - 60 cabras"**
4. Click en **"Decrementar"** (botón rojo)

### ✅ Verificar:
- [ ] Stock Resultante: "30 ml"
- [ ] El fondo es amarillo/rojo (porque está en el mínimo)
- [ ] Muestra alerta: "⚠️ El stock quedará por debajo del mínimo"
- [ ] Proceder con decrementar
- [ ] En la tabla, stock ahora: "30 ml" en amarillo

---

## 📍 PASO 12: Verificar Alertas Automáticas

### ✅ Debe aparecer sección de alertas:
- [ ] Título: "⚠️ Alertas"
- [ ] Card amarillo/naranja
- [ ] Mensaje: "Ivermectina 1% - Stock bajo (30 unidades)"
- [ ] Badge: "STOCK_BAJO"

### ✅ Estadísticas actualizadas:
- [ ] "Stock Bajo" debe ser: 1

---

## 📍 PASO 13: Crear Medicamento con Stock Crítico

### Acción:
1. Click en **"Nuevo Medicamento"**
2. Llenar:

```
Nombre: Vitamina B12
Tipo: VITAMINA
Dosis: 5ml por animal
Vía: Intramuscular
Stock Actual: 5
Stock Mínimo: 20
Unidad: frascos
```

3. Click en **"Crear Medicamento"**

### ✅ Verificar:
- [ ] Aparece en la tabla
- [ ] El stock sale en **ROJO** (5 frascos)
- [ ] En alertas aparece: "🔴 Vitamina B12 - Stock crítico (5 unidades)"
- [ ] La alerta es ROJA (prioridad ALTA)
- [ ] Estadística "Stock Bajo" = 2

---

## 📍 PASO 14: Crear Medicamento Próximo a Vencer

### Acción:
1. Crear nuevo medicamento:

```
Nombre: Penicilina G
Tipo: ANTIBIOTICO
Dosis: 3ml cada 12 horas
Vía: Intramuscular
Fecha Vencimiento: 2025-10-25  (14 días desde hoy)
Stock Actual: 30
Stock Mínimo: 10
Unidad: frascos
```

2. Click en **"Crear"**

### ✅ Verificar:
- [ ] Aparece en alertas: "🟡 Penicilina G - Próximo a vencer (14 días)"
- [ ] La alerta es amarilla/naranja
- [ ] Estadística "Por Vencer" = 1

---

## 📍 PASO 15: Eliminar Medicamento

### Acción:
1. Click en botón rojo 🗑️ (basura) de cualquier medicamento

### ✅ Debe aparecer:
- [ ] Confirmación (puede ser un confirm del navegador o modal)
- [ ] Mensaje: "¿Estás seguro de eliminar este medicamento?"

### Acción:
2. Confirmar eliminación

### ✅ Verificar:
- [ ] El medicamento desaparece de la tabla
- [ ] Las estadísticas se actualizan
- [ ] Si era el único en alertas, la sección de alertas puede desaparecer

---

## 📍 PASO 16: Probar Validaciones

### Acción:
1. Click en **"Nuevo Medicamento"**
2. Intentar guardar sin llenar campos requeridos (*)

### ✅ Verificar:
- [ ] No permite guardar
- [ ] Muestra mensajes de error en campos vacíos
- [ ] Los campos requeridos están marcados con *

### Acción:
3. En modal de ajuste de stock, intentar decrementar más del stock actual

### ✅ Verificar:
- [ ] Muestra mensaje: "Cantidad mayor al stock disponible"
- [ ] El botón se deshabilita
- [ ] No permite guardar

---

## 📍 PASO 17: Probar Estado Vacío

### Acción:
1. Eliminar todos los medicamentos

### ✅ Verificar:
- [ ] Aparece estado vacío
- [ ] Icono grande de pastilla 💊
- [ ] Título: "No hay medicamentos registrados"
- [ ] Mensaje descriptivo
- [ ] Diseño atractivo con gradiente

---

## 📍 PASO 18: Responsive - Móvil

### Acción:
1. En DevTools (F12), activar modo responsive
2. Cambiar a tamaño móvil (375px width)

### ✅ Verificar:
- [ ] El header se adapta (botón puede ir abajo)
- [ ] Las tarjetas cambian a 1 columna
- [ ] La tabla tiene scroll horizontal
- [ ] Los modales se ven bien
- [ ] Los botones son tocables (mínimo 44px)

---

## 📍 PASO 19: Performance

### ✅ Verificar:
- [ ] La página carga en menos de 2 segundos
- [ ] La búsqueda no tiene lag
- [ ] Las animaciones son suaves
- [ ] No hay errores en consola
- [ ] No hay warnings de React

---

## 📍 PASO 20: Verificar Integración Backend

### Acción:
1. Abrir DevTools > Network
2. Crear un medicamento nuevo
3. Ver las peticiones

### ✅ Verificar:
- [ ] `POST /api/medicamentos` - Status 200 o 201
- [ ] `GET /api/medicamentos` - Se ejecuta después del POST
- [ ] `GET /api/medicamentos/estadisticas` - Se actualiza
- [ ] `GET /api/medicamentos/alertas` - Se actualiza
- [ ] No hay errores 401, 403, 500, etc.

---

## ✅ RESUMEN FINAL

### Funcionalidades Probadas:
- [x] Vista principal
- [x] Estadísticas
- [x] Búsqueda
- [x] Filtros
- [x] Crear medicamento
- [x] Editar medicamento
- [x] Incrementar stock
- [x] Decrementar stock
- [x] Eliminar medicamento
- [x] Alertas automáticas
- [x] Validaciones
- [x] Estado vacío
- [x] Responsive
- [x] Performance
- [x] Integración backend

### Si TODO funciona correctamente:
✅ **Módulo de Medicamentos 100% Funcional**

### Próximo paso:
🚀 Continuar con **Módulo de Aplicaciones de Medicamentos**

---

**Tester**: [Tu Nombre]  
**Fecha**: 11 de octubre de 2025  
**Resultado**: ⬜ Pendiente / ✅ Aprobado / ❌ Con errores
