[Back to Topics](APIDOC.md)

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
      "role": "none"
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
    "type":"student",
    "role": "none"
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
      "role": "none"
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

#### Retrieving a User
#### `GET system/users/:user_id`

Return Payload

```json
{
  "data": {
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "type": "students",
    "attributes": {
      "email": "buttercup@example.com",
      "username": "butter.cup",
      "role": "none"
    },
  },
}
```

### Teaching Assistants
In order to promote or demote, the user who is doing it must be a professor.


#### Promoting a User to a TA
#### `POST /system/users/promote`

Request Parameters
```json
{
    "user_id": "8e6b3037-5bbd-48a3-a0a3-142287101d65",
}
```

If the JSON has valid values, the question will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `user_id` | Require. The id of the person who is being promoted |

The return object is the user that has been promoted.

```json
{
  "data": {
    "id": "8e6b3037-5bbd-48a3-a0a3-142287101d65",
    "type": "students",
    "attributes": {
      "email": "buttercup@example.com",
      "username": "butter.cup",
      "role": "ta"
    },
  },
}
```

#### Demoting a user from a TA
#### `POST /system/users/demote`

Request Parameters
```json
{
    "user_id": "8e6b3037-5bbd-48a3-a0a3-142287101d65",
}
```

If the JSON has valid values, the question will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `user_id` | Require. The id of the person who is being promoted |

The return object is the user that has been demoted.

```json
{
  "data": {
    "id": "8e6b3037-5bbd-48a3-a0a3-142287101d65",
    "type": "students",
    "attributes": {
      "email": "buttercup@example.com",
      "username": "butter.cup",
      "role": "none"
    },
  },
}
```
