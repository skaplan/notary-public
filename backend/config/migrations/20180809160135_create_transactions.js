exports.up = async function up(knex) {
  await knex.schema.createTable('Transactions', table => {
    table
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))

    table.enum('status', ['pending', 'complete']).notNullable()
    table.text('blockchainTxId').notNullable()
    table.text('key').notNullable()

    table.timestamp('checkAfter').notNullable()

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
  await knex.schema.dropTable('Transactions')
}
