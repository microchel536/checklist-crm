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
  final_cost: number | null;
  contractor_accepted: boolean;
  customer_accepted: boolean | null;
  image_url: string | null;
};

export type ChecklistCard = Checklist & {
  steps: ChecklistStep[];
};
