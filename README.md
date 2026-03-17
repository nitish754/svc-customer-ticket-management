# Ticket Service (NestJS Microservice)

This service receives support ticket requests from upstream systems, validates them with Zod, normalizes priority, assigns an agent, stores the ticket in-memory, and enqueues a CRM sync job via BullMQ.

## Tech Stack

- NestJS
- Zod (request validation)
- BullMQ + Redis (background jobs)
- In-memory repository (no DB)

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Start Redis (required for BullMQ)

```bash
redis-server
```

### 3) Start the service

```bash
npm run start:dev
```

Service runs at `http://localhost:3000`.

## API

### POST /tickets

**Payload (upstream)**

```json
{
  "customer_id": "string",
  "issue_description": "string",
  "priority": "string | number"
}
```

**Priority normalization**

- "high" or `1` → `1` (HIGH)
- "low" or `2` → `2` (LOW)

**Success response (example)**

```json
{
  "id": "uuid",
  "customerId": "cust-1",
  "issue": "Login issue",
  "priority": 1,
  "agent": "Aiden"
}
```

**Error response format (global)**

```json
{
  "success": false,
  "error": {
    "message": "string",
    "code": "string | number"
  }
}
```

## Manual Test Scenarios

### 1) Valid request (string priority)

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"customer_id":"cust-1","issue_description":"Login issue","priority":"high"}'
```

Expected: 201 with normalized `priority: 1` and `agent` assigned.

### 2) Valid request (numeric priority)

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"customer_id":"cust-2","issue_description":"Reset password","priority":2}'
```

Expected: 201 with `priority: 2`.

### 3) Invalid priority

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"customer_id":"cust-3","issue_description":"Other","priority":"urgent"}'
```

Expected: 400 with unified error format and `code: "VALIDATION_ERROR"`.

### 4) Missing required field

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"issue_description":"Missing customer","priority":"high"}'
```

Expected: 400 with unified error format.

## Background Job (CRM Sync)

- CRM sync happens asynchronously via BullMQ.
- Retries are configured (3 attempts with exponential backoff).
- CRM is simulated and may throw timeout/500 errors; BullMQ handles retries.

## Test Commands

### Unit tests

```bash
npm test
```

### Integration (e2e) tests

```bash
npm run test:e2e
```

## Project Structure (high level)

```
src/
  common/
    filters/
    pipes/
  modules/
    ticket/
      controller/
      application/
      domain/
      infrastructure/
      dto/
```

## Notes

- No database is used; repository is in-memory.
- CRM integration is simulated and uses BullMQ for retries.
- All errors are normalized via a global exception filter.
