exports.up = async function up(knex) {
  await knex.schema.createTable('StarredFiles', table => {
    table
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))

    table.text('hash').notNullable()
    table
      .uuid('userId')
      .references('id')
      .inTable('Users')
      .notNullable()

    table.enu('fileType', ['file', 'note']).notNullable()
    table.text('title').notNullable()
    table.text('body').nullable()

    table
      .timestamp('fileAddedAt')
      .defaultTo(knex.fn.now())
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
  await knex.schema.dropTable('StarredFiles')
}
