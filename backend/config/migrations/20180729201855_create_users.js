exports.up = async function up(knex) {
  await knex.schema.createTable('Users', table => {
    table
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.text('dropboxId').nullable()
    table.text('email').notNullable()
    table.text('password').nullable()

    table.enum('status', ['active', 'inactive', 'error']).nullable()
    table.text('token').nullable()

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
  await knex.schema.dropTable('Users')
}
