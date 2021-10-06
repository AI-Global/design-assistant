# Responsible AI Design Assistant pr test 

#### [By AI Global](https://ai-global.org/)

## Development

[Original Documentation](https://github.com/AI-Global/design-assistant/tree/master/docs)

> You will need to use [vscode](https://code.visualstudio.com/) in order to use our auto-formatting tools and linting.

#### Getting Started

Set the following environment variables:

```
MONGODB_URL=mongodb+srv...secret...
REACT_APP_API_BASE_URL=http://localhost:5000
```

Then run:

```
$ git clone https://github.com/AI-Global/design-assistant && cd design-assistant
$ yarn install
$ yarn watch:react
```

To start the backend, open another terminal and do:

```
$ yarn watch:api
```

#### Layout

- `/src` - the react app
- `/src/views` - each UI page
- `/src/Components` - reusable react components
- `/public` - static assets (images, compiled JS libraries, etc)
- `/api` - the express backend
- `/.vscode` - shared vscode settings for the project

#### Helpful Docs

- [ExpressJS](https://expressjs.com/en/5x/api.html)
- [Mongoose](https://mongoosejs.com/docs/guide.html)
