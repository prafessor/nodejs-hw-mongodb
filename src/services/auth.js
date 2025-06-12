import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email is use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({ ...payload, password: hashedPassword });
};

const createSession = (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const session = createSession(user._id);

  return await Session.create(session);
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(403, 'Session token is expired');
  }

  const newSession = createSession(session.userId);

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create(newSession);
};

export const logoutUser = async (sessionId, refreshToken) => {
  await Session.deleteOne({ _id: sessionId, refreshToken });
};

export const requestResetPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new createHttpError(404, 'User not found!');
  }
  const jwtToken = jwt.sign(
    { sub: user._id, email: user.email },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '5m' },
  );

  const link = `${getEnvVar('APP_DOMAIN')}/reset-password?token=${jwtToken}`;

  await sendEmail({
    from: getEnvVar('SMTP_FROM'),
    to: user.email,
    subject: 'Reser password',
    html: `<p>Click to change password <a href="${link}">here</a></p>`,
  });
};

export const resetPassword = async (password, token) => {
  let decoded;

  try {
    decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
  } catch {
    throw new createHttpError(401, 'Token is expired or invalid');
  }

  const user = await User.findOne({ _id: decoded.sub });
  if (!user) {
    throw new createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.updateOne({ _id: user._id }, { password: hashedPassword });
  await Session.deleteMany({ userId: user._id });
};
