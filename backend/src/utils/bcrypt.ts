import * as bcrypt from 'bcrypt';

export const hashPassword = (plainPassword: string): string => {
  const SALT_ROUNDS = 10;

  return bcrypt.hashSync(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (
  plainPassword: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compareSync(plainPassword, hash);
};
