"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vote.belongsTo(models.Voters, {
        foreignKey: "voterId",
      });

      Vote.hasOne(models.Question, {
        foreignKey: "questionId",
        onDelete: "CASCADE",
      });

      Vote.hasOne(models.Option, {
        foreignKey: "optionId",
        onDelete: "CASCADE",
      });
    }
  }
  Vote.init(
    {
      voteId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Vote",
    }
  );
  return Vote;
};
