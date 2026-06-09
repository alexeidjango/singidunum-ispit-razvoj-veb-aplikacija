# Payment Orders API

Django + DRF microservice for managing payment orders and saved recipients.
Uses JWT (simplejwt) for authentication.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

export DJANGO_SETTINGS_MODULE=settings.base
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Base URL for all examples below: `http://localhost:8000`

---

## Authentication

### Register

```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "S3curePass!22",
    "full_name": "John Doe",
    "address": "Main Street 1, Belgrade"
  }'
```

Response `201`:
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "address": "Main Street 1, Belgrade"
}
```

### Login (obtain tokens)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "S3curePass!22"
  }'
```

Response `200`:
```json
{
  "access": "<access_token>",
  "refresh": "<refresh_token>"
}
```

Use the `access` token in the `Authorization` header for all subsequent requests:

```
Authorization: Bearer <access_token>
```

### Refresh token

```bash
curl -X POST http://localhost:8000/api/v1/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "<refresh_token>"}'
```

Response `200`:
```json
{
  "access": "<new_access_token>"
}
```

### Change password

```bash
curl -X POST http://localhost:8000/api/v1/auth/password-change/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "S3curePass!22",
    "new_password": "N3wSecure!33"
  }'
```

Response `204`: no content.

---

## User profile

### Get current user

```bash
curl http://localhost:8000/api/v1/users/me/ \
  -H "Authorization: Bearer <access_token>"
```

Response `200`:
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "address": "Main Street 1, Belgrade"
}
```

### Update current user

Only `full_name` and `address` can be changed.

```bash
curl -X PATCH http://localhost:8000/api/v1/users/me/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Doe",
    "address": "New Street 5, Novi Sad"
  }'
```

Response `200`: updated user object.

---

## Saved recipients

Full CRUD. Each user only sees their own recipients.

Bank account accepts Serbian short format (`XXX-YYYYYYYYY-ZZ`) or the full
18-digit format. It is always normalized to 18 digits on save.

### List

```bash
curl http://localhost:8000/api/v1/saved-recipients/ \
  -H "Authorization: Bearer <access_token>"
```

### Create

```bash
curl -X POST http://localhost:8000/api/v1/saved-recipients/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_full_name": "Acme Corp",
    "recipient_address": "Industrial Zone 3, Nis",
    "bank_account": "160-123456-17"
  }'
```

Response `201`:
```json
{
  "id": 1,
  "recipient_full_name": "Acme Corp",
  "recipient_address": "Industrial Zone 3, Nis",
  "bank_account": "160000000012345617",
  "created_at": "2026-06-09T12:00:00Z",
  "updated_at": "2026-06-09T12:00:00Z"
}
```

### Retrieve

```bash
curl http://localhost:8000/api/v1/saved-recipients/1/ \
  -H "Authorization: Bearer <access_token>"
```

### Update

```bash
curl -X PUT http://localhost:8000/api/v1/saved-recipients/1/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_full_name": "Acme Corp Updated",
    "recipient_address": "Industrial Zone 3, Nis",
    "bank_account": "160-123456-17"
  }'
```

### Partial update

```bash
curl -X PATCH http://localhost:8000/api/v1/saved-recipients/1/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"recipient_full_name": "Acme Corp v2"}'
```

### Delete

```bash
curl -X DELETE http://localhost:8000/api/v1/saved-recipients/1/ \
  -H "Authorization: Bearer <access_token>"
```

Response `204`: no content.

---

## Payment orders

Full CRUD. Each user only sees their own orders.

### List

```bash
curl http://localhost:8000/api/v1/payment-orders/ \
  -H "Authorization: Bearer <access_token>"
```

### Create

```bash
curl -X POST http://localhost:8000/api/v1/payment-orders/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_full_name": "Acme Corp",
    "recipient_address": "Industrial Zone 3, Nis",
    "bank_account": "160-123456-17",
    "sender_name": "John Doe",
    "sender_address": "Main Street 1, Belgrade",
    "amount": "25000.00",
    "currency": "RSD",
    "reference_model": "97",
    "reference_number": "1234567890"
  }'
```

Response `201`:
```json
{
  "id": 1,
  "recipient_full_name": "Acme Corp",
  "recipient_address": "Industrial Zone 3, Nis",
  "bank_account": "160000000012345617",
  "sender_name": "John Doe",
  "sender_address": "Main Street 1, Belgrade",
  "amount": "25000.00",
  "currency": "RSD",
  "reference_model": "97",
  "reference_number": "1234567890",
  "created_at": "2026-06-09T12:00:00Z",
  "updated_at": "2026-06-09T12:00:00Z"
}
```

Field notes:
- `amount` — must be greater than 0.
- `currency` — one of `RSD`, `EUR`, `USD`.
- `reference_model`, `reference_number` — optional (can be blank).
- `bank_account` — normalized to 18 digits on save.

### Retrieve

```bash
curl http://localhost:8000/api/v1/payment-orders/1/ \
  -H "Authorization: Bearer <access_token>"
```

### Update

```bash
curl -X PUT http://localhost:8000/api/v1/payment-orders/1/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_full_name": "Acme Corp",
    "recipient_address": "Industrial Zone 3, Nis",
    "bank_account": "160000000012345617",
    "sender_name": "John Doe",
    "sender_address": "Main Street 1, Belgrade",
    "amount": "30000.00",
    "currency": "EUR",
    "reference_model": "97",
    "reference_number": "1234567890"
  }'
```

### Partial update

```bash
curl -X PATCH http://localhost:8000/api/v1/payment-orders/1/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": "50000.00"}'
```

### Delete

```bash
curl -X DELETE http://localhost:8000/api/v1/payment-orders/1/ \
  -H "Authorization: Bearer <access_token>"
```

Response `204`: no content.
