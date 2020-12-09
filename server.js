const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

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
    ['js', 'json', 'css', 'png', 'map', 'ico', 'txt', 'jpg'].filter((ext) =>
      req.originalUrl.endsWith('.' + ext)
    ).length == 0
  ) {
    // Serve index html
    return res.sendFile(path.join(__dirname, 'build', 'index.html'));
  }
  // Serve API or static build files
  next();
});

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

app.use('/', express.static(path.join(__dirname, 'build')));
app.use(express.json());

// need so that we don't use deprecated useFindAndModify method
mongoose.set('useFindAndModify', false);

app.use('/questions', require('./api/routes/questions'));
app.use('/responses', require('./api/routes/responses'));
app.use('/trustedAIProviders', require('./api/routes/trustedAIProviders'));
app.use('/trustedAIResources', require('./api/routes/trustedAIResources'));
app.use('/users', require('./api/routes/users'));
app.use('/submissions', require('./api/routes/submissions'));
app.use('/metadata', require('./api/routes/metadata'));
app.use('/dimensions', require('./api/routes/dimensions'));
app.use('/analytics', require('./api/routes/analytics'));

mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to DB');
    // Listen on port
    app.listen(port, '0.0.0.0', () => {
      console.log('Listening on port ' + port);
    });
  }
);

module.exports = app;
