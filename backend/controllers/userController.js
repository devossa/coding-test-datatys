const {
  getUserByEmail,
  getUserById,
  addUser,
  listUsers,
  handleDeleteUser,
  handleUpdateUser,
} = require("../services/user");
const responsify = require("../utils/responsify");
const Joi = require("joi");

const schema = Joi.object({
  first_name: Joi.string().min(3).required(),
  last_name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  country: Joi.string().min(3).required(),
  city: Joi.string().min(3).required(),
  phone_number: Joi.string().min(10).required(),
});

const createUser = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(
        responsify.error(400, "Email already used", { errors: error.details })
      );
  }

  const userExists = await getUserByEmail(req.body.email);
  if (userExists) {
    res.status(400).json(responsify.error(400, "Email already used"));
    return;
  }

  const { first_name, last_name, country, city, email, phone_number } =
    req.body;
  const newUser = await addUser(
    first_name,
    last_name,
    country,
    city,
    email,
    phone_number
  );
  res.json(responsify.success(newUser));
};

const getUsersList = async (req, res) => {
  const users = await listUsers();

  res.json(responsify.success(users));
};

const deleteUser = async (req, res) => {
  const user = await getUserById(req.params.id);
  if (user) {
    handleDeleteUser(req.params.id);
    res.json(responsify.success({}));
  } else {
    res.status(404).json(responsify.error(404, "Not found"));
  }
};

const updateUser = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(
        responsify.error(400, "Email already used", { errors: error.details })
      );
  }
  const user = await getUserById(req.params.id);
  if (user) {
    const { first_name, last_name, country, city, email, phone_number } =
      req.body;
    const responseData = await handleUpdateUser(
      req.params.id,
      first_name,
      last_name,
      country,
      city,
      email,
      phone_number
    );
    res.json(responsify.success(responseData));
  } else {
    res.status(404).json(responsify.error(404, "Not found"));
  }
};

module.exports = {
  createUser,
  getUsersList,
  deleteUser,
  updateUser,
};
