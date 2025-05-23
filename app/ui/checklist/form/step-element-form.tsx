"use client";

import React from "react";
import { CheckIcon, ClockIcon, TrashIcon } from "@heroicons/react/24/outline";
import { NewChecklistStep, ChecklistStep } from "@/app/lib/definitions";
import { ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import MultipleInputForm from "@/app/ui/checklist/form/MultipleInputForm";

import "react-datepicker/dist/react-datepicker.css";

export default function StepElementForm({
  step,
  deleteStep,
  changeStep,
  idx,
}: {
  step: ChecklistStep | NewChecklistStep;
  changeStep: <K extends keyof NewChecklistStep>(
    key: K,
    value: NewChecklistStep[K],
    idx: number
  ) => void;
  deleteStep: (idx: number) => void;
  idx: number;
}) {
  const handleValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    changeStep(e.target.name as keyof NewChecklistStep, e.target.value, idx);
  };

  return (
    <div className="rounded-md bg-gray-50 py-4 px-4 md:py-6 md:px-6">
      <div className="mb-2 flex justify-end">
        <button
          onClick={() => deleteStep(idx)}
          type="button"
          className="rounded-md border p-2"
        >
          <span className="sr-only">Удалить</span>
          <TrashIcon className="w-5" />
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Название этапа
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="name"
              onChange={handleValueChanged}
              name="name"
              value={step.name}
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          Описание
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="description"
              name="description"
              value={step.description}
              onChange={handleValueChanged}
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <MultipleInputForm />
      
      <div className="mb-4">
        <label
          htmlFor="planned_cost"
          className="mb-2 block text-sm font-medium"
        >
          Ожидаемая стоимость на основе сметного расчета
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="planned_cost"
              name="planned_cost"
              type="number"
              value={step.planned_cost}
              onChange={handleValueChanged}
              step="1000"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="final_cost" className="mb-2 block text-sm font-medium">
          Финальная стоимость
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input id="final_cost"
              name="final_cost"
              type="number"
              step="1000"
              value={step.final_cost || undefined}
              onChange={handleValueChanged}
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
          Ссылка на работу
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="image_url"
              name="image_url"
              onChange={handleValueChanged}
              value={step.image_url || ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="docs_url" className="mb-2 block text-sm font-medium">
          Ссылка на документ
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="docs_url"
              name="docs_url"
              onChange={handleValueChanged}
              value={step.docs_url || ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="flex mb-4 gap-1">
        <div>
          <label
            htmlFor="start_date"
            className="mb-2 block text-sm font-medium"
          >
            Дата начала
          </label>
          <DatePicker
            id="start_date"
            selected={step.start_date ? new Date(step.start_date) : null}
            placeholderText="Выберите дату начала"
            onChange={(date) =>
              changeStep("start_date", date ? date.toISOString() : "", idx)
            }
            className="peer flex-1 block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="end_date"
            className="mb-2 block text-sm font-medium"
          >
            Дата окончания
          </label>
          <DatePicker
            id="end_date"
            selected={step.end_date ? new Date(step.end_date) : null}
            placeholderText="Выберите дату окончания"
            onChange={(date) =>
              changeStep("end_date", date ? date.toISOString() : "", idx)
            }
            className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium">Статус этапа</legend>
        <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                value="n"
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                onChange={() => changeStep("contractor_accepted", false, idx)}
                checked={!step.contractor_accepted}
              />
              <label
                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
              >
                В работе <ClockIcon className="h-4 w-4" />
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                value="y"
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                onChange={() => changeStep("contractor_accepted", true, idx)}
                checked={step.contractor_accepted}
              />
              <label
                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
              >
                Принято <CheckIcon className="h-4 w-4" />
              </label>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
