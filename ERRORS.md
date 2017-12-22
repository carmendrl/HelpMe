[Back to Topics](APIDOC.md)

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
