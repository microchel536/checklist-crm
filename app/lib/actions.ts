"use server";

import { revalidatePath } from "next/cache";
import {
  isNewChecklistStep,
  NewChecklist,
  UpdateChecklist,
} from "./definitions";
import { sql } from "@vercel/postgres";

interface ChecklistRow {
  id: string;
}

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
    const result = await sql<ChecklistRow>`
        INSERT INTO checklist (name)
        VALUES (${name})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `;

    const checklistId = result.rows[0]?.id;
    if (!checklistId) {
      throw new Error("Failed to create checklist");
    }

    await Promise.all(
      steps.map(async (step) => {
        return sql`
            INSERT INTO checklist_steps (
              name, description, planned_cost, final_cost, 
              customer_accepted, contractor_accepted, image_url, 
              checklist_id, start_date, end_date, docs_url, comment
            )
            VALUES (
              ${step.name}, ${step.description}, ${step.planned_cost}, 
              ${step.final_cost}, ${false}, ${step.contractor_accepted}, 
              ${step.image_url}, ${checklistId}, ${step.start_date}, 
              ${step.end_date}, ${step.docs_url}, ${step.comment || null}
            )
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

    if (deletedSteps.length > 0) {
      for (const stepId of deletedSteps) {
        await sql`
          DELETE FROM checklist_steps
          WHERE id = ${stepId}
        `;
      }
    }

    await sql`
        UPDATE checklist SET name = ${name}
        WHERE id = ${id};
      `;

    const stepsToUpdate = steps.filter((step) => isNewChecklistStep(step));
    const stepsToCreate = steps.filter((step) => !isNewChecklistStep(step));

    await Promise.all(
      stepsToCreate.map(async (step) => {
        return sql`
            INSERT INTO checklist_steps (
              name, description, planned_cost, final_cost, 
              customer_accepted, contractor_accepted, image_url, 
              checklist_id, start_date, end_date, docs_url, comment
            )
            VALUES (
              ${step.name}, ${step.description}, ${step.planned_cost}, 
              ${step.final_cost}, ${false}, ${step.contractor_accepted}, 
              ${step.image_url}, ${id}, ${step.start_date}, 
              ${step.end_date}, ${step.docs_url}, ${step.comment || null}
            )
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
            docs_url = ${step.docs_url},
            comment = ${step.comment || null}
          WHERE id = ${step.id};
          `;
      })
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to Update Checklist step");
  }

  revalidatePath(`/checklist/${data.id}/edit`);
  revalidatePath(`/checklist/${data.id}`);
}

export async function deleteChecklist(id: string) {
  try {
    // Сначала удаляем все шаги чеклиста
    await sql`
      DELETE FROM checklist_steps
      WHERE checklist_id = ${id}
    `;

    // Затем удаляем сам чеклист
    await sql`
      DELETE FROM checklist
      WHERE id = ${id}
    `;

    revalidatePath("/checklist");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete checklist.");
  }
}

export async function updateStepComment(id: string, comment: string) {
  try {
    console.log('Updating comment for step:', id, 'with comment:', comment);
    
    // Сначала получаем checklist_id для шага
    const stepResult = await sql`
      SELECT checklist_id FROM checklist_steps WHERE id = ${id}
    `;

    if (stepResult.rowCount === 0) {
      console.error('No step found with id:', id);
      throw new Error('Step not found');
    }

    const checklistId = stepResult.rows[0].checklist_id;
    
    // Обновляем комментарий
    const result = await sql`
      UPDATE checklist_steps
      SET comment = ${comment}
      WHERE id = ${id}
      RETURNING id, comment;
    `;

    console.log('Successfully updated comment:', result.rows[0]);
    
    // Обновляем все возможные пути, где может отображаться комментарий
    revalidatePath("/checklist");
    revalidatePath(`/checklist/${checklistId}`);
    revalidatePath(`/checklist/${checklistId}/edit`);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Failed to update step comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
