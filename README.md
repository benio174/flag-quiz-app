# Flag Quiz Application

A full-stack web application designed for learning world flags and testing geography knowledge through an interactive quiz. The project is fully containerized and uses an embedded database, requiring no external database services to run.

---

## Tech Stack

### Frontend
- React
- Vite
- Axios
- Nginx (production container serving)

### Backend
- Java 17
- Spring Boot
- Spring Data JPA / Hibernate
- H2 Database (file-based embedded storage)

---

## Prerequisites

To run this application using the recommended method, ensure you have installed:
- Docker
- Docker Compose

No local installation of Java, Maven, or Node.js is required when running via Docker.

---

## Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/benio174/flag_app.git](https://github.com/benio174/flag_app.git)
cd flag_app
```

### 2. Run with Docker Compose
Build and launch both the frontend and backend services:
```bash
docker compose up --build
```

Once initialized, the services will be accessible at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8081

### 3. Stopping the Application
To stop all running containers:
```bash
docker compose down
```
or Ctrl + C in terminal running project.

To stop containers and wipe the persistent database volume:
```bash
docker compose down -v
```

---

## Database Configuration

The application utilizes an embedded H2 database configured in file mode. 
- Seed data (countries, flags, and names) is automatically loaded upon initialization from data.sql using idempotent MERGE INTO operations.
- User accounts and quiz scores are persisted in an internal volume managed by Docker (h2_data), ensuring data persists across container restarts.

---

## Local Development (Without Docker)

If you prefer running services directly on your host machine:

### Backend
```bash
cd backend/app
./mvnw clean spring-boot:run
```
(On Windows: .\mvnw.cmd spring-boot:run)

### Frontend
cd frontend/my-react-app
```bash
npm install
npm run dev
```

Access the development server at http://localhost:5173.