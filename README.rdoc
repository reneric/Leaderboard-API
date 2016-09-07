== README

# Entries

## Entries [/entries/{?orderBy,direction}]

### Get Entries [GET]

+ Parameters
    + orderBy (string, `score`) ... The field in which to order entries
        + Values
            + `score`
            + `email`
            + `name`
    + direction (string, `asc`) ... The direction in which to order entries
        + Values
            + `asc`
            + `desc`

+ Response 200 (application/json; charset=utf-8)

    + Headers

            X-Total-Count: 1

    + Body

            {
                "entries": [
                    {
                      "id": "1",
                      "uri": "/entries/1/",
                      "name": "John Smith",
                      "email": john.smith@gmail.com,
                      "score": 100
                    },
                    {
                      "id": "2",
                      "uri": "/entries/2/",
                      "name": "Ren Simmons",
                      "email": rsimmo412@gmail.com,
                      "score": 110
                    }
                ]
            }

    + Schema

            {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "type": "object",
              "properties": {
                "entries": {
                  "type": "array",
                  "items": [
                    {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string"
                        },
                        "uri": {
                          "type": "string"
                        },
                        "name": {
                          "type": "string"
                        },
                        "email": {
                          "type": "string"
                        },
                        "score": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "id",
                        "uri",
                        "name",
                        "email",
                        "score",
                      ]
                    }
                  ]
                }
              },
              "required": [
                "entries"
              ]
            }
