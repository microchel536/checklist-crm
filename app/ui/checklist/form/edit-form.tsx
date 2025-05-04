"use client";

import React, { ChangeEvent, useState } from "react";
import StepElementForm from "@/app/ui/checklist/form/step-element-form";
import {
  isNewChecklistStep,
  NewChecklistStep,
  UpdateChecklist,
} from "@/app/lib/definitions";
import FormActions from "@/app/ui/checklist/form/form-actions";
import { INITIAL_STEP } from "@/app/lib/constants";

export default function Form({
  handleSubmit,
  initialState,
}: {
  handleSubmit: (state: UpdateChecklist, deletedSteps: string[]) => void;
  initialState: UpdateChecklist;
}) {
  const [state, setState] = useState<UpdateChecklist>(initialState);
  const [deletedSteps, setDeletedSteps] = useState<string[]>([]);

  const handleAddStep = () =>
    setState((prev) => ({ ...prev, steps: [...prev.steps, INITIAL_STEP] }));

  const handleDeleteStep = async (idx: number) => {
    setState((prev) => {
      const step = prev.steps[idx];
      if (isNewChecklistStep(step)) {
        setDeletedSteps((prevDeleted) => [...prevDeleted, step.id]);
      }

      return {
        ...prev,
        steps: [...prev.steps.slice(0, idx), ...prev.steps.slice(idx + 1)],
      };
    });
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

  const handleCreateForm = () => handleSubmit(state, deletedSteps);

  return (
    <>
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

      {state?.steps.map((step, idx) => {
        return (
          <StepElementForm
            changeStep={handleStepValueChanged}
            deleteStep={handleDeleteStep}
            step={step}
            key={idx}
            idx={idx}
          />
        );
      })}

      <FormActions
        submitButtonText="Обновить чеклист"
        handleSubmit={handleCreateForm}
        addNewStep={handleAddStep}
      />
    </>
  );
}
