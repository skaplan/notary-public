exports.up = async function up(knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
}

exports.down = async function down(knex) {
  await knex.schema.raw('DROP EXTENSION "uuid-ossp";')
}
