import postgres from "postgres";
import { checklistPlaceholder } from "../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!);

async function seedChecklist() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS checklist (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS checklist_steps (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      planned_cost INT NOT NULL,
      final_cost INT,
      contractor_accepted BOOLEAN NOT NULL,
      customer_accepted BOOLEAN,
      image_url VARCHAR(255),
      checklist_id UUID NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (checklist_id) REFERENCES checklist(id)
    );
  `;

  // Clear all data
  await sql`DELETE FROM checklist_steps;`;
  await sql`DELETE FROM checklist;`;

  await Promise.all(
    checklistPlaceholder.map(async (checklist) => {
      await sql`
        INSERT INTO checklist (id, name)
        VALUES (${checklist.id}, ${checklist.name})
        ON CONFLICT (id) DO NOTHING;
      `;

      await Promise.all(
        checklist.steps.map(async (step) => {
          return sql`
            INSERT INTO checklist_steps (id, name, description, planned_cost, final_cost, customer_accepted, contractor_accepted, image_url, checklist_id)
            VALUES (${step.id}, ${step.name}, ${step.description}, ${step.planned_cost}, ${step.final_cost}, ${step.customer_accepted}, ${step.contractor_accepted}, ${step.image_url}, ${step.checklist_id})
            ON CONFLICT (id) DO NOTHING;
          `;
        })
      );
    })
  );
}

export async function GET() {
  try {
    await sql.begin(() => [seedChecklist()]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
