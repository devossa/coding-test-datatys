const shajs = require("sha.js");
const db = require("../sql/db");

const SECRET = process.env.SECRET || "test-dev-secret";
const publicFields = [
  "id",
  "first_name",
  "last_name",
  "country",
  "city",
  "email",
  "password",
  "phone_number",
];
/**
 * Generate hash password
 * Generate online: https://emn178.github.io/online-tools/sha256.html
 * @param {string} email
 * @param {string} password
 */
const hashPassword = (email, password) =>
  shajs("sha256").update(`${email}${password}${SECRET}`).digest("hex");

const authenticateUser = async (email, password) => {
  const hash = hashPassword(email, password);
  const queryText = {
    text: ` SELECT s.id, s.email, s.first_name as firstName, s.last_name as lastName
              FROM users s
              WHERE email = $1 AND password = $2`,
    values: [email, hash],
  };
  try {
    const { rows } = await db.query(queryText);
    if (rows[0]) {
      const user = rows[0];
      return user;
    }
    throw new Error("Bad credentials");
  } catch (error) {
    throw new Error("Bad credentials");
  }
};

// In Typescript i would send these props in one object and use the spread operator to access each field
const addUser = async (
  first_name,
  last_name,
  country,
  city,
  email,
  phone_number
) => {
  const hash = hashPassword(email, Math.random());
  // Maybe send an email to the created user with their randomly generated password
  // I used Math.random for simplicity

  const queryText = {
    text: `INSERT INTO users (first_name, last_name, country, city, email, password, phone_number) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
          `,
    values: [first_name, last_name, country, city, email, hash, phone_number],
  };
  try {
    const { rows } = await db.query(queryText);
    if (rows[0]) {
      const { password, ...user } = rows[0];
      return user;
    }
    throw new Error("Something went wrong");
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

const handleUpdateUser = async (
  id,
  first_name,
  last_name,
  country,
  city,
  email,
  phone_number
) => {
  const queryText = {
    text: `UPDATE users SET first_name=$2,last_name=$3,country=$4,city=$5,email=$6,phone_number=$7
            WHERE id=$1
            RETURNING *;
          `,
    values: [id, first_name, last_name, country, city, email, phone_number],
  };
  try {
    const { rows } = await db.query(queryText);
    if (rows[0]) {
      const { password, ...user } = rows[0];
      return user;
    }
    throw new Error("Something went wrong");
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

const listUsers = async () => {
  const queryText = {
    text: `SELECT ${publicFields.join(", ")}
              FROM users s`,
  };
  try {
    const { rows } = await db.query(queryText);
    return rows;
  } catch (error) {
    return [];
  }
};

const getUserByEmail = async (email) => {
  const queryText = {
    text: `SELECT *
              FROM users s
              WHERE email = $1`,
    values: [email],
  };
  try {
    const { rows } = await db.query(queryText);
    if (rows[0]) {
      return rows[0];
    }
  } catch (error) {
    return undefined;
  }
};

const getUserById = async (id) => {
  const queryText = {
    text: `SELECT *
              FROM users s
              WHERE id = $1`,
    values: [id],
  };
  try {
    const { rows } = await db.query(queryText);
    if (rows[0]) {
      return rows[0];
    }
  } catch (error) {
    return undefined;
  }
};

const handleDeleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1;`;

  try {
    const result = await db.query(query, [id]);
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

module.exports = {
  authenticateUser,
  addUser,
  listUsers,
  getUserByEmail,
  getUserById,
  handleDeleteUser,
  handleUpdateUser,
};
