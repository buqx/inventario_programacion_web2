# Inventario Pro

Sistema básico de gestión comercial construido con Angular 19, Spring Boot 3.4, Java 21 y MySQL 8.4.

## Arquitectura
- `frontend/`: vistas standalone de administrador y cliente, servicios HTTP centralizados y Nginx como proxy `/api`.
- `backend/`: controladores, servicios transaccionales, repositorios JPA, entidades, DTOs y manejo global de errores.
- `mysql/`: inicialización SQL y volumen persistente.
- Entidades: `Producto`, `Cliente`, `Venta`, `DetalleVenta`, `Factura`.

## Ejecución
```bash
docker compose up --build -d
```

Abrir:
- Aplicación: http://localhost:4200
- API: http://localhost:8080/api
- Health: http://localhost:8080/actuator/health

## Flujo de prueba
1. Abrir Administrador y crear un producto o cliente.
2. Abrir Catálogo cliente, seleccionar cliente y comprar.
3. Confirmar que la venta descuenta stock y genera factura.
4. Volver a Administrador para ver inventario y ventas.

## Endpoints principales
- `GET /api/productos`, `GET /api/productos/catalogo`, `POST /api/productos`
- `GET /api/clientes`, `POST /api/clientes`
- `GET /api/ventas`, `POST /api/ventas`

## Ejemplo de venta
```json
{"clienteId":1,"items":[{"productoId":1,"cantidad":1}]}
```
