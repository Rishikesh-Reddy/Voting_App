"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ElectionAdmin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ElectionAdmin.hasMany(models.Elections, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  ElectionAdmin.init(
    {
      userId: DataTypes.STRING,
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ElectionAdmin",
    }
  );
  return ElectionAdmin;
};
