[Back to Topics](APIDOC.md)

## Lab Sessions

A Lab Session Object
```json
{
  "data": {
        "id": "998810dd-6830-42ef-8182-eb630ae9417f",
        "type": "lab-sessions",
        "attributes": {
            "description": "",
            "token": "83609b",
            "active": true,
            "course-id": "0950b466-effb-42f4-b8e0-8e73084581d6"
        },
        "relationships": {
            "questions": {
                "data": []
            },
            "users": {
                "data": []
            }
        }
    },
    "included": [
        {
            "id": "e0f2018a-2b36-401a-9c42-3245be316701",
            "type": "students",
            "attributes": {
                "email": "useremail@test.com",
                "username": "userInSession",
                "role": "none",
                "first-name": "User",
                "last-name": "inSession"
            }
        },...
    ]
}
```

#### Listing a users lab sessions
#### `GET /lab_sessions`

Return object
```json
{
  "data": [
    {
      "type": "lab-sessions",
      "id": "7ee48dd3-84a0-4e5b-adea-4794d5941683",
      "attributes": {
        "description": "Computer science lab about C",
        "token": "12345",
        "active": true,
        "course-id": "0950b466-effb-42f4-b8e0-8e73084581d6"
      },
      "relationships": {
        "questions": {
          "data": [],
        },
        "users": {
          "data": [],
        }
      },
    },
  ],
}
```

#### Creating a Lab Session
#### `POST /lab_sessions`

You can create a session by creating a JSON representation of one and sending a post request to `/lab_sessions`.

Request Parameters
```json
{
    "description": "This is the description of the lab session",
    "token": "12345",
    "course_id": "0950b466-effb-42f4-b8e0-8e73084581d6"
}
```

If the JSON has valid values, the lab session will be created.

Request Parameters:

| Lab Session Field | Description |
|-------|-------------|
| `description` | Optional. The description of the lab session. Will be empty otherwise |
| `token` | Optional. The unique token of the session. If not specified, it will be randomly generated. |
| `course_id` | Required. The unique identifier for the course a lab session is to be associated with.

Returns a json representation of a lab session as specified at the top of this file.

#### Updating a Lab Session
#### `PUT /lab_sessions/:id`

Request Parameters
```json
{
    "description": "This is the new description of the lab session",
    "token": "acb123",
    "course_id": "0950b466-effb-42f4-b8e0-8e73084581d6"
}
```

Returns a json representation of a lab session with the new values.

#### Getting a specific lab session
#### `GET /lab_sessions/:id`

Returns a json representation of the lab session if the user is a part of it.

#### Deleting a Lab Session
#### `DELETE /lab_sessions/:id`

If the user is a student and they are the only one on the lab session, it will be
deleted. Otherwise, it will return an error. If the user is a professor, the lab
session will be deleted.

In either case, the user must be a part of the lab session already.

Success Response Code 204 (No Content)

#### Joining a Lab Session
#### `POST /lab_sessions/join/:token`

You can join a session by supplying a valid token to and making a request to  `/lab_session/join/:token`.

Request Parameters
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

#### Leaving a lab session
#### `DELETE /lab_sessions/:id/leave`

If the user is a part of the lab session, they will be removed from it. They can
join again with the token.

Success Response Code 204 (No Content)
