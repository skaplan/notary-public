exports.up = async function up(knex) {
  await knex.schema.createTable('SyncJobs', table => {
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
    table
      .uuid('parentId')
      .references('id')
      .inTable('SyncJobs')
      .nullable()

    table.text('cursor').nullable()
    table.enum('status', ['pending', 'complete', 'failed']).notNullable()
    table.integer('numFiles').nullable()
    table.boolean('hasMore').nullable()
    table.timestamp('parentStartedAt').nullable()

    table
      .integer('retries')
      .notNullable()
      .defaultTo(0)
    table.text('error').nullable()

    table.timestamp('startAt').notNullable()
    table.timestamp('startedAt').nullable()
    table.timestamp('endedAt').nullable()

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
  await knex.schema.dropTable('SyncJobs')
}
