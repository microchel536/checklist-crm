"use client";

import React, { ChangeEvent, useState } from "react";
import StepElementForm from "@/app/ui/checklist/form/step-element-form";
import { NewChecklist, NewChecklistStep } from "@/app/lib/definitions";
import FormActions from "@/app/ui/checklist/form/form-actions";
import { INITIAL_STEP } from "@/app/lib/constants";

type Checklist = {
  name: string;
  steps: NewChecklistStep[];
};

const INITIAL_STATE: Checklist = {
  name: "Мой чеклист",
  steps: [INITIAL_STEP],
};

export default function Form({
  handleSubmit,
}: {
  handleSubmit: (state: NewChecklist) => void;
}) {
  const [state, setState] = useState(INITIAL_STATE);

  const handleAddStep = () =>
    setState((prev) => ({ ...prev, steps: [...prev.steps, INITIAL_STEP] }));

  const handleDeleteStep = (idx: number) => {
    setState((prev) => ({
      ...prev,
      steps: [...prev.steps.slice(0, idx), ...prev.steps.slice(idx + 1)],
    }));
  };

  const handleChangeChecklistName = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleStepValueChanged = <K extends keyof NewChecklistStep>(
    key: K,
    value: NewChecklistStep[K],
    idx: number
  ) => {
    setState((prev) => {
      const steps = prev.steps;
      steps[idx] = { ...steps[idx], [key]: value };
      return { ...prev, steps };
    });
  };

  const handleCreateForm = () => handleSubmit(state);

  return (
    <form>
      <h1 className="mb-8 text-xl md:text-2xl">Создать новый чеклист</h1>

      <div className="mb-4">
        <label
          htmlFor="checklist_name"
          className="mb-2 block text-sm font-medium"
        >
          Название чеклиста
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              onChange={handleChangeChecklistName}
              id="checklist_name"
              name="checklist_name"
              value={state.name}
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {state?.steps.map((step, idx) => (
        <StepElementForm
          changeStep={handleStepValueChanged}
          deleteStep={handleDeleteStep}
          step={step}
          key={idx}
          idx={idx}
        />
      ))}

      <FormActions handleSubmit={handleCreateForm} addNewStep={handleAddStep} />
    </form>
  );
}
