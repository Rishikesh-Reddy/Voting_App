"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Voters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Voters.hasMany(models.Vote, {
        foreignKey: "Vid",
        onDelete: "CASCADE",
      });

      Voters.hasMany(models.Elections, {
        foreignKey: "EId",
        onDelete: "CASCADE",
      });
    }
  }
  Voters.init(
    {
      voterid: DataTypes.STRING,
      password: DataTypes.STRING,
      votername: DataTypes.STRING,
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Voters",
    }
  );
  return Voters;
};
