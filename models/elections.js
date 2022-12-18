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
        foreignKey: "UId",
      });

      Elections.hasMany(models.Question, {
        foreignKey: "EId",
        onDelete: "CASCADE",
      });

      Elections.hasMany(models.Voters, {
        foreignKey: "EId",
        onDelete: "CASCADE",
      });
    }
  }
  Elections.init(
    {
      electionId: DataTypes.INTEGER,
      electionName: DataTypes.STRING,
      customString: DataTypes.STRING,
      isLive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Elections",
    }
  );
  return Elections;
};
