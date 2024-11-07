import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import puzzleRouter from './routers/puzzleRouter.js';
import imageRouter from './routers/imageRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

app.use('/puzzle', puzzleRouter);
app.use('/', imageRouter); // Add this line

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});