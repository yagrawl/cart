import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import order from './app/routes/order.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
             'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server for store.');
});

app.use('/api/order', order);

app.listen(PORT, () => console.log(`Server up and running on ${PORT}`));