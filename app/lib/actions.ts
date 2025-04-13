import postgres from "postgres";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!);

export async function updateChecklistStep(id: string, state: boolean) {
  const contractorAcceptedStatus = state ? true : false;
  const customerAcceptedStatus = state || null;

  console.log(id, contractorAcceptedStatus, customerAcceptedStatus);

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
