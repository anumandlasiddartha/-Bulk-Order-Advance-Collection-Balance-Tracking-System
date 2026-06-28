# Cakes and Crunches — REST API Reference

The Cakes and Crunches application exposes REST endpoints secured with JSON Web Tokens (JWT). All endpoints respond with JSON content.

---

## Headers

Secure requests must attach the JWT token inside the request headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## Authentication Endpoints

### 1. Register User
`POST /api/auth/register`
* **Request Payload**:
  ```json
  {
    "username": "bakerjohn",
    "email": "john@cakes.com",
    "password": "SecurePassword1!",
    "full_name": "John Baker",
    "role": "staff"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful.",
    "user": {
      "id": 4,
      "username": "bakerjohn",
      "email": "john@cakes.com",
      "full_name": "John Baker",
      "role": "staff"
    }
  }
  ```

### 2. Login User
`POST /api/auth/login`
* **Request Payload**:
  ```json
  {
    "email": "john@cakes.com",
    "password": "SecurePassword1!"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "access_token": "eyJhbGciOi...",
    "refresh_token": "eyJhbGciOi...",
    "user": {
      "id": 4,
      "username": "bakerjohn",
      "email": "john@cakes.com",
      "full_name": "John Baker",
      "role": "staff"
    }
  }
  ```

---

## Order Endpoints

### 1. Place Bulk Order
`POST /api/orders`
* **Request Payload**:
  ```json
  {
    "customer_id": 1,
    "cake_type": "wedding",
    "event_type": "wedding",
    "delivery_date": "2026-07-15",
    "order_value": 45000.00,
    "advance_amount": 15000.00,
    "notes": "Vanilla flavoring with gold leaves toppings"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": 5,
    "order_number": "ORD-20260628-A93E84F2",
    "customer_id": 1,
    "cake_type": "wedding",
    "event_type": "wedding",
    "delivery_date": "2026-07-15",
    "order_value": 45000.0,
    "advance_amount": 15000.0,
    "remaining_balance": 30000.0,
    "payment_status": "partial",
    "order_status": "pending",
    "notes": "Vanilla flavoring with gold leaves toppings"
  }
  ```

---

## Wallet Endpoints

### 1. Credit Wallet
`POST /api/wallet/customer/<id>/credit`
* **Request Payload**:
  ```json
  {
    "amount": 2500.00,
    "description": "Prepaid booking deposit credit"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "customer_id": 1,
    "balance": 2500.0,
    "updated_at": "2026-06-28T05:27:36Z"
  }
  ```
