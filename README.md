# aam-demo-app

This app demonstrates how to run a single page app using Node server and AngularJS powered by AAM APIs. The app authenticates a user using OAuth2 authorization code flow. After successful authentication, the API access token is stored in the user's session on Node server and used automatically for other API calls.

**Prerequisites**
* node & npm


**Installation**
```bash
npm install
```

**Configuration**
* Configs are stored at `config/default.json`

**Run**
```bash
node server.js
```
Then visit: http://localhost:9000
