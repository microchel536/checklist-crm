import postgres from "postgres";
import { Checklist, ChecklistCard, ChecklistStep } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!);

export async function fetchChecklistById(
  checklistId: string
): Promise<ChecklistCard> {
  try {
    const checklist = await sql<Checklist[]>`
      SELECT 
        id, 
        name 
      FROM checklist
      WHERE id = ${checklistId};
    `;

    const checklistSteps = await sql<ChecklistStep[]>`
      SELECT * FROM checklist_steps
      WHERE checklist_id = ${checklistId}
      ORDER BY created_at ASC;
    `;

    return {
      ...checklist[0],
      steps: checklistSteps,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch checklist.");
  }
}

export async function fetchChecklistList(): Promise<ChecklistCard[]> {
  try {
    const checklists = await sql<Checklist[]>`
      SELECT 
        id, 
        name 
      FROM checklist
    `;

    const checklistCards = await Promise.all(
      checklists.map(async (checklist) => {
        const steps = await sql<ChecklistStep[]>`
          SELECT * FROM checklist_steps
          WHERE checklist_id = ${checklist.id}
          ORDER BY created_at ASC;
        `;
        return {
          ...checklist,
          steps,
        };
      })
    );

    return checklistCards;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch checklist.");
  }
}
