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
  name: string;
  description: string;
  planned_cost: number;
  final_cost: number | null;
  contractor_accepted: boolean;
  customer_accepted: boolean | null;
  image_url: string | null;
  docs_url: string | null;
  checklist_id: string;
  start_date: string | null;
  end_date: string | null;
  comment: string | null;
  created_at: string;
};

export type ChecklistCard = Checklist & {
  steps: ChecklistStep[];
};

export type NewChecklistStep = {
  id: string;
  name: string;
  description: string;
  planned_cost: number;
  final_cost: number | null;
  contractor_accepted: boolean;
  customer_accepted: boolean | null;
  image_url: string | null;
  docs_url: string | null;
  checklist_id: string;
  start_date: string | null;
  end_date: string | null;
  comment: string | null;
};

export type NewChecklist = {
  name: string;
  steps: NewChecklistStep[];
};

export type UpdateChecklistStep = ChecklistStep;

export type UpdateChecklist = Checklist & {
  steps: Array<UpdateChecklistStep | NewChecklistStep>;
};

export function isNewChecklistStep(
  step: UpdateChecklistStep | NewChecklistStep
): step is UpdateChecklistStep {
  if (step?.id) return true;
  return false;
}
