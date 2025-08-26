'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable("movies_actors", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        movieId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "movies",
            key: "id"
          },
          onDelete: "CASCADE"
        },
        actorId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "actors",
            key: "id"
          },
          onDelete: "CASCADE"
        }
      }, {transaction})
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("movies_actors", {transaction})
    })
  }
};
