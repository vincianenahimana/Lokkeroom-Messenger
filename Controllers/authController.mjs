import bcrypt from "bcrypt";
import { createUser } from "../Models/usersModel.js";
import {
  findUserIdInFailedAttempts,
  incrementFailedAttempts,
  lockUserAccount,
  clearFailedAttempts,
  recordFirstFailedAttempt,
  findUserByEmail,
  getFailedLoginAttempts,
} from "../Models/authModel.js";
import jwt from "jsonwebtoken";

const MAX_FAILED_ATTEMPTS = 2;
const LOCK_DURATION = 2 * 60 * 1000;

const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userId = await createUser(email, hashedPassword, name);

    return res
      .status(201)
      .send({ message: "User created successfully", userId });
  } catch (error) {
    res.status(500).send({ message: "Error during user creation" });
  }
};

const login = async (req, res) => {
  //! 1. On verifie si les données requises sont présentes
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  //! 2. On verifie si le user existe
  const user = await findUserByEmail(email);

  if (!user || user.length === 0) {
    return res
      .status(404)
      .send({ message: "User not found: please verify the email address." });
  }

  const userInfos = user[0];
  const user_id = userInfos.user_id;

  //! 3. On verifie si le user n'est pas déjà bloqué
  let lockUntil;
  const userInTableFailedAttempts = await findUserIdInFailedAttempts(user_id);

  if (userInTableFailedAttempts.length > 0) {
    lockUntil = userInTableFailedAttempts[0].cant_login_until;

    if (new Date(previousLockUntil) > new Date(Date.now())) {
      return res.status(403).send({
        message: `Access denied: your account is temporarily locked. Please try after ${previousLockUntil}`,
      });
    }
  }
  //! 4. On verifie si le mot de passe est erronné
  const correctPassword = await bcrypt.compare(password, userInfos.password);

  if (!correctPassword) {
    if (userInTableFailedAttempts.length === 0) {
      await recordFirstFailedAttempt(user_id);
    } else {
      const failedAttempts = await getFailedLoginAttempts(user_id);
      const count_attempt = failedAttempts[0].count_attempt;
      await incrementFailedAttempts(user_id, count_attempt + 1);
    }

    const failedAttempts = await getFailedLoginAttempts(user_id);

    const count_attempt = failedAttempts[0].count_attempt;

    if (count_attempt >= MAX_FAILED_ATTEMPTS) {
      lockUntil = new Date(Date.now() + LOCK_DURATION);
      await lockUserAccount(lockUntil, user_id);

      return res.status(403).send({
        message: `Access denied: your account is temporarily locked. Please try after ${lockUntil}`,
      });
    }

    return res
      .status(401)
      .send({ message: "Authentication failed: incorrect password." });
  }

  //! 5. après le temps écoulé et que le mot de passe est juste ou sinon le user entre le bon password du 1er coup...

  if (userInTableFailedAttempts.length > 0) {
    lockUntil = userInTableFailedAttempts[0].cant_login_until;
    if (currentLockUntil <= new Date(Date.now())) {
      await clearFailedAttempts(user_id);
    }
  }

  const token = jwt.sign(
    { id: userInfos.user_id, email: userInfos.email },
    process.env.JWT_TOKEN,
    { expiresIn: "1h" }
  );

  return res.status(200).send({
    info: "Successfully logged in",
    token,
    message: "Your token will expire in 1 hour.",
  });
};

export { signUp, login };
