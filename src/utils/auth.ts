import bcrypt from 'bcrypt';
import type {Request} from 'express';
import jwt from 'jsonwebtoken';

const SALT_ROUND = 10;

const {
  // APPLE_CLIENT_ID,
  // REDIRECT_URL,
  JWT_SECRET = 'undefined',
  JWT_SECRET_ETC = 'etc',
} = process.env;

export const APP_SECRET = JWT_SECRET;
export const APP_SECRET_ETC = JWT_SECRET_ETC;

interface Token {
  userId: string;
}

/**
 * Extract userId from request.
 * @returns user id if available. null otherwise.
 */
export function getUserId(authorization?: string): string | null {
  if (!authorization) {
    return null;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const verifiedToken = jwt.verify(token, JWT_SECRET) as Token;

    return verifiedToken && verifiedToken.userId;
  } catch (err) {
    return null;
  }
}
// eslint-disable-next-line
export const getToken = (req: Request): string | undefined => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return undefined;
  }

  const token = authHeader.replace('Bearer ', '');
  const verifiedToken = jwt.verify(token, APP_SECRET) as Token;

  return verifiedToken && verifiedToken.userId;
};

export const encryptCredential = async (password: string): Promise<string> => {
  const SALT = await bcrypt.genSalt(SALT_ROUND);
  const hash = await bcrypt.hash(password, SALT);

  // Fix the 404 ERROR that occurs when the hash contains 'slash' or 'dot' value
  return hash.replace(/\//g, 'slash').replace(/\.$/g, 'dot');
};

export const validateCredential = async (
  value: string,
  hashedValue: string,
): Promise<boolean> =>
  new Promise<boolean>((resolve, reject) => {
    // Fix the 404 ERROR that occurs when the hash contains 'slash' or 'dot' value
    hashedValue = hashedValue.replace(/slash/g, '/');
    hashedValue = hashedValue.replace(/dot$/g, '.');

    bcrypt.compare(value, hashedValue, (err, res) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
