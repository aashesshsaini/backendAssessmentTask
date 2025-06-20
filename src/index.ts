import mongoose, { ConnectOptions } from 'mongoose';
import config from './config/config';
import app from './app';
import { connectSocket } from "./utils/socket";
import { scheduleArchiveScoresAndReset } from './services/player/leaderBoard.service';

const mongooseOptions: ConnectOptions = {
};

mongoose.connect(config.mongoose.url, mongooseOptions).then(() => {
  console.log("Connected to MongoDB");
  const server = app.listen(config.port, () => {
    connectSocket(server);
    scheduleArchiveScoresAndReset();
    console.log(`Listening to port ${config.port}`);
  });
});


