# Pruebas de API - Módulo de Reproducción (Montas)

## Autenticación Requerida
Todas las rutas requieren el header:
```
Authorization: Bearer <token>
```

## 1. Registrar una Monta

```bash
POST http://localhost:4000/api/montas
Content-Type: application/json

{
  "hembraId": "{id-de-hembra}",
  "machoId": "{id-de-macho}",
  "fechaMonta": "2024-10-12T10:00:00Z",
  "observaciones": "Monta natural, hembra en celo"
}
```

**Respuesta:**
- Calcula automáticamente fecha estimada de parto (monta + 150 días)
- Establece tipoEvento como "GESTACION"
- Incluye datos completos de hembra y macho

## 2. Listar Todas las Montas

```bash
GET http://localhost:4000/api/montas
```

Con filtros:
```bash
GET http://localhost:4000/api/montas?hembraId={id}
GET http://localhost:4000/api/montas?machoId={id}
GET http://localhost:4000/api/montas?tipoEvento=GESTACION
GET http://localhost:4000/api/montas?tipoEvento=PARTO_EXITOSO
```

## 3. Gestaciones Activas

```bash
GET http://localhost:4000/api/montas/gestaciones-activas
```

**Devuelve:**
- Todas las montas con tipoEvento="GESTACION"
- Días restantes para el parto
- Días de gestación actuales
- Ordenadas por fecha estimada de parto

## 4. Próximos Partos

```bash
GET http://localhost:4000/api/montas/proximos-partos
GET http://localhost:4000/api/montas/proximos-partos?dias=60
```

**Devuelve:**
- Montas con parto estimado en los próximos X días (default: 30)
- Días restantes para cada parto
- Ideal para planificación y preparación

## 5. Registrar un Parto Exitoso

```bash
POST http://localhost:4000/api/montas/{id}/parto
Content-Type: application/json

{
  "fechaParto": "2025-03-12T08:30:00Z",
  "totalCrias": 2,
  "criasHembra": 1,
  "criasMacho": 1,
  "detallesCrias": [
    {
      "sexo": "HEMBRA",
      "peso": 2.8,
      "estado": "VIVO",
      "observaciones": "Cría sana, color blanco"
    },
    {
      "sexo": "MACHO",
      "peso": 3.1,
      "estado": "VIVO",
      "observaciones": "Cría sana, color marrón"
    }
  ],
  "observacionesParto": "Parto sin complicaciones",
  "asistenciaVeterinaria": false,
  "inicioProduccionLeche": true
}
```

**Acciones automáticas:**
- Cambia tipoEvento a "PARTO_EXITOSO"
- Si `inicioProduccionLeche=true` y la hembra NO es REPRODUCTORA:
  - Actualiza categoría de hembra a "REPRODUCTORA"
  - Crea registro en CambioCategoria

## 6. Registrar un Aborto

```bash
POST http://localhost:4000/api/montas/{id}/aborto
Content-Type: application/json

{
  "fechaAborto": "2025-02-15T14:00:00Z",
  "motivo": "Causa desconocida",
  "observaciones": "Hembra en buen estado de salud post-aborto"
}
```

## 7. Historial Reproductivo de una Hembra

```bash
GET http://localhost:4000/api/montas/historial/hembra/{hembraId}
```

**Devuelve:**
- Todas las montas de la hembra
- Estadísticas:
  - Total de montas
  - Total de partos exitosos
  - Total de crías (hembras y machos)
  - Total de abortos
  - Tasa de éxito (%)
  - Promedio de crías por parto

## 8. Historial Reproductivo de un Macho

```bash
GET http://localhost:4000/api/montas/historial/macho/{machoId}
```

**Devuelve:**
- Todas las montas donde participó el macho
- Estadísticas:
  - Total de montas
  - Partos exitosos
  - Total de crías generadas
  - Tasa de éxito (%)

## 9. Estadísticas Generales de Reproducción

```bash
GET http://localhost:4000/api/montas/estadisticas
```

Con filtros de fecha:
```bash
GET http://localhost:4000/api/montas/estadisticas?startDate=2024-01-01&endDate=2024-12-31
```

**Devuelve:**
- Total de montas
- Gestaciones activas
- Total de partos
- Total de abortos
- Total de crías (hembras y machos)
- Tasa de éxito general
- Promedio de crías por parto
- Top 5 machos más usados con sus estadísticas

## 10. Obtener Monta por ID

```bash
GET http://localhost:4000/api/montas/{id}
```

## 11. Actualizar Monta

```bash
PUT http://localhost:4000/api/montas/{id}
Content-Type: application/json

{
  "observaciones": "Actualización de observaciones",
  "complicaciones": "Ninguna"
}
```

## 12. Eliminar Monta

```bash
DELETE http://localhost:4000/api/montas/{id}
```

---

## Tipos de Evento

- **GESTACION**: Monta confirmada, esperando parto
- **PARTO_EXITOSO**: Parto completado exitosamente
- **ABORTO**: Gestación interrumpida
- **PARTO_COMPLICADO**: Parto con complicaciones (usar campo `complicaciones`)
- **SIN_GESTACION**: Monta que no resultó en gestación

---

## Flujo Típico de Uso

1. **Registrar monta** → Sistema calcula fecha estimada de parto
2. **Monitorear gestaciones activas** → Ver estado de todas las gestaciones
3. **Ver próximos partos** → Preparar asistencia si es necesario
4. **Registrar parto exitoso** → Sistema actualiza categoría si aplica
5. **Consultar historial** → Analizar rendimiento reproductivo

---

## Campos Calculados Automáticamente

- `fechaEstimadaParto`: monta + 150 días (gestación promedio de cabra)
- `diasRestantes`: días entre hoy y fecha estimada
- `diasGestacion`: días transcurridos desde la monta
- `machoCustomId`, `machoBreed`, `machoName`: copiados del macho al momento de la monta

---

## Próximos Pasos

✅ **Módulo de Medicamentos** - Completado
✅ **Módulo de Aplicaciones** - Completado
✅ **Módulo de Reproducción** - Completado
⏳ **Frontend** - Crear páginas web
⏳ **Sistema de Categorías Automático** - Transiciones basadas en peso
⏳ **Análisis de Razas** - Estadísticas comparativas
