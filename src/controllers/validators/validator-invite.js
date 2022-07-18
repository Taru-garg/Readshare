const Invite = require("../../../models/Invite");
const User = require("../../../models/User");
const { param } = require("express-validator");

const inviteValidator = () => {
  return [
    param("id").isMongoId(),
    param("id").custom(async (id, { req }) => {
      const invite = await Invite.findById(id);
      if (!invite) {
        throw new Error("Invite not found");
      }
      if (invite.userId !== req.user.id) {
        throw new Error("Invalid invite");
      }
    }),
  ];
};

module.exports = {
  inviteValidator: inviteValidator,
};
