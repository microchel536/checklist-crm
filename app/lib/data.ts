import { sql } from "@vercel/postgres";
import { Checklist, ChecklistCard, ChecklistStep } from "./definitions";

export async function fetchChecklistById(
  checklistId: string
): Promise<ChecklistCard> {
  try {
    const checklistResult = await sql<Checklist>`
      SELECT 
        id, 
        name 
      FROM checklist
      WHERE id = ${checklistId};
    `;

    const checklistSteps = await sql<ChecklistStep>`
      SELECT * FROM checklist_steps
      WHERE checklist_id = ${checklistId}
      ORDER BY created_at ASC;
    `;

    if (!checklistResult.rows[0]) {
      throw new Error("Checklist not found");
    }

    return {
      ...checklistResult.rows[0],
      steps: checklistSteps.rows,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch checklist.");
  }
}

export async function fetchChecklistList(): Promise<ChecklistCard[]> {
  try {
    const checklistsResult = await sql<Checklist>`
      SELECT 
        id, 
        name 
      FROM checklist
    `;

    const checklistCards = await Promise.all(
      checklistsResult.rows.map(async (checklist) => {
        const stepsResult = await sql<ChecklistStep>`
          SELECT * FROM checklist_steps
          WHERE checklist_id = ${checklist.id}
          ORDER BY created_at ASC;
        `;
        return {
          ...checklist,
          steps: stepsResult.rows,
        };
      })
    );

    return checklistCards;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch checklist.");
  }
}
