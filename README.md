# arctics-web-app

## Intro
Repository for server application at [www.arctics.academy](https://www.arctics.academy). Handles services including frontend serving, database operations, and automated emails.

## File Structure
```
root
├── bin/
│   └── www
├── public/
│   ├── build/
│   └── uploads/
├── routes/
├── models/
├── controllers/
├── middlewares/
├── utils/
├── statics/
│   └── emails/
├── docs/
├── app.js
├── Procfile
├── README.md
└── ...
```
* `bin/` contains app entry point in file `www`, which will call script in `app.js`. Service connections & top-level routing handled in `app.js`.
* `public/` contains build of frontend and user uploads, see below for deployment steps (V in MVC).
* `routes/` contains all routing functions. `index.routes` handles client frontend requests; `api.routes` handles frontend AJAX requests.
* `models/` contains all `mongoose` models (M in MVC).
* `controllers/` contains logic of application, such as scheduling appointments etc. (C in MVC).
* `middlewares/` contains all middlewares, handles file uploads and security checks.
* `utils/` contains utility functions needed in multiple controllers, such as calculating time and others.
* `statics/` contains all content (except frontend) that will be edployed through backend services (e.g. emails).
* `docs/` contains API documentation, feature faults, back logs.
* `Procfile` handles commands on Heroku development.

## Start Scripts
1. Production: `npm install && npm start`
2. Development: `npm install && npm run dev`

## Frontend Deployment Steps
1. Go to [`arctics-web-frontend`](https://github.com/Arctics-Academy/arctics-web-frontend) repository.
2. Run `yarn build`.
3. Copy `arctics-web-frontend/build/` folder into `arctics-web-app/frontend/` and replace current folder.
4. Write "`Deploy: Update frontend commit<7-digit-commit-id>`" as commit message when committing changes (eg. `Deploy: Add frontend commit8EC0960`).
5. `git push` to deploy on Heroku.

## Used Services
* Database: MongoDB (`env['MONGO_URI']`)
* Email: Mailgun (`env['MAILGUN_API_KEY']`)