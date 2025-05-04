import React from "react";
import { UpdateChecklist } from "@/app/lib/definitions";
import { updateChecklist } from "@/app/lib/actions";
import Form from "@/app/ui/checklist/form/edit-form";
import { fetchChecklistById } from "@/app/lib/data";
import { redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const checklistId = params.id;

  const checklist = await fetchChecklistById(checklistId);

  const handleUpdateChecklist = async (
    checklist: UpdateChecklist,
    deletedSteps: string[]
  ) => {
    "use server";
    await updateChecklist(checklist, deletedSteps);
    redirect("/checklist");
  };

  return <Form initialState={checklist} handleSubmit={handleUpdateChecklist} />;
}
