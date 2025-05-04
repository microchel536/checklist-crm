import React from "react";
import { NewChecklist } from "@/app/lib/definitions";
import { createChecklist } from "@/app/lib/actions";
import Form from "@/app/ui/checklist/form/create-form";

export default function Page() {
  const handleCreateChecklist = async (checklist: NewChecklist) => {
    "use server";
    await createChecklist(checklist);
  };

  return <Form handleSubmit={handleCreateChecklist} />;
}
