exports.up = async function up(knex) {
  await knex.schema.createTable('RootNodes', table => {
    table
      .uuid('id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))

    table.text('key').notNullable()
    table.integer('count').notNullable()

    table
      .uuid('syncJobId')
      .references('id')
      .inTable('SyncJobs')
      .nullable()
    table
      .uuid('parentNodeId')
      .references('id')
      .inTable('RootNodes')
      .nullable()

    table.enum('status', ['pending', 'joined', 'saved']).notNullable()

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
  await knex.schema.dropTable('RootNodes')
}
