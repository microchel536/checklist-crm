import { sql } from "@vercel/postgres";
import { checklistPlaceholder } from "../lib/placeholder-data";

async function seedChecklist() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`DROP TABLE IF EXISTS checklist_steps`;
  await sql`DROP TABLE IF EXISTS checklist`;

  await sql`
    CREATE TABLE IF NOT EXISTS checklist (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS checklist_steps (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      planned_cost INT NOT NULL,
      final_cost INT,
      contractor_accepted BOOLEAN NOT NULL,
      customer_accepted BOOLEAN,
      image_url VARCHAR(255),
      docs_url VARCHAR(255),
      checklist_id UUID NOT NULL,
      start_date VARCHAR(255),
      end_date VARCHAR(255),
      comment TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (checklist_id) REFERENCES checklist(id)
    );
  `;

  // Clear all data
  await sql`DELETE FROM checklist_steps;`;
  await sql`DELETE FROM checklist;`;

  for (const checklist of checklistPlaceholder) {
    await sql`
      INSERT INTO checklist (id, name)
      VALUES (${checklist.id}, ${checklist.name})
      ON CONFLICT (id) DO NOTHING;
    `;

    for (const step of checklist.steps) {
      await sql`
        INSERT INTO checklist_steps (id, name, description, planned_cost, final_cost, customer_accepted, contractor_accepted, image_url, checklist_id, comment)
        VALUES (${step.id}, ${step.name}, ${step.description}, ${step.planned_cost}, ${step.final_cost}, ${step.customer_accepted}, ${step.contractor_accepted}, ${step.image_url}, ${step.checklist_id}, ${step.comment || null})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }
}

export async function GET() {
  try {
    await seedChecklist();
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
