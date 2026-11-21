# Documentación técnica — Sistema de Inventario y Gestión Comercial

## 1. Descripción general

Inventario Pro es una aplicación web completa para gestionar productos, clientes, ventas, facturas e inventario. Está formada por tres componentes principales:

- **Frontend:** Angular 19, ejecutado sobre Nginx.
- **Backend:** Java 21 con Spring Boot 3.4.
- **Base de datos:** MySQL 8.4.

Toda la aplicación se ejecuta mediante Docker Compose, sin necesidad de instalar Java, Maven, Angular, Nginx o MySQL manualmente en el equipo del evaluador.

## 2. Arquitectura del proyecto

```text
trabajo/
├── backend/
│   ├── src/main/java/com/inventario/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── domain/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── repository/
│   │   └── service/
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql
│   └── Dockerfile
├── frontend/
│   ├── src/app/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── mysql/
│   └── init.sql
├── docker-compose.yml
├── README.md
└── DOCUMENTACION_TECNICA.md
```

## 3. Tecnologías utilizadas

### Frontend

- Angular 19.
- Componentes standalone.
- Angular Router.
- HttpClient y servicios HTTP centralizados.
- Formularios con `ngModel`.
- CSS responsive sin librerías externas.
- Nginx para servir la aplicación compilada.

### Backend

- Java 21.
- Spring Boot 3.4.12.
- Spring Web REST.
- Spring Data JPA.
- Hibernate.
- Validación y manejo global de errores.
- Maven.
- Maven Wrapper no usado; Maven está dentro de la imagen Docker de construcción.

### Base de datos

- MySQL 8.4.
- UTF-8 mediante `utf8mb4`.
- Zona horaria `America/Bogota`.
- Volumen Docker llamado `mysql_data` para conservar los datos.

## 4. Entidades del dominio

### Producto

Representa un artículo disponible en el inventario.

Campos principales:

- `id`.
- `nombre`.
- `descripcion`.
- `precio`.
- `stock`.
- `activo`.

Un producto no puede eliminarse si está asociado a una venta. En su lugar puede desactivarse o editarse desde el panel.

### Cliente

Representa una persona que realiza compras.

Campos principales:

- `id`.
- `nombre`.
- `email`.
- `telefono`.
- `direccion`.

El cliente no puede eliminarse si ya tiene ventas asociadas. Esto evita perder el historial comercial.

### Venta

Representa una operación comercial.

Campos principales:

- `id`.
- `cliente`.
- `fecha`.
- `total`.
- `estado`.
- `detalles`.
- `factura`.

Estados disponibles:

- `COMPLETADA`.
- `ANULADA`.

### DetalleVenta

Relaciona una venta con los productos vendidos.

Campos:

- `producto`.
- `cantidad`.
- `precioUnitario`.

Cada venta puede tener varios productos. La tabla `detalle_ventas` permite que una venta tenga una cantidad diferente por cada producto.

### Factura

Representa el comprobante generado al completar una venta.

Campos:

- `numero`.
- `emitida`.
- `total`.
- `venta`.

Cada factura está asociada a una venta mediante una relación uno a uno.

## 5. Relaciones entre entidades

```text
Cliente 1 ──── N Venta
Venta   1 ──── N DetalleVenta
Producto 1 ─── N DetalleVenta
Venta   1 ──── 1 Factura
```

Explicación:

- Un cliente puede realizar muchas ventas.
- Una venta pertenece a un cliente.
- Una venta puede contener varios detalles de producto.
- Un producto puede aparecer en muchos detalles de ventas diferentes.
- Una venta genera una única factura.

## 6. Backend Spring Boot

El backend sigue una separación por responsabilidades:

### Controller

Recibe las solicitudes HTTP y expone los endpoints REST.

Ejemplos:

- `ProductoController`.
- `ClienteController`.
- `VentaController`.

### Service

Contiene la lógica de negocio.

Ejemplos:

- Validar productos y clientes.
- Consolidar cantidades por producto.
- Validar stock.
- Crear ventas.
- Generar facturas.
- Restar o restaurar inventario.

### Repository

Accede a la base de datos mediante Spring Data JPA.

- `ProductoRepository`.
- `ClienteRepository`.
- `VentaRepository`.
- `DetalleVentaRepository`.
- `FacturaRepository`.

### DTO

Transporta datos específicos entre frontend y backend sin exponer entidades innecesarias.

Ejemplos:

- `ProductoRequest`.
- `ClienteRequest`.
- `VentaRequest`.
- `ItemVenta`.
- `VentaResponse`.
- `DetalleVentaResponse`.

### Exception

Incluye manejo centralizado de errores mediante `@RestControllerAdvice`.

Los errores de negocio devuelven una respuesta JSON con el campo:

```json
{"error":"Mensaje explicativo"}
```

## 7. Endpoints principales

### Productos

```text
GET    /api/productos
GET    /api/productos/{id}
GET    /api/productos/catalogo
POST   /api/productos
PUT    /api/productos/{id}
DELETE /api/productos/{id}
```

Ejemplo para crear un producto:

```json
{
  "nombre": "Monitor 27 pulgadas",
  "descripcion": "Monitor IPS Full HD",
  "precio": 980000,
  "stock": 12,
  "activo": true
}
```

### Clientes

```text
GET    /api/clientes
GET    /api/clientes/{id}
POST   /api/clientes
PUT    /api/clientes/{id}
DELETE /api/clientes/{id}
```

Ejemplo para crear un cliente:

```json
{
  "nombre": "Laura Gómez",
  "email": "laura@example.com",
  "telefono": "3001234567",
  "direccion": "Calle 45 #20-10"
}
```

### Ventas

```text
GET    /api/ventas
POST   /api/ventas
DELETE /api/ventas/{id}
```

Ejemplo para crear una venta:

```json
{
  "clienteId": 1,
  "items": [
    {"productoId": 1, "cantidad": 2},
    {"productoId": 2, "cantidad": 3}
  ]
}
```

## 8. Flujo transaccional de una venta

Cada venta se procesa dentro de una transacción Spring `@Transactional`.

1. Se verifica que exista al menos un producto.
2. Se busca al cliente por su ID.
3. Se consolida cada producto con su cantidad.
4. Se valida que la cantidad sea mínima 1.
5. Se busca el producto en la base de datos.
6. Se valida que el stock solicitado no exceda el disponible.
7. Se resta el stock del producto.
8. Se crea un `DetalleVenta` por cada producto.
9. Se calcula el total multiplicando precio por cantidad.
10. Se guarda la venta.
11. Se crea automáticamente la factura.
12. Si ocurre un error antes de terminar, la transacción puede revertirse.

Si se elimina una venta:

1. Se buscan sus detalles.
2. Se suman nuevamente las cantidades vendidas al stock.
3. Se elimina la venta.

Esta operación devuelve el inventario a su estado anterior.

## 9. Frontend Angular

### Vista Administrador

Ruta:

```text
http://localhost:4200/admin
```

Permite:

- Crear productos.
- Editar productos.
- Eliminar productos no asociados a ventas.
- Crear clientes.
- Editar clientes.
- Eliminar clientes sin ventas asociadas.
- Consultar inventario.
- Consultar clientes registrados.
- Consultar ventas y facturas.
- Eliminar ventas y restaurar inventario.

### Vista Catálogo

Ruta:

```text
http://localhost:4200/catalogo
```

Permite:

- Consultar productos activos.
- Ver stock disponible.
- Seleccionar cantidades.
- Agregar varios productos al carrito.
- Modificar cantidades.
- Quitar productos.
- Seleccionar un cliente.
- Crear una venta y su factura.

### Servicio HTTP

`ApiService` centraliza las llamadas al backend.

Ejemplo de uso:

```typescript
this.api.crearVenta({
  clienteId: 1,
  items: [{ productoId: 1, cantidad: 2 }]
}).subscribe();
```

Todas las llamadas usan rutas relativas `/api`, que Nginx redirige al backend.

## 10. Interfaz y diseño

La interfaz usa:

- Barra lateral responsive.
- Navegación de Administrador y Catálogo.
- Tarjetas de métricas.
- Paneles con encabezados organizados.
- Tablas responsivas.
- Formularios con validación HTML.
- Mensajes visuales de éxito y error.
- Estados vacíos.
- Indicadores de stock bajo.
- Diseño adaptable para escritorio y móvil.

## 11. Docker

Docker Compose crea tres servicios:

```text
mysql -> backend -> frontend
```

Cada contenedor tiene una responsabilidad específica.

### 11.1 Contenedor MySQL

Configuración principal:

- Imagen: `mysql:8.4`.
- Base de datos: `inventario_db`.
- Usuario: `inventario_user`.
- Contraseña: `inventario_pass`.
- Contraseña root: `root_pass`.
- Puerto publicado: `3306`.
- Zona horaria: `America/Bogota`.
- Codificación: `utf8mb4`.

Tiene un healthcheck:

```yaml
test: ["CMD-SHELL", "mysqladmin ping -h localhost -uroot -proot_pass --silent"]
```

Este healthcheck permite confirmar que MySQL esté listo antes de iniciar el backend.

### 11.2 Contenedor backend

El backend usa un Dockerfile multi-stage.

#### Etapa 1: construcción

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
```

Esta imagen contiene Maven y Java 21.

Primero copia `pom.xml` y descarga dependencias:

```dockerfile
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
```

Después copia el código fuente y genera el JAR:

```dockerfile
COPY src ./src
RUN mvn -q -B clean package -DskipTests
```

#### Etapa 2: ejecución

```dockerfile
FROM eclipse-temurin:21-jre
```

La imagen final contiene solamente el JRE y el JAR compilado, sin Maven ni código fuente.

```dockerfile
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

Esto reduce el tamaño y mejora la seguridad de la imagen.

El contenedor expone el puerto `8080` y tiene un healthcheck sobre:

```text
/actuator/health
```

### 11.3 Contenedor frontend

El frontend también usa un Dockerfile multi-stage.

#### Etapa 1: construcción Angular

```dockerfile
FROM node:22-alpine AS build
```

Instala las dependencias:

```dockerfile
RUN npm ci
```

Compila Angular:

```dockerfile
RUN npm run build -- --configuration production
```

#### Etapa 2: servidor web

```dockerfile
FROM nginx:1.27-alpine
```

Nginx recibe los archivos generados y los sirve en el puerto 80:

```dockerfile
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
```

Docker Compose publica este contenedor en:

```text
http://localhost:4200
```

### 11.4 Configuración Nginx

Nginx sirve Angular y redirige las rutas `/api` al backend:

```nginx
location /api/ {
  proxy_pass http://backend:8080/api/;
}
```

La aplicación Angular no necesita apuntar directamente a `localhost:8080`.

También permite rutas internas de Angular:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Esto evita errores al abrir directamente `/admin` o `/catalogo`.

## 12. Red Docker interna

Docker Compose crea automáticamente una red interna.

Los contenedores pueden comunicarse mediante sus nombres de servicio:

```text
frontend -> backend
backend  -> mysql
```

Ejemplo usado por Spring:

```text
jdbc:mysql://mysql:3306/inventario_db
```

`mysql` es el nombre DNS que Docker asigna al contenedor de MySQL.

## 13. Volumen persistente

```yaml
volumes:
  mysql_data:
```

Se monta en:

```text
/var/lib/mysql
```

Esto significa que los datos pueden mantenerse incluso si se recrean los contenedores.

Para borrar los datos y comenzar desde cero:

```bash
docker compose down -v
docker compose up --build -d
```

## 14. Inicio automático de datos

El backend ejecuta `data.sql` después de crear las tablas JPA.

La propiedad utilizada es:

```properties
spring.jpa.defer-datasource-initialization=true
```

Los datos iniciales incluyen:

- Cuatro productos.
- Dos clientes de ejemplo.

Esto permite probar el sistema sin insertar manualmente toda la información.

## 15. Dependencias entre servicios

Docker Compose espera a que MySQL esté completamente saludable:

```yaml
depends_on:
  mysql:
    condition: service_healthy
```

Esto evita que Spring Boot termine antes de que MySQL esté preparado para aceptar conexiones.

## 16. Comandos principales

### Primera ejecución

```bash
docker compose up --build -d
```

Construye las imágenes y crea los contenedores.

### Iniciar sin reconstruir

```bash
docker compose up -d
```

### Ver estado

```bash
docker compose ps
```

### Ver logs

```bash
docker compose logs -f
```

Solo backend:

```bash
docker compose logs -f backend
```

Solo frontend:

```bash
docker compose logs -f frontend
```

Solo MySQL:

```bash
docker compose logs -f mysql
```

### Detener

```bash
docker compose down
```

### Reiniciar todo y borrar datos

```bash
docker compose down -v
docker compose up --build -d
```

## 17. Direcciones

### Aplicación

```text
http://localhost:4200
```

### Administrador

```text
http://localhost:4200/admin
```

### Catálogo

```text
http://localhost:4200/catalogo
```

### Backend

```text
http://localhost:8080
```

### Estado del backend

```text
http://localhost:8080/actuator/health
```

### Productos

```text
http://localhost:8080/api/productos
```

### Clientes

```text
http://localhost:8080/api/clientes
```

### Ventas

```text
http://localhost:8080/api/ventas
```

## 18. Flujo de prueba completo

1. Abrir Docker Desktop.
2. Ejecutar `docker compose up --build -d` dentro de la carpeta raíz.
3. Esperar a que los tres contenedores estén activos.
4. Abrir `http://localhost:4200/catalogo`.
5. Seleccionar un cliente.
6. Agregar un producto al carrito.
7. Definir una cantidad válida.
8. Crear la venta.
9. Confirmar que el stock disminuyó.
10. Confirmar que se creó una factura.
11. Abrir `http://localhost:4200/admin`.
12. Consultar los clientes registrados.
13. Consultar el inventario actualizado.
14. Consultar el historial de ventas.
15. Editar o eliminar un producto.
16. Editar o eliminar un cliente sin ventas asociadas.
17. Eliminar una venta y verificar que el stock se restaure.

## 19. Reglas de integridad

- La cantidad mínima en una venta es uno.
- La cantidad máxima está limitada por el stock disponible.
- No se puede vender stock insuficiente.
- Una venta genera automáticamente una factura.
- El stock se descuenta al crear una venta.
- El stock se restaura al eliminar una venta.
- Un producto usado en ventas no puede eliminarse directamente.
- Un cliente con ventas no puede eliminarse directamente.
- Los productos pueden desactivarse para dejar de aparecer en el catálogo sin borrar su historial.

## 20. Solución de problemas

### Los contenedores no aparecen

Docker Desktop debe estar abierto y ejecutándose.

```bash
docker desktop
```

En Windows, también puede iniciarse desde el menú inicio.

### Puerto ocupado

Si `4200`, `8080` o `3306` están ocupados:

```bash
docker compose down
```

Cerrar la aplicación que usa el puerto o modificar los puertos en `docker-compose.yml`.

### Backend reiniciando

Revisar logs:

```bash
docker compose logs backend
```

Las causas comunes son:

- MySQL aún iniciando.
- Credenciales incorrectas.
- Puerto ocupado.
- Error de compilación previo.

### Frontend no carga

```bash
docker compose logs frontend
docker compose restart frontend
```

### Base de datos corrupta o datos de prueba antiguos

```bash
docker compose down -v
docker compose up --build -d
```

Esto elimina el volumen MySQL y vuelve a cargar los datos iniciales.

## 21. Construcción manual fuera de Docker

### Backend

Dentro de `backend/`:

```bash
mvn clean package -DskipTests
java -jar target/inventario-api-1.0.0.jar
```

### Frontend

Dentro de `frontend/`:

```bash
npm install
npm start
```

La ejecución manual requiere tener Java, Maven, Node.js, MySQL y las variables de conexión configuradas.

## 22. Resumen técnico final

El sistema está construido como una aplicación web distribuida en contenedores:

- Angular administra la interfaz y realiza solicitudes HTTP.
- Nginx sirve Angular y funciona como proxy `/api`.
- Spring Boot procesa solicitudes y aplica reglas de negocio.
- JPA administra entidades y relaciones.
- MySQL guarda productos, clientes, ventas, detalles y facturas.
- Docker Compose crea y conecta todos los servicios automáticamente.
- Los Dockerfiles usan builds multi-stage para separar compilación y ejecución.
- Los datos iniciales permiten usar el sistema inmediatamente después del primer despliegue.

Comando principal de ejecución desde la carpeta raíz:

```bash
docker compose up --build -d
```
