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
    static async isElectionbelongstoUser({ EId, UId }) {
      let election = await this.findOne({
        where: {
          id: EId,
        },
        include: [
          {
            model: sequelize.models.ElectionAdmin,
            where: {
              id: UId,
            },
          },
        ],
      });
      if (election) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          message: "Election does not belong to user",
        };
      }
    }

    static async getElection({ EId }) {
      return await this.findOne({
        where: {
          id: EId,
        },
      });
    }

    static async deleteElection({ EId }) {
      return await this.destroy({
        where: {
          id: EId,
        },
      });
    }
  }
  Elections.init(
    {
      electionName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Election name cannot be empty",
          },
          notEmpty: {
            msg: "Election name cannot be empty",
          },
          islen: function (val) {
            if (val.length < 5) {
              throw new Error(
                "Election name must be atleast 5 characters long"
              );
            }
          },
        },
      },
      // Can be used to generate a custom URL for the election and should be unique for each election
      customString: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          islen: function (val) {
            if (val != null && val.length > 0 && val.length < 5) {
              throw new Error(
                "Custom string must be atleast 5 characters long"
              );
            }
          },
        },
      },
      isLive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Elections",
    }
  );
  return Elections;
};
