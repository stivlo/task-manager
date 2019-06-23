# Task Manager App

Example app to learn node JS.

To run locally, create two configuration files `config/dev.env` and `config/test.env` for development and testing, respectively. The test environment should be configured to use a different mongodb database.

* PORT: you can leave 3000 or customise to your needs
* SENDGRID_API_KEY: a free SendGrid API key can be obtained at: https://sendgrid.com
* MONGODB_URL: configure to use your local mongodb instance. Use two different database names such as `task-manager-dev` and `task-manager-test` for dev and test environment.
* JWT_SECRET: generate a long, strong password, for instance 32 characters long


```bash
PORT=3000
SENDGRID_API_KEY='...'
MONGODB_URL='mongodb://127.0.0.1:27017/task-manager-dev'
JWT_SECRET='...'
```

Once created, use ```npm run dev```

