import bcrypt from 'bcryptjs';

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} A Promise that resolves to the hashed password.
 * @throws Will throw an error if the password is not provided or if hashing fails.
 */
const bcryptPassword = async (password) => {
  if (!password) {
    throw new Error('Password must be provided');
  }

  try {
    // The number of salt rounds determines the strength of the hashing.
    // Higher number of rounds increases security but also increases hashing time.
    const saltRounds = 10;
    // Use bcrypt to hash the password asynchronously with the specified number of salt rounds.
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message);
  }
};

export default bcryptPassword;
