const express = require('express');
const mongoose = require('mongoose');

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
    ['js', 'json', 'css', 'png', 'map', 'ico', 'txt'].filter((ext) =>
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

app.use(express.json());

// need so that we don't use deprecated useFindAndModify method
mongoose.set('useFindAndModify', false);

// Import Routes
const questionsRouter = require('./api/routes/questions');
const responsesRouter = require('./api/routes/responses');
const trustedAIProvidersRouter = require('./api/routes/trustedAIProviders');
const trustedAIResourcesRouter = require('./api/routes/trustedAIResources');
const usersRouter = require('./api/routes/users');
const submissionsRouter = require('./api/routes/submissions');
const metaDataRouter = require('./api/routes/metadata');
const dimensionsRouter = require('./api/routes/dimensions');
const analyticsRouter = require('./api/routes/analytics');

app.use('/questions', questionsRouter);
app.use('/responses', responsesRouter);
app.use('/trustedAIProviders', trustedAIProvidersRouter);
app.use('/trustedAIResources', trustedAIResourcesRouter);
app.use('/users', usersRouter);
app.use('/submissions', submissionsRouter);
app.use('/metadata', metaDataRouter);
app.use('/dimensions', dimensionsRouter);
app.use('/analytics', analyticsRouter);

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
