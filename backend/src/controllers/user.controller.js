const getUser = async (req, res) => {
  const { email } = req.user;
  res.status(200).json({
    message: "User logged in ",
    email,
  });
};
module.exports = { getUser };
