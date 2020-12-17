# Open Endpoints :

`/register`

`/login`

# Closed Endpoints :

`/packages`

`/packages/:id`

# User

## User Register

User can register

### Endpoint

`/register`

### Method

`POST`

### Required Body

```json
{
  "name": "John",
  "password": "password",
  "email": "john@mail.com"
}
```

### Result

Status : 201

```json
{
  "id": "1",
  "name": "John",
  "email": "john@mail.com",
  "role": "customer"
}
```

## User Login

User can login

### Endpoint

`/login`

### Method

`POST`

### Required Body

```json
{
  "email": "john@mail.com",
  "password": "password"
}
```

### Result

Status : 200

```json
{
  "access_token": "JWT Access Token"
}
```

### Error

Status : 401

```json
{
  "msg": "Email/password is wrong"
}
```

# Packages

## Get Packages

Fetch packages data from server

User with admin role will get all data, and user with customer role will only get his/her data.

### Endpoint

`/packages`

### Method

`GET`

### Required Header

```json
{
  "access_token": "JWT Access token"
}
```

### Result

Status : 200

```json
{
  "packages": [
    {
      "id": 1,
      "description": "Hitam besar dari JNE",
      "sender": "Toko X",
      "claimed": "false",
      "UserId": 2
    }
  ]
}
```

## Get Package by ID

Fetch a package data by its ID from server

### Endpoint

`/packages/:id`

### Method

`GET`

### Required URL Params

`id : Package ID [INT]`

### Required Header

```json
{
  "access_token": "JWT Access token"
}
```

### Result

Status : 200

```json
{
  {
    "id": 1,
    "description": "Hitam besar dari JNE",
    "sender" : "Toko X",
    "claimed" : "false",
    "UserId" : 2
  }

}
```



## Create Package

Insert new package to the database. Require Admin role

### Endpoint

`/packages`

### Method

`POST`

### Required Header

```json
{
  "access_token": "JWT Access token"
}
```

### Required Body
```json
{
  "UserId" : 2,
  "description" : "Hitam besar dari JNE",
  "sender" : "Toko X"
}
```


### Result

Status : 201

```json
{
  {
    "id": 1,
    "description": "Hitam besar dari JNE",
    "sender" : "Toko X",
    "claimed" : "false",
    "UserId" : 2
  }

}
```


## Update Package

Edit existing package details. Require Admin role

### Endpoint

`/packages/:id`

### Method

`PUT`


### Required URL Params

`id : Package ID [INT]`


### Required Header

```json
{
  "access_token": "JWT Access token"
}
```

### Required Body
```json
{
  "UserId" : 2,
  "description" : "Hitam besar dari JNE",
  "sender" : "Toko X",
  "claimed" : false
}
```


### Result

Status : 201

```json
{
  {
    "id": 1,
    "description": "Hitam besar dari JNE",
    "sender" : "Toko X",
    "claimed" : true,
    "UserId" : 2
  }

}
```


## Delete Package

Remove package from DB by ID. Require Admin Rold

### Endpoint

`/packages/:id`

### Method

`DELETE`


### Required URL Params

`id : Package ID [INT]`


### Required Header

```json
{
  "access_token": "JWT Access token"
}
```

### Result
```json
{
  "msg" : "package deleted successfully!"
}
```