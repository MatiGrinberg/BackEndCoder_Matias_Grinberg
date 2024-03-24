class UserProfileDTO {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.role = user.role;
    this.id = user._id.toString();
  }
}

module.exports = UserProfileDTO;
