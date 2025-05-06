// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type Checklist = {
  id: string;
  name: string;
};

export type ChecklistStep = {
  id: string;
  checklist_id: string;
  name: string;
  description: string;
  planned_cost: number;
  kolvo: number;
  price: number;
  final_cost: number | null;
  start_date: string | null;
  end_date: string | null;
  docs_url: string | null;
  contractor_accepted: boolean;
  customer_accepted: boolean | null;
  image_url: string | null;
};

export type ChecklistCard = Checklist & {
  steps: ChecklistStep[];
};

export type NewChecklistStep = Omit<
  ChecklistStep,
  "created_at" | "id" | "customer_accepted" | "checklist_id"
>;

export type NewChecklist = {
  name: string;
  steps: NewChecklistStep[];
};

export type UpdateChecklistStep = Omit<
  ChecklistStep,
  "created_at" | "customer_accepted" | "checklist_id"
>;

export type UpdateChecklist = Checklist & {
  steps: Array<UpdateChecklistStep | NewChecklistStep>;
};

export function isNewChecklistStep(
  step: UpdateChecklistStep | NewChecklistStep
): step is UpdateChecklistStep {
  // @ts-expect-error ID is not in property
  if (step?.id) return true;
  return false;
}
