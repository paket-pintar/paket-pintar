# BetterLetter
BetterLetter App is an application for managing received package in apartment environment, this app has:
* RESTful endpoint for package'sCRUD operation
* JSON formatted response

## RESTful endpoints
### POST /register
> create new user

_Request Header_
```
<not needed>
```

_Request Body_
```
{
  "email": "customer@mail.com",
  "password": "customer",
  "name": "First Customer",
  "unit": "9A / C2"
}
```

_Response (201 - Created)_
```
{
  "id": 8,
  "name": "First Customer",
  "email": "customer@mail.com",
  "unit": "9A / C2"
}
```
_Response (400 - Bad request)_
```
{
  "msg": "Email is required!, Password min. 6 characters!"
}
```

_Response (500 - Internal server error)_
```
{
  "msg": "internal server error"
}
```
---

### POST /login
> user login

_Request Header_
```
<not needed>
```

_Request Body_
```
{
  "email": "customer@mail.com",
  "password": "customer"
}
```

_Response (200 - OK)_
```
{
  "email": "customer@mail.com",
  "role": "customer",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImltcG9zdG9yQG1haWwuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNjA3ODY3MTQ0fQ.Ix9hC1V40CFQOaFeUwOIRZ28M8GFxTPZGHvtDbiDA28"
}
```
_Response (400 - Bad request)_
```
{
  "msg": "Email/password is wrong!, Password and email cannot be empty!"
}
```

_Response (500 - Internal server error)_
```
{
  "msg": "internal server error"
}
```
---
### POST /packages

> Create new packages

_Request Header_
```
{
  "accesstoken": "<your access token>"
}
```

_Request Body_
```
{
  "description": "Kado ulang tahun",
  "UserId": "3",
  "sender": "TIKA"
}
```

_Response (201 - Created)_
```
{
  "id": 5,
  "UserId": 3,
  "description": "Kado ulang tahun",
  "sender": "SICEPAT",
  "claimed": false,
  "updatedAt": "2020-12-13T13:48:55.516Z",
  "createdAt": "2020-12-13T13:48:55.516Z"
}
```
_Response (400 - Bad request)_
```
{
  "msg": "Title cannot be empty!, Sender cannot be empty!"
}
```
_Response (401 - Not authorized)_
```
{
  "msg": "not authorized!"
}
{
  "msg": "not authenticated!"
}
```

_Response (500 - Internal server error)_
```
{
  "msg": "internal server error"
}
```
---
### GET /packages

> Get all packages

_Request Header_
```
{
  "accesstoken": "<your access token>"
}
```

_Request Body_
```
<not needed>
```

_Response (200 - OK)_
```
[
  {
    "id": 5,
    "description": "Kado ulang tahun",
    "sender": "SICEPAT",
    "claimed": false,
    "UserId": 3,
    "createdAt": "2020-12-13T13:48:55.516Z",
    "updatedAt": "2020-12-13T13:48:55.516Z",
    "User": {
      "id": 3,
      "name": "impostor",
      "email": "impostor@mail.com"
    }
  },
  {
    "id": 4,
    "description": "Plastik hitam",
    "sender": "qiqi",
    "claimed": false,
    "UserId": 2,
    "createdAt": "2020-12-13T13:48:36.306Z",
    "updatedAt": "2020-12-13T13:48:36.306Z",
    "User": {
      "id": 2,
      "name": "customer2",
      "email": "customer2@mail.com"
    }
  }
]
```
_Response (401 - Not authorized!)_
```
{
  "msg": "not authorized!"
}
```
_Response (500 - Internal server error)_
```
{
  "msg": "internal server error"
}
```
---
### GET /packages/:id

> Get package by ID

_Request Header_
```
{
  "accesstoken": "<your access token>"
}
```

_Request Body_
```
<not needed>
```

_Response (200 - OK)_
```
{
  "id": 5,
  "description": "Kado ulang tahun",
  "sender": "SICEPAT",
  "claimed": false,
  "UserId": 3,
  "createdAt": "2020-12-13T13:48:55.516Z",
  "updatedAt": "2020-12-13T13:48:55.516Z",
  "User": {
    "id": 3,
    "name": "impostor",
    "email": "impostor@mail.com"
  }
}
```
_Request Params_
```
{
  "id": <number>
}
```
_Response (401 - Not authorized!)_
```
{
  "msg": "not authorized!"
}
```
_Response (404 - not found!)_
```
{
  "msg": "package not found!"
}
```
_Response (500 - Internal server error)_
```
{
  "msg": "internal server error"
}
```
---
### PUT /packages/:id

> Update packages

_Request Header_
```
{
  "accesstoken": "<your access token>"
}
```
_Request Params_
```
{
  "id": <number>
}
```
_Request Body_
```
{
  "description": "Kotak sedang",
  "sender": "DHL",
  "claimed": false,
  "UserId": 4
}
```

_Response (200 - OK)_
```
{
  "id": 1,
  "description": "Kotak sedang",
  "sender": "DHL",
  "claimed": false,
  "UserId": 4,
  "createdAt": "2020-12-11T15:14:58.658Z",
  "updatedAt": "2020-12-13T14:00:01.939Z"
}
```
_Response (400 - Bad request)_
```
{
  "msg": "Name is required!, CategoryId is required!"
}
```
_Response (401 - Not authorized!)_
```
{
  "msg": "not authorized!"
}
```
_Response (404 - Not Found!)_
```
{
  "msg": "package not found!"
}
```
_Response (500 - Internal server error)_
```
{
  "msg": "internal server error"
}
```
---
### DELETE /packages/:id

> Delete package by id

_Request Header_
```
{
  "accesstoken": "<your access token>"
}
```
_Request Params_
```
{
  "id": <number>
}
```
_Request Body_
```
<not needed>
```

_Response (200 - OK)_
```
{
  "msg" : "package deleted successfully!"
}
```
_Response (400 - Bad request)_
```
{
  "msg": "package ID is not valid!"
}
```
_Response (401 - Not authorized!)_
```
{
  "msg": "not authorized!"
}
```
_Response (404 - Not Found!)_
```
{
  "msg": "package not found!"
}
```
_Response (500 - Internal server error)_
```
{
  "msg": "internal server error"
}
```
---
### PUT /packages/:id

> claim package by id

_Request Header_
```
{
  "accesstoken": "<your access token>"
}
```
_Request Params_
```
{
  "id": <number>
}
```
_Request Body_
```
{
  "claimed": true
}
```

_Response (200 - OK)_
```
{
  "id": 1,
  "description": "Kotak sedang",
  "sender": "DHL",
  "claimed": true,
  "UserId": 4,
  "createdAt": "2020-12-11T15:14:58.658Z",
  "updatedAt": "2020-12-13T14:06:12.661Z"
}
```
_Response (400 - Bad request)_
```
{
  "msg": "package ID is not valid!"
}
```
_Response (401 - Not authorized!)_
```
{
  "msg": "not authorized!"
}
```
_Response (404 - Not Found!)_
```
{
  "msg": "package not found!"
}
```
_Response (500 - Internal server error)_
```
{
  "msg": "internal server error"
}
```
---