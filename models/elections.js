"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Elections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Elections.belongsTo(models.ElectionAdmin, {
        foreignKey: "userId",
      });

      Elections.hasMany(models.Question, {
        foreignKey: "electionId",
        onDelete: "CASCADE",
      });

      Elections.hasMany(models.Voters, {
        foreignKey: "electionId",
        onDelete: "CASCADE",
      });
    }
  }
  Elections.init(
    {
      electionId: DataTypes.STRING,
      electionName: DataTypes.STRING,
      customString: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Elections",
    }
  );
  return Elections;
};
