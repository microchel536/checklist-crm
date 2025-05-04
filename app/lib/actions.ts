import postgres from "postgres";
import { revalidatePath } from "next/cache";
import {
  isNewChecklistStep,
  NewChecklist,
  UpdateChecklist,
} from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!);

export async function updateChecklistStep(id: string, state: boolean) {
  const contractorAcceptedStatus = state ? true : false;
  const customerAcceptedStatus = state || null;

  try {
    await sql`
    UPDATE checklist_steps
    SET customer_accepted = ${customerAcceptedStatus}, 
        contractor_accepted = ${contractorAcceptedStatus}
    WHERE id = ${id}
  `;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to Update Checklist step");
  }

  revalidatePath(`/checklist`);
}

export async function createChecklist(data: NewChecklist) {
  try {
    const { name, steps } = data;
    const response = await sql`
        INSERT INTO checklist (name)
        VALUES (${name})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `;

    await Promise.all(
      steps.map(async (step) => {
        return sql`
            INSERT INTO checklist_steps (name, description, planned_cost, final_cost, customer_accepted, contractor_accepted, image_url, checklist_id, start_date, end_date, docs_url)
            VALUES (${step.name}, ${step.description}, ${step.planned_cost}, ${
          step.final_cost
        }, ${false}, ${step.contractor_accepted}, ${step.image_url}, ${
          response[0].id
        }, ${step.start_date}, ${step.end_date}, ${step.docs_url})
            ON CONFLICT (id) DO NOTHING;
          `;
      })
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to Update Checklist step");
  }
  revalidatePath("/checklist");
}

export async function updateChecklist(
  data: UpdateChecklist,
  deletedSteps: string[]
) {
  try {
    const { name, id, steps } = data;

    await sql`
        DELETE FROM checklist_steps
        WHERE id IN ${sql(deletedSteps)}
      `;

    await sql`
        UPDATE checklist SET name = ${name}
        WHERE id = ${id};
      `;

    const stepsToUpdate = steps.filter((step) => isNewChecklistStep(step));
    const stepsToCreate = steps.filter((step) => !isNewChecklistStep(step));

    await Promise.all(
      stepsToCreate.map(async (step) => {
        return sql`
            INSERT INTO checklist_steps (name, description, planned_cost, final_cost, customer_accepted, contractor_accepted, image_url, checklist_id, start_date, end_date, docs_url)
            VALUES (${step.name}, ${step.description}, ${step.planned_cost}, ${
          step.final_cost
        }, ${false}, ${step.contractor_accepted}, ${step.image_url}, ${id}, ${
          step.start_date
        }, ${step.end_date}, ${step.docs_url})
            ON CONFLICT (id) DO NOTHING;
          `;
      })
    );

    await Promise.all(
      stepsToUpdate.map(async (step) => {
        return sql`
          UPDATE checklist_steps 
          SET 
            name = ${step.name},
            description = ${step.description},
            planned_cost = ${step.planned_cost},
            final_cost = ${step.final_cost},
            contractor_accepted = ${step.contractor_accepted},
            image_url = ${step.image_url},
            start_date = ${step.start_date},
            end_date = ${step.end_date},
            docs_url = ${step.docs_url}
          WHERE id = ${step.id};
          `;
      })
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to Update Checklist step");
  }

  // revalidatePath(`/checklist/${data.id}/edit`);
  // revalidatePath(`/checklist/${data.id}`);
}

export async function deleteChecklist(id: string) {
  try {
    await sql`
    DELETE FROM checklist_steps
    WHERE checklist_id = ${id}
  `;

    await sql`
    DELETE FROM checklist
    WHERE id = ${id}
  `;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to deleteChecklist");
  }

  revalidatePath(`/checklist`);
}
