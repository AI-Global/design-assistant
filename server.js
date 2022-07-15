const { SystemUpdate } = require('@material-ui/icons');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5050;
const MONGODB_URL = process.env.NODE_ENV == 'production' && process.env.MONGODB_URL || process.env.MONGODB_URL || 'mongodb+srv://OpromaAdmin:ZVyGDeCJSPXFC4o6@cluster0.krmr3.mongodb.net/rai-design-assistant-dev?retryWrites=true&w=majority';


// Force HTTPS
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV == 'production' &&
    req.headers['x-forwarded-proto'] != 'https'
  ) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// Serve static assets from backend
app.use((req, res, next) => {
  if (
    !req.originalUrl.startsWith('/api/') &&
    [
      'js',
      'json',
      'css',
      'png',
      'map',
      'ico',
      'txt',
      'jpg',
      'woff2',
      'woff',
      'ttf',
    ].filter((ext) => req.originalUrl.endsWith('.' + ext)).length == 0
  ) {
    // Serve index html
    return res.sendFile(path.join(__dirname, 'build', 'index.html'));
  }
  // Serve API or static build files
  next();
});

// CORS
app.use((req, res, next) => {
  let fetchOrigin = req.headers.origin;
  // TODO: validate fetchOrigin
  res.header('Access-Control-Allow-Origin', fetchOrigin);
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, X-Auth-Token, Content-Type, Accept, Authorization'
  );
  next();
});

app.use('/', express.static(path.join(__dirname, 'build')));
app.use(express.json());

app.use('/api/questions', require('./api/routes/questions'));
app.use('/api/responses', require('./api/routes/responses'));
app.use('/api/trustedAIProviders', require('./api/routes/trustedAIProviders'));
app.use('/api/trustedAIResources', require('./api/routes/trustedAIResources'));
app.use('/api/users', require('./api/routes/users'));
app.use('/api/submissions', require('./api/routes/submissions'));
app.use('/api/metadata', require('./api/routes/metadata'));
app.use('/api/dimensions', require('./api/routes/dimensions'));
app.use('/api/analytics', require('./api/routes/analytics'));
app.use('/api/subdimensions', require('./api/routes/subdimensions'));

let runServer = () => {
  mongoose.connection
    .on('error', console.warn)
    .on('disconnected', console.warn)
    .once('open', () => {
      console.log(`Serving http://:${PORT}`);
      app.listen(PORT);
    });
  return mongoose.connect(MONGODB_URL, {
    keepAlive: 1,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoReconnect: true,
  });
};

runServer();
