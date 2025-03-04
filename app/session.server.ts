import { createCookieSessionStorage } from 'react-router';
import { SESSION_KEY, User } from './auth.server';

type Session = {
  [SESSION_KEY]: User;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<Session>();

export { getSession, commitSession, destroySession };
