const express = require('express')
const app = express()
const {initializeDatabase} = require('./database/database')
const config = require('./config')
const cors = require('cors')
const eventsRouter = require('./routes/events')
const venuesRouter = require('./routes/venues')
const artistsRouter = require('./routes/artists')
const usersRouter = require('./routes/users')
const jwt = require('express-jwt')
const {jwtConfig} = require("./config");
const authRole = require('./basicAuth')

//set up everything
initializeDatabase();
app.use(express.json());
app.use(cors({origin: config.allowedFrontendOrigin}));

//protect routes against unauthorized access
app.use('/events/create', jwt(jwtConfig), authRole("admin", "technician"));
app.use('/artists/create', jwt(jwtConfig), authRole("admin", "technician"));
app.use('/venues/create', jwt(jwtConfig), authRole("admin"));

//register all routes
app.use('/events', eventsRouter);
app.use('/venues', venuesRouter);
app.use('/artists', artistsRouter);
app.use('/users', usersRouter);

//start the app on the given port
const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

