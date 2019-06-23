# Task Manager App

Example app to learn node JS.

To run locally, create two configuration files `config/dev.env` and `config/test.env` for development and testing, respectively. The test environment should be configured to use a different mongodb database.
A free SendGrid API key can be obtained at: https://sendgrid.com

```bash
PORT=3000
SENDGRID_API_KEY='...'
MONGODB_URL='mongodb://127.0.0.1:27017/task-manager-api'
JWT_SECRET='...'
```

Once created, use ```npm run dev```

