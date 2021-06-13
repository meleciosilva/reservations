
# Restaurant Reservations System

## Summary

Restaurant Reservations System is a platform designed for fine dining restaurants. The software is used only by restaurant personnel when a customer calls to request a reservation.

In addition to making reservations, this application helps streamline reservation management in the following ways:

- update & cancel existing reservations
- seat reservations at specific tables upon arrival
- finish reservations and mark table availability
- easily search reservations by phone number
- provide an overview of free and occupied tables

## Demo

[Restaurant Reservations](https://restaurant-reservation-frontend-gilt.vercel.app/dashboard?date=2020-12-30)

## API Reference

### Reservations

#### Get all reservations

```http
  GET /reservations
```

The response from the server should look like the following:

```json
{
  "data": [
    {
      "reservation_id": 4,
      "first_name": "Tiger",
      "last_name": "Lion",
      "mobile_number": "808-555-0140",
      "reservation_date": "2025-12-30T05:00:00.000Z",
      "reservation_time": "18:00:00",
      "people": 3,
      "created_at": "2020-12-10T08:31:32.326Z",
      "updated_at": "2020-12-10T08:31:32.326Z",
      "status": "booked"
    // ...
  ]
}
```

```http
  GET /reservations/?date=YYYY-MM-DD
```

#### Get all reservations (by reservation date)

In the event where `date=YYYY-MM-DD` is provided, the route should return _only_ reservations for the date entered.

The response from the server should look identical to the response above _except_ that it may exclude some records.

#### Get all reservations (by mobile number)

```http
  GET /reservations/?mobile_number=###-###-####
```

In the event where `mobile_number=###-###-####` is provided, the route should return _only_ reservations matching the mobile number entered.

The response from the server should look identical to the response above _except_ that it may exclude some records.

#### Create a reservation

```http
  POST /reservations
```

The request to the server should look like the following:

```json
{
    "data": {
      "first_name": "John",
      "last_name": "Doe",
      "mobile_number": "555-555-5555",
      "reservation_date": "2021-12-30",
      "reservation_time": "11:00",
      "people": 6
    }
}
```

The response from the server should look like the following:

```json
{
  "data": {
    "reservation_id": 6,
    "first_name": "John",
    "last_name": "Doe",
    "mobile_number": "555-555-5555",
    "reservation_date": "2021-12-30T05:00:00.000Z",
    "reservation_time": "11:00:00",
    "people": 6,
    "created_at": "2021-06-12T22:18:59.462Z",
    "updated_at": "2021-06-12T22:18:59.462Z",
    "status": "booked"
  }
}
```

#### Read one reservation

```http
  GET /reservations/:reservationId
```

The response from the server should look identical to the response above.

#### Update one reservation

```http
  PUT /reservations/:reservationId
```

The request to the server should look like the following:

```json
{
    "data": {
      "first_name": "John",
      "last_name": "Doe",
      "mobile_number": "888-888-8888",
      "reservation_date": "2021-11-29",
      "reservation_time": "10:30",
      "people": 8
    }
}
```

The response from the server should look like the following:

```json
{
  "data": {
    "reservation_id": 6,
    "first_name": "James",
    "last_name": "Doe",
    "mobile_number": "888-888-8888",
    "reservation_date": "2021-11-29T05:00:00.000Z",
    "reservation_time": "10:30:00",
    "people": 8,
    "created_at": "2021-06-12T22:18:59.462Z",
    "updated_at": "2021-06-12T22:18:59.462Z",
    "status": "booked"
  }
}
```

#### Delete one reservation

```http
  DELETE /reservations/:reservationId
```

The response from the server should have no content.

#### Update the reservation status

```http
  PUT /reservations/:reservationId/status
```

The request to the server should look like the following:

```json
{
    "data": {
        "status": "seated"
    }
}
```

The response from the server should look like the following:

```json
{
    "data": {
        "status": "seated"
    }
}
```

### Tables

#### Get all tables

```http
  GET /tables
```

The response from the server should look like the following:

```json
{
  "data": [
    {
      "table_id": 3,
      "table_name": "#1",
      "capacity": 6,
      "reservation_id": null,
      "created_at": "2021-06-11T23:41:34.938Z",
      "updated_at": "2021-06-11T23:41:34.938Z"
    },
    // ...
  ]
}
```

#### Create a table

```http
  POST /tables
```

The request to the server should look like the following:

```json
{
    "data": {
      "table_name": "Booth #1",
      "capacity": 8
    }
}
```

The response from the server should look like the following:

```json
{
  "data": {
    "table_id": 5,
    "table_name": "Booth #1",
    "capacity": 8,
    "reservation_id": null,
    "created_at": "2021-06-12T22:49:50.327Z",
    "updated_at": "2021-06-12T22:49:50.327Z"
  }
}
```

#### Read one table

```http
  GET /tables/:tableId
```

The response from the server should look identical to the response above.

#### Update one table (seat reservation)

```http
  PUT /tables/:tableId/seat
```

The request to the server should look like the following:

```json
{
    "data": {
        "reservation_id": 6
    }
}
```

The response from the server should look like the following:

```json
{
  "data": {
    "reservation_id": 6,
    "first_name": "John",
    "last_name": "Doe",
    "mobile_number": "555-555-5555",
    "reservation_date": "2021-12-30T05:00:00.000Z",
    "reservation_time": "11:00:00",
    "people": 6,
    "created_at": "2021-06-12T23:01:32.043Z",
    "updated_at": "2021-06-12T23:01:32.043Z",
    "status": "seated"
  }
}
```

#### Delete one table (finish reservation)

```http
  DELETE /tables/:tableId/seat
```

The response from the server should look like the following:

```json
{
  "data": {
    "message": "Reservation Successfully Finished"
  }
}
```

## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

## Installation

### Set up database

Set up four new [ElephantSQL](https://www.elephantsql.com/) database instances - development, test, preview, and production.

### Install

1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`.
3. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
4. Run `cp ./front-end/.env.sample ./front-end/.env`.
5. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
6. Run `npm install` to install project dependencies.
7. Run `npm run start:dev` to start your server in development mode.

### Seed data with Knex

Seed data with the following commands:

```bash
  cd back-end/
  npx knex seed:run
```

## Tech Stack

**Front End:** React, Bootstrap

**Back End:** Node, Express, PostgreSQL
