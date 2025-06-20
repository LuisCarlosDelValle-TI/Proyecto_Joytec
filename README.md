# Proyecto Joyería

Sistema de gestión para joyería desarrollado con Node.js, Express y PostgreSQL.

## Características

- Gestión de usuarios, clientes, empleados, productos, proveedores y compras.
- Autenticación y autorización con JWT.
- Migraciones y seed de base de datos.
- Paneles de administración y formularios en Dashboards.
- API RESTful documentada y modular.

## Estructura del Proyecto

```
.
├── app.js
├── .env
├── package.json
├── Dash/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   └── utils/
├── Dashboards/
│   ├── css/
│   ├── html/
│   ├── img/
│   └── js/
└── ...
```

## Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/tu_usuario/proyecto_joyeria.git
   cd proyecto_joyeria
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Configura las variables de entorno en el archivo `.env`:
   ```
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=joyeria
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=tu_secreto
   ```

4. Realiza las migraciones y el seed de la base de datos:
   ```sh
   npm run migrate
   node Dash/seed.js
   ```

## Uso

- Para desarrollo:
  ```sh
  npm run dev
  ```
- Para producción:
  ```sh
  npm start
  ```

La aplicación estará disponible en [http://localhost:3001](http://localhost:3001).

## Scripts disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon.
- `npm start`: Inicia el servidor en modo producción.
- `npm run migrate`: Ejecuta las migraciones de la base de datos.
- `npm test`: Ejecuta los tests (si están configurados).

## Dependencias principales

- express
- pg
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- morgan
- node-pg-migrate
- uuid

## Licencia

LuisCarlosDEV-TI

---

> Desarrollado por Luis Carlos Del Valle Cruz
> LuisCarlosDEV-TI
