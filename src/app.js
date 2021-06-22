const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Andrew Mead',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Stephan D',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is some helpful text',
    title: 'Help page',
    name: 'Stephan D',
  });
});

app.get('', (req, resp) => {
  resp.send('<h1>Weather</h1>');
});

// app.get('/help', (req, resp) => {
//   resp.send([
//     {
//       name: 'Andrew',
//     },
//     {
//       age: 27,
//     },
//   ]);
// });

// app.get('/about', (req, resp) => {
//   resp.send('<h1>About</h1>');
// });

app.get('/weather', (req, resp) => {
  if (!req.query.address) {
    return resp.send({
      error: 'There is no address, you must provide one',
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return resp.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return resp.send({ error });
        }
        resp.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get('/products', (req, resp) => {
  if (!req.query.search) {
    return resp.send({
      error: 'You must provide a search term',
    });
  }

  console.log(req.query.search);
  resp.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Stephan D',
    errorMessage: 'Help article not found',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Stephan D',
    errorMessage: 'Page not found',
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
