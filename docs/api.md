# spusu.at API Documentation

This document describes the unofficial spusu.at API endpoints discovered via browser network inspection.

## Base URL

```
https://www.spusu.at/imoscmsapi
```

## Common Headers

```
Accept: */*
Content-Type: application/json
saleschannel: Homepage
internalusertoken: (empty)
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...
```

## Authentication

spusu uses SMS TAN-based authentication with session cookies.

### Request TAN

Sends a TAN code via SMS to the provided phone number.

```
POST /authentication/tan/
```

**Request Body:**
```json
{
  "phoneNumber": "+43699XXXXXXXX"
}
```

**Response:** 200 OK (empty body on success)

### Login

Authenticate with phone number and TAN code.

```
POST /authentication/login/
```

**Request Body:**
```json
{
  "phoneNumberOrCustomerNumber": "+43699XXXXXXXX",
  "secret": "ABC"
}
```

**Response Headers:**
```
Set-Cookie: JSESSIONID=<session-id>; Path=/; HttpOnly
```

### Check Status

Verify current login status.

```
GET /user/status
```

**Response:**
```json
{
  "loginStatus": {
    "loggedIn": true,
    "billingContractId": 1234567,
    "name": "John Doe",
    "hasWriteAccess": true,
    "isContractAdmin": true
  }
}
```

## Customer

### Get Customer Info

```
GET /customerarea/customer/
```

**Response:**
```json
{
  "customerNumber": "1234567",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "eMail": "john@example.com",
  "street": "Example Street 1",
  "houseNumber": "",
  "zip": "1010",
  "city": "Vienna",
  "country": "AT",
  "language": {
    "language": "de-AT",
    "shortName": "DE",
    "name": "Deutsch",
    "nameInLanguage": "Deutsch"
  },
  "isCompany": false
}
```

## Invoices

### List Invoices

```
GET /customerarea/invoices
GET /customerarea/invoices?year=2025
```

**Response:**
```json
{
  "contractStartMonth": 6,
  "contractStartYear": 2023,
  "year": 2026,
  "invoices": [
    {
      "id": 123456,
      "billperiod": "02.2026",
      "invoiceNumber": "SR-123456/2026",
      "invoiceDate": "2026-03-02",
      "total": {
        "amount": 14.90,
        "currencyCode": "EUR"
      },
      "statusText": "Bezahlt",
      "status": "PAID",
      "deliveryText": "Online-Rechnung",
      "delivery": "INVOICE_ONLINE",
      "download": true,
      "itemisedBill": true
    }
  ],
  "paymentMethod": "SEPA",
  "paymentMethodState": "ACTIVE"
}
```

### Download Invoice PDF

```
GET /customerarea/invoices/{year}/id/{invoiceId}
```

**Response:** Binary PDF file

### Download Itemised Bill (Excel)

```
GET /customerarea/invoices/{year}/id/{invoiceId}/itemisedbill/file
```

**Response:** Binary Excel file (.xlsx)

## Tariffs

### List Tariffs/Contracts

```
GET /portings/mobile
```

**Response:**
```json
[
  {
    "contractType": "POSTPAID",
    "productKey": "imsi1234567",
    "phoneAccountId": 1234567,
    "phoneNumber": "+43699XXXXXXXX",
    "tariffName": "spusu 5G legendär",
    "companyName": "",
    "lastname": "Doe",
    "firstname": "John",
    "birthDay": "1990-01-01",
    "previousProviderId": 56,
    "portingDateTime": "2023-06-12T00:00:00+02:00",
    "terminationType": "AFTER_CONTRACT",
    "isSigned": false,
    "isPreValidated": false,
    "portingErrors": [],
    "status": "FINISHED",
    "transferPrepaidCredit": false
  }
]
```

## Session Management

- Sessions are maintained via `JSESSIONID` cookie
- Sessions expire after inactivity (exact timeout unknown)
- Re-authenticate when receiving 401/403 responses

## Notes

- All authenticated endpoints require the `JSESSIONID` cookie
- Phone numbers must be in Austrian format: `+43...`
- Invoice IDs are numeric and unique per year
- The API may change without notice as it's unofficial
