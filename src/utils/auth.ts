import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import * as process from 'node:process';

const generateToken = (
  userId: number,
  username: string,
  email: string,
  rut: string,
  roles: string[],
) => {
  return jwt.sign(
    { userId, username, email, rut, roles },
    process.env.SECRET_KEY,
    { expiresIn: '3h' },
  );
};

export default { generateToken };
