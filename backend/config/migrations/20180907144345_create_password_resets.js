exports.up = async function up(knex) {
  await knex.schema.createTable('PasswordResets', table => {
    table
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))

    table
      .uuid('userId')
      .notNullable()
      .references('id')
      .inTable('Users')
    table.text('code').notNullable()

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
  await knex.schema.dropTable('PasswordResets')
}
