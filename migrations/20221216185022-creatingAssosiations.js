"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Voters", "electionId", {
      type: Sequelize.DataTypes.INTEGER,
    }),
      await queryInterface.addConstraint("Voters", {
        fields: ["electionId"],
        type: "foreign key",
        name: "custom_fkey_electionId",
        references: {
          table: "Elections",
          field: "id",
        },
      }),
      await queryInterface.addColumn("Elections", "userId", {
        type: Sequelize.DataTypes.INTEGER,
      });

    await queryInterface.addConstraint("Elections", {
      fields: ["userId"],
      type: "foreign key",
      name: "custom_fkey_userId",
      references: {
        table: "ElectionAdmins",
        field: "id",
      },
    }),
      await queryInterface.addColumn("Questions", "electionId", {
        type: Sequelize.DataTypes.INTEGER,
      }),
      await queryInterface.addConstraint("Questions", {
        fields: ["electionId"],
        type: "foreign key",
        name: "custom_fkey_electionId",
        references: {
          table: "Elections",
          field: "id",
        },
      }),
      await queryInterface.addColumn("Options", "questionId", {
        type: Sequelize.DataTypes.INTEGER,
      }),
      await queryInterface.addConstraint("Options", {
        fields: ["questionId"],
        type: "foreign key",
        name: "custom_fkey_questionId",
        references: {
          table: "Questions",
          field: "id",
        },
      }),
      await queryInterface.addColumn("Votes", "questionId", {
        type: Sequelize.DataTypes.INTEGER,
      }),
      await queryInterface.addConstraint("Votes", {
        fields: ["questionId"],
        type: "foreign key",
        name: "custom_fkey_questionId",
        references: {
          table: "Questions",
          field: "id",
        },
      }),
      await queryInterface.addColumn("Votes", "optionId", {
        type: Sequelize.DataTypes.INTEGER,
      });

    await queryInterface.addConstraint("Votes", {
      fields: ["optionId"],
      type: "foreign key",
      name: "custom_fkey_optionId",
      references: {
        table: "Options",
        field: "id",
      },
    });

    await queryInterface.addColumn("Votes", "voterId", {
      type: Sequelize.DataTypes.INTEGER,
    });

    await queryInterface.addConstraint("Votes", {
      fields: ["voterId"],
      type: "foreign key",
      name: "custom_fkey_voterId",
      references: {
        table: "Voters",
        field: "id",
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("voters", "electionId");
    await queryInterface.removeColumn("Elections", "userId");
    await queryInterface.removeColumn("Questions", "electionId");
    await queryInterface.removeColumn("Options", "questionId");
    await queryInterface.removeColumn("Votes", "questionId");
    await queryInterface.removeColumn("Votes", "optionId");
    await queryInterface.removeColumn("Votes", "voterId");
  },
};
