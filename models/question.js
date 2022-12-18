"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.hasMany(models.Vote, {
        foreignKey: "QId",
        onDelete: "CASCADE",
      });

      Question.hasMany(models.Option, {
        foreignKey: "QId",
        onDelete: "CASCADE",
      });

      Question.belongsTo(models.Elections, {
        foreignKey: "QId",
      });
    }
  }
  Question.init(
    {
      questionId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      desc: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Question",
    }
  );
  return Question;
};
