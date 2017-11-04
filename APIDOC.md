# API Documentation

Ensure you set the header `Content-Type: application/json` for all requests

If a user is not signed in for an action that they need to be signed in as, the status code will be 401, and the payload will be:

```json
{
  "errors": [
    "You need to sign in or sign up before continuing."
  ]
}
```

## Authentication

#### Signing up
#### `POST /users`

The sign up process is to make a request with a new user's information, after which you will get back a response with the user's information and the headers will contain the proper authentication tokens.

Request Parameters

```json
{
  "email": "email@example.com",
  "password": "abc123",
  "password_confirmation": "abc123",
  "username": "user.name",
  "type": "Student"
}
```

Request Parameters:

| User Fields | Description |
|-------|-------------|
| `email` | Required. The email that the user will use to sign in |
| `password` | Required. Their password. |
| `password_confirmation` | Required. Must mast the password parameter. |
| `type` | Required. Must be either "Student" or "Professor" |
| `username` | Optional (for now). What they will be referred to. Could be used for authentication later on. |

Return Object

```json
{
  "data": {
    "type": "students",
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes": {
      "email": "email@example.com",
      "username": "user.name",
    }
  }
}
```

If there is an error signing up, the payload will have the errors present and the values that were not provided will be null.

Error Payload:
```json
{
  "status":"error",
  "data":
  {
    "id":nil,
    "provider":"email",
    "uid":"",
    "username":"princess.buttercup",
    "email":"",
    "created_at":nil,
    "updated_at":nil,
    "type":"student"
  },
  "errors":{
    "attribute_name":[
      "error messages"
    ],
    "full_messages":[
      "Attribute Name error messages"
    ]
  }
}
```

#### Signing in
#### `POST /users/sign_in`

Signing in consists of sending authentication and getting request headers back to use in future requests.

Request Parameters

```json
{
  "email": "email@example.com",
  "password": "abc123",
}
```

Request Parameters:

| User Fields | Description |
|-------|-------------|
| `email` | Required. The email that the user will use to sign in |
| `password` | Required. Their password. |

Return Object

```json
{
  "data": {
    "type": "students",
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes": {
      "email": "email@example.com",
      "username": "user.name",
    }
  }
}
```

To sign in, you _must_ post requests with the headers that are returned with this object.

Return headers

| Header | Description |
|-------|-------------|
| `access-token` | Serves as the user's password |
| `client ` | This enables the use of multiple simultaneous sessions on different clients |
| `expiry` | When the session will expire |
| `uid` | The unique identifier that is used to find users |

If signing in fails, the proper headers will not be returned and there will be JSON with all of the errors.

Error Payload

```json
{
    "errors": [
      "Invalid login credentials. Please try again."
    ]
}

```

#### Signing out
#### `DELETE /users/sign_out`

In order to sign a user out a request to this endpoint will delete their current signed in headers and get rid of access tokens in the database. When making a call to this endpoint, ensure the credentials on the client are deleted since they are useless after this.

Success Payload (Code: 200)

```json
{
  "success": true,
}
```

Error Payload (Code: 404)

```json
{
  "errors": [
    "User was not found or was not logged in."
  ]
}
```

## Lab Sessions

#### Creating a Lab Session
#### `POST /lab_sessions`

You can create a session by creating a JSON representation of one and sending a post request to `/lab_sessions`.

Request Parameters
```json
{
    "description": "This is the description of the lab session",
    "token": "12345",
}
```

If the JSON has valid values, the lab session will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `description` | Optional. The description of the lab session. Will be empty otherwise |
| `token` | Optional. The unique token of the session. If not specified, it will be randomly generated. |

Return Object
```json
{
  "data": {
    "type": "lab-sessions",
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes": {
      "description": "Computer science lab about C",
      "token": "12345",
      "active": true,
    }
  }
}
```

If the JSON has invalid values, the lab session will not be created and there will be a payload with all of the errors.

Error Payload

```json
{
    "status": 422,
    "error": {
        "type": "resource_invalid",
        "errors": [
          {
              "attribute": "attribute_name",
              "message": "error message for the attribute",
          }
        ],
    }
}
```
