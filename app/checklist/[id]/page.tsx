import React from "react";
import { fetchChecklistById } from "@/app/lib/data";
import { updateChecklistStep } from "@/app/lib/actions";
import { ChecklistStepComponent } from "@/app/ui/checklist/checklist-step";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const checklistId = params.id;

  const checklist = await fetchChecklistById(checklistId);

  const handleUpdateChecklistStep = async (id: string, state: boolean) => {
    "use server";
    await updateChecklistStep(id, state);
  };

  return (
    <div>
      <h1 className={"mb-8 text-xl md:text-2xl"}>{checklist.name}</h1>
      <div className="flex flex-col gap-5">
        {checklist.steps.map((step, idx) => {
          return (
            <ChecklistStepComponent
              updateChecklistStep={handleUpdateChecklistStep}
              idx={idx + 1}
              step={step}
              key={step.id}
            />
          );
        })}
      </div>
    </div>
  );
}
