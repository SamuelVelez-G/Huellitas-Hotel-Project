# Hotel Huellitas

Este repositorio contiene la parte de backend del proyecto Hotel Huellitas, desarrollada con Java y Spring Boot. También existe una interfaz web para el sitio web del hotel.
## Descripción del proyecto

Hotel Huellitas es una aplicación orientada a la administración de un servicio de hotelería para mascotas. El backend incluye:

- Registro y autenticación de usuarios
- Roles de acceso (usuario y administrador)
- Gestión de mascotas asociadas a cada usuario
- Administración de especies y servicios disponibles
- Creación y consulta de reservas
- Manejo de detalles de reserva
- Seguridad con Spring Security y JWT

## Tecnologías utilizadas

- Java 
- Spring Boot 3.3.3
- Spring Web
- Spring Data JPA
- Spring Security
- JWT (JJWT)
- PostgreSQL
- Maven
- Lombok

## Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- JDK 17 o superior
- Maven 3.9+
- PostgreSQL
- Un IDE como IntelliJ IDEA o Visual Studio Code

## Configuración

1. Clona el repositorio:

```bash
git clone https://github.com/SamuelVelez-G/HUELLITAS_HOTEL_BACKEND.git
cd HUELLITAS_HOTEL_BACKEND/Hotel
```

2. Configura la base de datos en `Hotel/src/main/resources/application.properties`.

Ejemplo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hotel_huellitas
spring.datasource.username=postgres
spring.datasource.password=tu_password
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

jwt.secret=TU_CLAVE_SECRETA
jwt.expiration=86400000
```

> Si usas una base externa como Supabase, reemplaza la URL, usuario y contraseña por los valores que te proporcione tu proveedor.

## Ejecución

En Windows:

```bash
mvnw.cmd spring-boot:run
```

En Linux/macOS:

```bash
./mvnw spring-boot:run
```

La aplicación quedará disponible en:

```text
http://localhost:8080
```

## Endpoints principales

### Autenticación

- `POST /api/auth/login` — inicio de sesión con email y contraseña

### Usuarios

- `POST /api/usuarios` — registro de usuario
- `GET /api/usuarios` — consultar usuarios (solo administrador)
- `GET /api/usuarios/{id}` — buscar usuario por ID
- `PUT /api/usuarios/{id}` — actualizar usuario
- `DELETE /api/usuarios/{id}` — eliminar usuario

### Mascotas

- `GET /api/mascotas` — listar mascotas
- `GET /api/mascotas/{id}` — consultar mascota por ID
- `POST /api/mascotas` — crear mascota
- `PUT /api/mascotas/{id}` — actualizar mascota
- `DELETE /api/mascotas/{id}` — eliminar mascota

### Servicios y especies

- `GET /api/servicios` — listar servicios
- `GET /api/servicios/{id}` — buscar servicio por ID
- `GET /api/servicios/disponibles` — servicios disponibles
- `GET /api/especies` — listar especies
- `POST /api/servicios` — crear servicio (solo administrador)
- `POST /api/especies` — crear especie (solo administrador)

### Reservas

- `POST /api/reservas` — crear reserva
- `GET /api/reservas` — listar reservas
- `GET /api/reservas/{id}` — consultar reserva por ID

## Estructura del proyecto

```text
Hotel/
├── src/
│   ├── main/
│   │   ├── java/com/Huellitas/Hotel/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── exception/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   ├── service/
│   │   │   └── HotelApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
├── mvnw
├── mvnw.cmd
├── Dockerfile
├── .gitignore
└── README.md
```

## Seguridad

La API protege los endpoints con Spring Security y JWT. Algunos recursos son públicos, como:

- `POST /api/auth/login`
- `POST /api/usuarios`
- `GET /api/especies`
- `GET /api/servicios`

Los endpoints administrativos y los recursos de usuarios, mascotas y reservas requieren autenticación y/o permisos específicos.

## Integrantes del equipo

| Nombre | Rol |
|--------|-----|
| Samuel Velez | Desarrollador Full Stack |
| Juan Cardona | Desarrollador Full Stack |
| Mónica Díaz | Desarrolladora Full Stack |
| Nataly Barahona Muñoz | Desarrolladora Full Stack |
| Dayan Bohorquez | Desarrolladora Full Stack |

## Links de despliegue

- [Frontend](https://samuelvelez-g.github.io/Huellitas-Hotel-Project/)
- [Backend](https://huellitas-hotel-backend.onrender.com)
- [Entrega vista administrador](https://samuelvelez-g.github.io/Huellitas-Hotel-Project/)

## Contacto

- Email: hotel.huellitas2026@gmail.com
- Teléfono: +57 (301) 123 4567
- Ubicación: Calle 68 B Sur # 63 - 55

---

© 2026 Hotel Huellitas — Generation Colombia. Todos los derechos reservados.

