# AURA E-Commerce — Java Spring Boot Backend

A complete, production-grade Java Spring Boot 3.3.x REST API backend for the **AURA Modern Commerce** platform.

---

## 🛠️ Tech Stack
- **Framework**: Spring Boot 3.3.4 (Java 17+)
- **ORM / Persistence**: Spring Data JPA & Hibernate
- **Database**: H2 in-memory (out-of-the-box zero setup) or PostgreSQL
- **Build Tool**: Maven

---

## 🚀 How to Run the Java Backend

### Option A: Using Maven Terminal
```bash
# 1. Navigate to the Java backend directory
cd backend-java

# 2. Build the project
mvn clean install

# 3. Start Spring Boot
mvn spring-boot:run
```

The Spring Boot backend will start on:
👉 **`http://localhost:8080`**

---

### Option B: Using IntelliJ IDEA or Eclipse
1. Open IntelliJ IDEA / Eclipse.
2. Select **Open Project** $\rightarrow$ choose the `backend-java/` folder.
3. Allow Maven to download dependencies.
4. Open `src/main/java/com/aura/ecommerce/AuraEcommerceApplication.java`.
5. Click **Run** ▶️.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve all products (supports `?category=`, `?brand=`, `?search=`) |
| `GET` | `/api/products/{id}` | Retrieve specific product details |
| `POST` | `/api/products` | Add a new product (Admin) |
| `PUT` | `/api/products/{id}` | Update product pricing, description, stock |
| `DELETE` | `/api/products/{id}` | Delete product |
| `POST` | `/api/orders/checkout` | Process order, verify stock, apply coupon, compute tax |
| `GET` | `/api/orders` | View all customer orders |
| `PUT` | `/api/orders/{id}/status` | Update order status (`PENDING`, `SHIPPED`, `DELIVERED`) |
| `POST` | `/api/coupons/validate` | Verify promotional coupon codes (`SAVE20`, `WELCOME10`) |

---

## 🗄️ Database Configuration (PostgreSQL)

To switch from the default in-memory database to PostgreSQL, update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/aura_db
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password
spring.jpa.hibernate.ddl-auto=update
```
