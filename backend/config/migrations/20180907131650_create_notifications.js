exports.up = async function up(knex) {
  await knex.schema.createTable('Notifications', table => {
    table
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))

    table.enum('status', ['pending', 'sent']).notNullable()
    table.text('email').notNullable()
    table.text('hash').notNullable()
    table.timestamp('checkAfter').notNullable()

    table
      .uuid('userId')
      .references('id')
      .inTable('Users')
      .nullable()

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
  await knex.schema.dropTable('Notifications')
}
