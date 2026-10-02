const express = require('express');
const events = require('./routes/events')
const app = express();
const port  = 3000;

app.use('/events', events);

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello there!"});
})

app.listen(port, () => {
    console.log(`Listening on port [${port}]`);
})