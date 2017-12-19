[Back to Topics](APIDOC.md)

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
