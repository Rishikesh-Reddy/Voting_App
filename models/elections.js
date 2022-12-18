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

    static async createElection({ electionName, customString, UId }) {
      const election = await Elections.create({
        electionName: electionName,
        customString: customString,
        UId: UId,
      });
      return election;
    }

    static async getElectionsofUser({ UId }) {
      return await this.findAll({
        where: {
          UId: UId,
          isLive: false,
        },
      });
    }

    static async getLiveElectionsofUser({ UId }) {
      return await this.findAll({
        where: {
          UId: UId,
          isLive: true,
        },
      });
    }
  }
  Elections.init(
    {
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
