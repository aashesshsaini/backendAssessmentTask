import mongoose, { ConnectOptions } from 'mongoose';
import config from './config/config';
import app from './app';

const mongooseOptions: ConnectOptions = {
};

mongoose.connect(config.mongoose.url, mongooseOptions).then(() => {
  console.log("Connected to MongoDB");
  const server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
});


