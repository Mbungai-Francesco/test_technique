# API_Endpoint.md

## How to Run with Docker Compose

This project provides a `docker-compose.yml` to easily run the required services (PostgreSQL, Redis, and optional admin tools).

1. **Start the services:**
   ```bash
    # Start only PostgreSQL + Redis
    docker-compose up -d

    # Start all plus the tools
    docker-compose --profile tools up -d
   ```
   This will start:
   - **PostgreSQL** (database, port 5432)
   - **Redis** (queue, port 6379)
   - **pgAdmin** (optional, web UI for PostgreSQL, port 5050, login: admin@pradeo.com / admin)
   - **Redis Commander** (optional, web UI for Redis, port 8081)

2. **Stop the services:**
   ```bash
   docker-compose down
   ```

3. **Check service logs:**
   ```bash
   docker-compose logs -f
   ```

> Make sure your `.env` matches the credentials in `docker-compose.yml` (see example above).

---

## How to Run the Backend

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following (adjust as needed):
     ```
      DATABASE_URL="postgresql://pradeo:root@localhost:5432/pradeo_apps?schema=public"

      # JWT Configuration
      JWT_SECRET="your-super-secret-key-change-in-production"
      # JWT_EXPIRES_IN="7d"

      # VirusTotal configuration
      VIRUSTOTAL_URL="https://www.virustotal.com/vtapi/v2"
      VIRUSTOTAL_API_KEY="VirusTotal_Key"

      # Redis
      REDIS_HOST=localhost
      REDIS_PORT=6379
      REDIS_PASSWORD=pradeo_redis_password
     ```
3. **Push Prisma schema (if needed):**
   ```bash
   npx prisma db push
   ```
4. **Start the backend:**
   ```bash
   npm run start:dev
   ```

---

## API Endpoints

### Auth

- **POST `/auth/register`**
  - Registers a new user.
  - Body:
    ```json
    {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "password": "yourpassword"
    }
    ```
  - Sets an HTTPOnly cookie with the JWT.
  - Returns: `{ user: { ... } }`

- **POST `/auth/login`**
  - Logs in a user.
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
  - Sets an HTTPOnly cookie with the JWT.
  - Returns: `{ user: { ... } }`

- **POST `/auth/logout`**
  - Logs out the user (clears the cookie).
  - Returns: `{ message: 'Logged out successfully' }`

- **GET `/auth/profile`**
  - Returns the authenticated user's profile.
  - Requires authentication (JWT in HTTPOnly cookie).

---

### User

- **GET `/user`**
  - Get all users. (Requires authentication)

- **GET `/user/:id`**
  - Get a user by ID. (Requires authentication)

- **PATCH `/user/:id`**
  - Update a user by ID. (Requires authentication)
  - Body: Partial user fields

- **DELETE `/user/:id`**
  - Delete a user by ID. (Requires authentication)

---

### Application

- **GET `/application`**
  - Get all applications. (Requires authentication)

- **POST `/application`**
  - Create a new application. (Requires authentication)
  - Body: Application fields

- **GET `/application/:id`**
  - Get an application by ID. (Requires authentication)

- **PATCH `/application/:id`**
  - Update an application by ID. (Requires authentication)
  - Body: Partial application fields

- **DELETE `/application/:id`**
  - Delete an application by ID. (Requires authentication)

---

### Virus Scan

- **GET `/virus-scan`**
  - Get all virus scans. (Requires authentication)

- **POST `/virus-scan`**
  - Create a new virus scan. (Requires authentication)
  - Body: Virus scan fields

- **GET `/virus-scan/:id`**
  - Get a virus scan by ID. (Requires authentication)

- **PATCH `/virus-scan/:id`**
  - Update a virus scan by ID. (Requires authentication)
  - Body: Partial virus scan fields

- **DELETE `/virus-scan/:id`**
  - Delete a virus scan by ID. (Requires authentication)

---

### Virus Check

- **GET `/virus-check`**
  - Get all virus checks. (Requires authentication)

- **POST `/virus-check`**
  - Create a new virus check. (Requires authentication)
  - Body: Virus check fields

- **GET `/virus-check/:id`**
  - Get a virus check by ID. (Requires authentication)

- **PATCH `/virus-check/:id`**
  - Update a virus check by ID. (Requires authentication)
  - Body: Partial virus check fields

- **DELETE `/virus-check/:id`**
  - Delete a virus check by ID. (Requires authentication)

---

## Notes
- All endpoints (except register/login) require authentication via HTTPOnly cookie.
- Adjust endpoint URLs and request bodies as needed for your frontend.
- For more details, see the code or contact the maintainer.
