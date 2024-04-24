require("dotenv/config");

require("./db");

const express = require("express");

const middleware  = require('./middleware/middleware')

const app = express();

const cors = require('cors');


// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

//enable CORS
app.use(cors());


// Contrary to the views version, all routes are controlled from the routes/index.js
const allRoutes = require("./routes/index.routes");
app.use("/api", allRoutes);

const  authRouter = require('./routes/auth.routes');
app.use("/auth", authRouter);

const propertyRouter = require('./routes/property.routes')
app.use('/api', combineMiddleware(middleware, propertyRouter));


require("./error-handling")(app);

module.exports = app;

function combineMiddleware(router, middleware) {
    return function(req, res, next) {
      middleware(req, res, function(err) {
        if (err) {
          return next(err);
        }
        next();
        router(req, res, next);
      });
    };
  }