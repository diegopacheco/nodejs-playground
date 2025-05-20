### Result

```bash
npm run run
```

```
❯ npm run run

> zod-v4-fun@1.0.0 run
> node index.js

{ username: 'billie', xp: 100 }
{
  "issues": [
    {
      "expected": "string",
      "code": "invalid_type",
      "path": [
        "username"
      ],
      "message": "Invalid input: expected string, received number"
    },
    {
      "expected": "number",
      "code": "invalid_type",
      "path": [
        "xp"
      ],
      "message": "Invalid input: expected number, received boolean"
    }
  ]
}
[
  {
    expected: 'string',
    code: 'invalid_type',
    path: [ 'username' ],
    message: 'Invalid input: expected string, received number'
  },
  {
    expected: 'number',
    code: 'invalid_type',
    path: [ 'xp' ],
    message: 'Invalid input: expected number, received boolean'
  }
]
```