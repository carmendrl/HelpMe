# API Documentation

Ensure you set the header `Content-Type: application/json` for all requests

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
    },
    "relationships": {
      "questions": {
        "data": [],
      },
    },
  },
}
```

#### Joining a Lab Session
#### `POST /lab_sessions/join/:token`

You can join a session by supplying a valid token to and making a request to  `/lab_session/join/:token`.

equest Parameters
```json
{
    "token": "12345",
}
```

If token in the JSON is valid, the user will join the session.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `token` | Required. The unique token of the session. |

Return Object

```json
{
  "data" : {
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "type" : "lab-session-memberships",
    "attributes" : {
      "created-at" : "2017-11-13T12:02:01Z",
    },
    "relationships" : {
      "lab-session" : {
        "data" : {
          "id" : "3e97d41c-8039-48b9-afbc-8abdb6dea46f",
          "type" : "lab-sessions",
        },
      },
      "user" : {
        "data" : {
          "id" : "402a84b0-e003-4092-9c67-581bd175fe1b",
          "type" : "students",
        },
      },
    },
  },
}
```

## Questions

A user must be a part of a session to manipulate any of the questions in that session.

#### Questions have three different states:
- Pending
- Claimed
- Answered

#### Creating a Question
#### `POST /lab_sessions/:lab_session_id/questions`

Request Parameters
```json
{
    "text": "Why is abbreviated such a long word?",
}
```

If the JSON has valid values, the question will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `text` | Required. The text of the question |

Return Object for Students

```json
{
  "data": {
    "type": "questions",
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes": {
      "text": "Why is abbreviated such a long word?",
      "created-at": "2017-11-10T12:00:00Z",
    },
  }
}
```

Return Object for Professors

This will include the asker of the question. When the professor creates the question, clearly he or she is the asker. Only professors will be able to see the asker.

```json
{
  "data" : {
    "type" : "questions",
    "id" : "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes" : {
      "text" : "Why is abbreviated such a long word?",
      "created-at" : "2017-11-10T12:00:00Z",
    },
    "relationships" : {
      "asker" : {
        "data" : {
          "type" : "professors",
          "id" : "52a11fe7-8394-48fc-bc42-8375555eed17",
        },
      },
    },
  },
}
```

#### Getting a Question
#### `GET /lab_sessions/:lab_session_id/questions/:question_id`

Return object for students
```json
{
  "data": {
    "type": "questions",
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes": {
      "text": "How much wood can a woodchuck chuck?",
      "created-at": "2017-11-10T12:00:00Z",
    },
  }
}
```

Return object for professors
```json
{
  "data" : {
    "type" : "questions",
    "id" : "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes" : {
      "text" : "How much wood can a woodchuck chuck?",
      "created-at" : "2017-11-10T12:00:00Z",
    },
    "relationships" : {
      "asker" : {
        "data" : {
          "type" : "students",
          "id" : "2b460811-fae1-49ab-98f5-f2a783a2a1db",
        },
      },
    },
  },
}
```

#### Updating a Question
#### `PUT /lab_sessions/:lab_session_id/questions/:question_id`

Request Parameters
```json
{
    "text": "How much wood can a woodchuck chuck?",
    "claimed_by_id": "8e6b3037-5bbd-48a3-a0a3-142287101d65",
}
```

If the JSON has valid values, the question will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `text` | Required. The text of the question |
| `claimed_by_id` | Optional. The id of the person who has claimed the question |

Return Object for Students

```json
{
  "data": {
    "type": "questions",
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes": {
      "text": "How much wood can a woodchuck chuck?",
      "created-at": "2017-11-10T12:00:00Z",
    },
  }
}
```

Return Object for Professors

Notice that it was a student who asked this question, but the professor updated it. It still keeps the student as the original asker.

```json
{
  "data" : {
    "type" : "questions",
    "id" : "7ee48dd3-84a0-4e5b-adea-4794d5941683",
    "attributes" : {
      "text" : "How much wood can a woodchuck chuck?",
      "created-at" : "2017-11-10T12:00:00Z",
    },
    "relationships" : {
      "asker" : {
        "data" : {
          "type" : "students",
          "id" : "2b460811-fae1-49ab-98f5-f2a783a2a1db",
        },
      },
      "claimed-by" : {
        "data" : {
          "type" : "professors",
          "id" : "8e6b3037-5bbd-48a3-a0a3-142287101d65",
        },
      },
    },
  },
}
```

#### Listing Questions from a Lab Session
#### `GET lab_sessions/:lab_session_id/questions`

If requestor is a student response payload

```json
{
  "data" : [
    {
      "id" : "7ee48dd3-84a0-4e5b-adea-4794d5941683",
      "type" : "questions",
      "attributes" : {
        "text" : "What is a string?",
        "created-at" : "2017-11-10T12:00:00Z",
      },
    },
    {
      "id" : "8e6b3037-5bbd-48a3-a0a3-142287101d65",
      "type" : "questions",
      "attributes" : {
        "text" : "How do I call a method?",
        "created-at" : "2017-11-10T12:00:00Z"
      },
      "relationships" : {
        "claimed-by" : {
          "data" : {
            "type" : "professors",
            "id": "8e6b3037-5bbd-48a3-a0a3-142287101d65",
          },
        },
      },
    },
  ],
}
```

If requestor is a professor response payload

```json
{
  "data" : [
    {
      "id" : "7ee48dd3-84a0-4e5b-adea-4794d5941683",
      "type" : "questions",
      "attributes" : {
        "text" : "What is a string?",
        "created-at" : "2017-11-10T12:00:00Z"
      },
      "relationships" : {
        "asker" : {
          "data" : {
            "type" : "students",
            "id" : "2b460811-fae1-49ab-98f5-f2a783a2a1db",
          },
        },
      },
    },
    {
      "id" : "8e6b3037-5bbd-48a3-a0a3-142287101d65",
      "type" : "questions",
      "attributes" : {
        "text" : "How do I call a method?",
        "created-at" : "2017-11-10T12:00:00Z"
      },
      "relationships" : {
        "asker" : {
          "data" : {
            "type" : "students",
            "id" : "314df30b-078b-437c-84c1-edc3949d3ae2",
          },
        },
      },
    },
  ],
}
```

#### Deleting a Question
#### `DELETE /lab_sessions/:lab_session_id/questions/:question_id`

Success Response Code 204 (No Content)

#### Claiming a Question
### `GET /lab_sessions/:lab_session_id/questions/:id/claim`

In order to claim a question, issue an authorized get request with the specified ids.

#### Answering a Question
### `GET /lab_sessions/:lab_session_id/questions/:id/answer`

To answer a question, include the specfied id in an authorized request as well as an optional text answer to the question.

## Answers

#### Creating an Answer
#### `POST /lab_sessions/:lab_session_id/questions/:question_id/answer`

Request Parameters
```json
{
    "text": "This is an anwswer to a question",
}
```

If the JSON has valid values, the answer will be created.

Request Parameters:

| Answer Field | Description |
|-------|-------------|
| `text` | Optional. The text of the answer |
| `answerer` | Optional. The user who anwsered the question |

Return object

```json
{
  "data": {
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941187",
    "type": "answers",
    "attributes": {
      "text": "This is an answer to a question",
      "created-at": "2017-12-1T12:00:00Z",
    },
    "relationships": {
      "answerer" : {
        "data" : {
          "id" : "9cf952b0-33cd-4beb-ac5a-9a43173e534e",
          "type" : "professors"
        },
      },
    },
  }
}
```

#### Getting an Answer
#### `GET /lab_sessions/:lab_session_id/questions/:question_id/answer`

Return object

```json
{
  "data": {
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941187",
    "type": "answers",
    "attributes": {
      "text": "This is an answer to a question",
      "created-at": "2017-12-1T12:00:00Z",
    },
    "relationships" : {
      "answerer" : {
        "data" : {
          "id" : "9cf952b0-33cd-4beb-ac5a-9a43173e534e",
          "type" : "professors"
        },
      },
    },
  }
}
```

#### Editing an Answer
#### `PUT /lab_sessions/:lab_session_id/questions/:question_id/answer`
Request Parameters
```json
{
    "text": "This is a new, updated anwswer",
}
```

If the JSON has valid values, the answer will be updated.

Request Parameters:

| Answer Field | Description |
|-------|-------------|
| `text` | Optional. The text of the answer |
| `answerer_id` | Optional. The user who anwsered the question |


Return object

```json
{
  "data": {
    "id": "7ee48dd3-84a0-4e5b-adea-4794d5941187",
    "type": "answers",
    "attributes": {
      "text": "This is a new, updated anwswer",
      "created-at": "2017-12-1T12:00:00Z",
    },
    "relationships" : {
      "answerer" : {
        "data" : {
          "id" : "9cf952b0-33cd-4beb-ac5a-9a43173e534e",
          "type" : "professors"
        },
      },
    },
  }
}
```

#### Deleting an Answer
#### `DELETE /lab_sessions/:lab_session_id/questions/:question_id/answer`

Success Response Code 204 (No Content)

## Errors

#### Not signed in (Code: 401)
If a user is not signed in for an action that they need to be signed in as, the status code will be 401, and the payload will be:

```json
{
  "errors": [
    "You need to sign in or sign up before continuing."
  ]
}
```

#### Could not find resource (Code: 404)
When requesting a resource with an invalid ID or without proper access-rights (even when signed in) the response will be a 404 with the following payload:

```json
{
  "error": {
    "type": "resource_not_found",
    "message": "Couldn't find resource_name",
  },
}
```

#### Invalid Resource (Code: 422)
wWhen making a request to update or create a resource with invalid parameters, the response code will be a 422 with the following payload:

```json
{
  "error": {
    "type": "resource_invalid",
    "errors": {
      "attribute" : "attribute_name",
      "message" : "attribute_name error_messages",
    },
  },
}
```
