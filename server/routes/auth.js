import express from "express";
import passport from "passport";
import { pool } from "../config/database.js";
import { comparePassword, hashPassword } from "../utils/helpers.js";

const router = express.Router();

// router.post("/login", async (request, response) => {
//   const { email, password } = request.body;
//   if (!email || !password) {
//     return response.status(400).json({ message: "Missing credentials" });
//   }
//   try {
//     const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
//       email,
//     ]);
//     if (!result.rows || result.rows.length === 0) {
//       return response.status(401).json({ message: "Invalid credentials" });
//     }
//     const user = result.rows[0];
//     const isValid = comparePassword(password, user.password);
//     if (isValid) {
//       request.session.user = user;
//       return response.status(200).json({ message: "Logged in successfully" });
//     } else {
//       return response.status(401).json({ message: "Invalid credentials" });
//     }
//   } catch (error) {
//     return response.status(500).json({ error: error.message });
//   }
// });

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/api/auth/login/failed",
  }),
  async (req, res) => {
    try {
      // Assuming you have a users table in your database
      const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        req.user.id,
      ]);

      if (!result.rows || result.rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      const user = result.rows[0];

      // Now you have the full user data from the database
      res.status(200).json({ message: "Logged in successfully", user });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/login/success", (req, res) => {
  // This route will be reached when authentication is successful
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  } else {
    // Handle the case where the user object is not available
    res.status(401).json({ success: false, message: "User not authenticated" });
  }
});

router.get("/login/failed", (req, res) => {
  // This route will be reached when authentication fails
  res.status(401).json({ success: false, message: "Authentication failed" });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(200).json({ message: "Logged out successfully" });
        }
      });
    }
  });
});

router.post("/register", async (request, response) => {
  try {
    const {
      first_name,
      last_name,
      zipcode,
      phone,
      user_name,
      email,
      password,
    } = request.body;

    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (user.rows.length > 0) {
      response.status(400).json({ message: "User already exists" });
    } else {
      const hashedPassword = hashPassword(password);
      try {
        const newUser = await pool.query(
          `INSERT INTO users (first_name, last_name, zipcode, phone, user_name, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            first_name,
            last_name,
            zipcode,
            phone,
            user_name,
            email,
            hashedPassword,
          ]
        );
        // Log in the user immediately after successful registration
        request.login(newUser.rows[0], (err) => {
          if (err) {
            return response.status(500).json({ error: "Login failed" });
          }

          // Send the user data in the response
          return response
            .status(201)
            .json({
              message: "Registered and logged in successfully",
              user: newUser.rows[0],
            });
        });
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// router.post(
//   "/signup",
//   passport.authenticate("local-signup", { session: false }),
//   (req, res, next) => {
//     res.json({
//       user: req.user,
//     });
//   }
// );

export default router;
