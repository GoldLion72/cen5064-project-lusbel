const express = require('express');
const events = require('./routes/events')
const app = express();
const port  = 3000;

app.use('/events', events);

app.listen(port, () => {
    console.log(`Listening on port [${port}]`);
})