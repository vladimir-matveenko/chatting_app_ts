import { Client } from "pg";
import fs from "fs/promises";
import path from "path";
import { env } from "../core/config/env.js";

const client = new Client({
    connectionString: env.databaseUrl,
});

async function migrate() {
    await client.connect();

    await client.query(`
        CREATE TABLE IF NOT EXISTS migrations
        (
            id SERIAL PRIMARY KEY,
            filename TEXT UNIQUE NOT NULL,
            executed_at TIMESTAMP DEFAULT NOW()
        );
    `);

    const migrationsDir = path.join(
        process.cwd(),
        "src",
        "database",
        "migrations",
    );

    const files = (await fs.readdir(migrationsDir))
        .filter(file => file.endsWith(".sql"))
        .sort();

    for (const file of files) {

        const exists = await client.query(
            "SELECT 1 FROM migrations WHERE filename = $1",
            [file],
        );

        if (exists.rowCount) {
            console.log(`✓ ${file} already executed`);
            continue;
        }

        console.log(`Running ${file}`);

        const sql = await fs.readFile(
            path.join(migrationsDir, file),
            "utf8",
        );

        await client.query("BEGIN");

        try {

            await client.query(sql);

            await client.query(
                "INSERT INTO migrations(filename) VALUES($1)",
                [file],
            );

            await client.query("COMMIT");

            console.log(`✓ ${file}`);

        } catch (e) {

            await client.query("ROLLBACK");

            throw e;
        }
    }

    await client.end();

    console.log("Done.");
}

migrate().catch(async err => {

    console.error(err);

    await client.end();

    process.exit(1);
});