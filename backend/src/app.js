import express from 'express';
import cors from 'cors';
import events from './routes/events.js';
import errorHandler from './middleware/errorHandler.js';
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