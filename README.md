
# NestJS Notification Service

A flexible notification service built with NestJS that handles multiple notification channels (Email, UI) with user subscription management.

## Features

- Multi-channel notification support (Email, UI)
- User subscription management
- MongoDB integration for notification storage
- Channel-specific message formatting
- Support for different notification types:
  - Leave Balance Reminder
  - Monthly Payslip
  - Birthday Greetings

## Prerequisites

- Node.js (v16 or later)
- Docker and Docker Compose
- MongoDB (handled via Docker)

## Project Setup

1. Clone the repository:

2. Start the services using Docker Compose:

```bash
docker-compose up -d
```
3. Seed sample user data (optional)

```bash
mongoimport --host mongodb --db notifications --collection users --drop --type json --file ./seed/Users.json --jsonArray
```

This will start:

- MongoDB instance on port 27017
- NestJS application on port 3000

## Testing

To run the unit tests:

```bash
npm run test
```

## API Endpoints

The service exposes the following endpoints:

- POST /notifications - Send a new notification
- GET /notifications/:userId - Get user's notifications
- POST /subscriptions - Subscribe to notification channels
- DELETE /subscriptions - Unsubscribe from notification channels

sample curl of the endpoints

### Notification

1. Send Notification (POST)

```bash
curl -X POST http://localhost:3000/notifications \
-H "Content-Type: application/json" \
-d '{  "userId": "user123",  "companyId": "company456",  "notificationType": "happy-birthday"}'
```

2. Get User Notifications (GET)

```bash
curl -X GET http://localhost:3000/notifications/user/{userId}
```

### Subscription

1. Create Subscription (POST)

```bash
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "companyId": "company123", "channelType": "email"}'
```

2. Unsubscribe (DELETE)

```bash
curl -X DELETE "http://localhost:3000/subscriptions/user123/company456/EMAIL"
```

3. Get User's Subscriptions (GET)

```bash
curl -X GET "http://localhost:3000/subscriptions/user/user123"
```