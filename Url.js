import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';

const urlSchema = new Schema({
  fullUrl: {
    type: String,
    required: true,
    unique: true,
  },

  shortenedLink: {
    type: String,
    required: true,
    default: () => nanoid(30),
  },
});

export default model('Url', urlSchema);
