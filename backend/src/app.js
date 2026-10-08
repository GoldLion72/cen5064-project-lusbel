const express = require('express');
const cors = require('cors');
import events from './routes/events';
import errorHandler from './middleware/errorHandler';
const app = express();
const port  = 3000;

app.use(cors());
app.use(express.json());
app.use('/api', events);

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello there!"});
})

app.use(errorHandler);

export default app;