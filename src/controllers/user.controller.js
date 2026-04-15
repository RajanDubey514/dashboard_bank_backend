import { User } from "../models/user.model.js";

export const createTestUser = async (req, res) => {
  try {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com"
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};