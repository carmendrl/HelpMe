# API Documentation

## Sessions

#### Creating a Session
#### `POST /sessions`

You can create a session by creating a JSON representation of one and sending a post request to `/sessions`. Ensure you set the header `Content-Type: application/json` for the request

Request Parameters
```json
{
    "description": "This is the description of the session",
    "number": 12345,
}
```

If the JSON has valid values, the session will be created.

Request Parameters:

| Session Field | Description |
|-------|-------------|
| `description` | Optional. The description of the session. Will be nil otherwise |
| `number` | Optional. The unique number of the session. If not specified, it will be randomly generated. |

Return Object
```json
{
    "description": "This is the description of the session",
    "number": 12345,
    "active": true,
}
```

If the JSON has invalid values, the session will not be created and there will be a payload with all of the errors.

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
