# Pruebas de API - Módulo Medicamentos

## Autenticación Requerida
Todas las rutas requieren el header:
```
Authorization: Bearer <token>
```

## 1. Crear Medicamento

```bash
POST http://localhost:4000/api/medicamentos
Content-Type: application/json

{
  "nombre": "Ivermectina",
  "tipo": "ANTIPARASITARIO",
  "descripcion": "Antiparasitario de amplio espectro",
  "dosis": "1ml por 50kg",
  "viaAdministracion": "Subcutánea",
  "fabricante": "Laboratorios Veterinarios S.A.",
  "lote": "IV2024-001",
  "fechaVencimiento": "2025-12-31",
  "stockActual": 100,
  "stockMinimo": 20,
  "unidadMedida": "ml",
  "precioUnitario": 2.50,
  "ubicacionAlmacen": "Estante A-1"
}
```

## 2. Listar Medicamentos

```bash
GET http://localhost:4000/api/medicamentos
```

Con filtros:
```bash
GET http://localhost:4000/api/medicamentos?tipo=ANTIPARASITARIO
GET http://localhost:4000/api/medicamentos?activo=true
```

## 3. Obtener Alertas

```bash
GET http://localhost:4000/api/medicamentos/alertas
```

Devuelve:
- Medicamentos vencidos o por vencer
- Medicamentos con stock bajo
- Medicamentos con stock crítico

## 4. Obtener Estadísticas

```bash
GET http://localhost:4000/api/medicamentos/estadisticas
```

Devuelve:
- Total de medicamentos
- Total de aplicaciones
- Medicamentos por tipo
- Stock bajo
- Próximos a vencer
- Valor total del inventario

## 5. Obtener Medicamento por ID

```bash
GET http://localhost:4000/api/medicamentos/{id}
```

## 6. Actualizar Stock

```bash
PATCH http://localhost:4000/api/medicamentos/{id}/stock
Content-Type: application/json

{
  "cantidad": 50,
  "operacion": "INCREMENTAR"
}
```

O decrementar:
```bash
{
  "cantidad": 10,
  "operacion": "DECREMENTAR"
}
```

## 7. Actualizar Medicamento

```bash
PUT http://localhost:4000/api/medicamentos/{id}
Content-Type: application/json

{
  "stockMinimo": 30,
  "ubicacionAlmacen": "Estante B-2"
}
```

## 8. Eliminar Medicamento (Soft Delete)

```bash
DELETE http://localhost:4000/api/medicamentos/{id}
```

---

# Pruebas de API - Aplicaciones de Medicamentos

## 1. Crear Aplicación

```bash
POST http://localhost:4000/api/aplicaciones
Content-Type: application/json

{
  "goatId": "{id-de-cabra}",
  "medicamentoId": "{id-de-medicamento}",
  "dosis": "2ml",
  "viaAdministrada": "Subcutánea",
  "motivo": "Desparasitación rutinaria",
  "aplicadoPor": "Dr. García",
  "fechaAplicacion": "2024-10-12T10:30:00Z"
}
```

## 2. Aplicación Masiva (Vacunación)

```bash
POST http://localhost:4000/api/aplicaciones/bulk
Content-Type: application/json

{
  "goatIds": ["{id1}", "{id2}", "{id3}"],
  "medicamentoId": "{id-vacuna}",
  "dosis": "1ml",
  "viaAdministrada": "Intramuscular",
  "motivo": "Campaña de vacunación",
  "aplicadoPor": "Equipo veterinario"
}
```

## 3. Listar Aplicaciones

```bash
GET http://localhost:4000/api/aplicaciones
```

Con filtros:
```bash
GET http://localhost:4000/api/aplicaciones?goatId={id}
GET http://localhost:4000/api/aplicaciones?medicamentoId={id}
GET http://localhost:4000/api/aplicaciones?startDate=2024-01-01
GET http://localhost:4000/api/aplicaciones?endDate=2024-12-31
```

## 4. Próximas Dosis

```bash
GET http://localhost:4000/api/aplicaciones/proximas-dosis
GET http://localhost:4000/api/aplicaciones/proximas-dosis?dias=60
```

## 5. Estadísticas de Aplicaciones

```bash
GET http://localhost:4000/api/aplicaciones/estadisticas
```

Con filtros de fecha:
```bash
GET http://localhost:4000/api/aplicaciones/estadisticas?startDate=2024-01-01&endDate=2024-12-31
```

## 6. Obtener Aplicación por ID

```bash
GET http://localhost:4000/api/aplicaciones/{id}
```

## 7. Actualizar Aplicación

```bash
PUT http://localhost:4000/api/aplicaciones/{id}
Content-Type: application/json

{
  "efectividad": "ALTA",
  "observaciones": "Sin reacciones adversas"
}
```

## 8. Eliminar Aplicación

```bash
DELETE http://localhost:4000/api/aplicaciones/{id}
```

---

## Próximos Pasos

1. ✅ Backend Medicamentos completado
2. ✅ Backend Aplicaciones completado
3. 🔄 Siguiente: Módulo de Reproducción (Monta)
4. ⏳ Luego: Frontend para ambos módulos
