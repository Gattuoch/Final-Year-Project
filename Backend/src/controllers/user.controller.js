import User from "../models/User.model.js";
import bcrypt from "bcrypt";

export const createInternalUser = async (req, res) => {
  const { name, email, role } = req.body;

  const tempPassword = "Temp@123";
  const hash = await bcrypt.hash(tempPassword, 10);

  const user = await User.create({
    name,
    email,
    role,
    password: hash,
    mustResetPassword: true
  });

  res.json({
    message: "Internal user created",
    tempPassword,
    user
  });
};
