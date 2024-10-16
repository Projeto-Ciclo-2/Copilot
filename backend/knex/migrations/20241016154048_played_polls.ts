import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("polls", function (table) {
		table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
		table.uuid("user_id").references("id").inTable("users");
		table.uuid("poll_id").references("id").inTable("polls");
		table.date("played_at");
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("polls");
}
