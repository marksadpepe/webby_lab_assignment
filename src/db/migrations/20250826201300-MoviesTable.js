'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `CREATE TYPE "enum_MovieFormat" AS ENUM ('VHS', 'DVD', 'Blu-Ray');`,
        {transaction}
      )

      await queryInterface.createTable("movies", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        title: {
          type: Sequelize.STRING(100),
          unique: true,
          allowNull: false
        },
        year: {
          type: Sequelize.SMALLINT,
          allowNull: false
        },
        format: {
          type: '"public"."enum_MovieFormat"',
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
      }, {transaction})
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("movies", {transaction})

      await queryInterface.sequelize.query(
        `DROP TYPE "enum_MovieFormat";`, {transaction}
      )
    })
  }
};
