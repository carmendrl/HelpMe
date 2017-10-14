# API Documentation

## Lab Sessions

#### Creating a Lab Session
#### `POST /lab_sessions`

You can create a session by creating a JSON representation of one and sending a post request to `/lab_sessions`. Ensure you set the header `Content-Type: application/json` for the request

Request Parameters
```json
{
    "description": "This is the description of the lab session",
    "number": "12345",
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
    "id": "SessionID",
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
