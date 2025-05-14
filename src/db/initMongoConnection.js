import mongoose from 'mongoose';

import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  const user = getEnvVar('MONGODB_USER');
  const password = getEnvVar('MONGODB_PASSWORD');
  const url = getEnvVar('MONGODB_URL');
  const db = getEnvVar('MONGODB_DB');

  try {
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=ContactsBook`,
    );
    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.log('Error while setting up mongo connection');
    throw err;
  }
};
