import postgres from "postgres";
import { Checklist, ChecklistCard, ChecklistStep } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!);

export async function fetchChecklistById(
  checklistId: string
): Promise<ChecklistCard> {
  console.log("checklistId", checklistId);
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
