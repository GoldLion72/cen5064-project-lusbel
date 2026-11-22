import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import auth from './routes/auth.js';
import events from './routes/events.js';
import progress from './routes/progress.js';
import requireAuth from './middleware/requireAuth.js';
import errorHandler from './middleware/errorHandler.js';
const app = express();

// Cookies are only sent cross-origin when the origin is explicit and credentials are allowed.
const allowedOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

app.use(cors({origin: allowedOrigin, credentials: true}));
app.use(express.json());
app.use(cookieParser());

// Public auth routes first; everything after requireAuth needs a logged-in user.
app.use('/api', auth);
app.use('/api', requireAuth, events, progress);

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello there!"});
})

app.use(errorHandler);

export default app;
