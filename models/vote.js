"use strict";
const { Model } = require("sequelize");
// eslint-disable-next-line no-unused-vars
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
        foreignKey: {
          name: "VId",
          allowNull: false,
        },
        onDelete: "CASCADE",
      });

      Vote.belongsTo(models.Question, {
        foreignKey: "QId",
        onDelete: "CASCADE",
      });

      Vote.belongsTo(models.Option, {
        foreignKey: "OId",
        onDelete: "CASCADE",
      });
    }
  }
  Vote.init(
    {},
    {
      sequelize,
      modelName: "Vote",
    }
  );
  return Vote;
};
