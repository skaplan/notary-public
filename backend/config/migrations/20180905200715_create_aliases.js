exports.up = async function up(knex) {
  await knex.schema.createTable('Aliases', table => {
    table
      .text('id')
      .notNullable()
      .primary()

    table.text('hash').notNullable()
    table
      .uuid('userId')
      .references('id')
      .inTable('Users')
      .notNullable()

    table
      .timestamp('createdAt')
      .defaultTo(knex.fn.now())
      .notNullable()
    table
      .timestamp('updatedAt')
      .defaultTo(knex.fn.now())
      .notNullable()
  })
}

exports.down = async function down(knex) {
  await knex.schema.dropTable('Aliases')
}
