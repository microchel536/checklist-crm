"use server";

import React from "react";
import Link from "next/link";
import { fetchChecklistList } from "@/app/lib/data";
import {
  CreateButton,
  UpdateButton,
  DeleteButton,
} from "@/app/ui/checklist/buttons";
import { ChecklistCard, ChecklistStep } from "@/app/lib/definitions";

export default async function Page() {
  const checklistList = await fetchChecklistList();

  // Подсчет статистики
  const totalChecklists = checklistList.length;
  const totalSteps = checklistList.reduce((acc: number, checklist: ChecklistCard) => 
    acc + checklist.steps.length, 0);
  const completedSteps = checklistList.reduce((acc: number, checklist: ChecklistCard) => 
    acc + checklist.steps.filter((step: ChecklistStep) => 
      step.customer_accepted && step.contractor_accepted
    ).length, 0);
  const totalPlannedCost = checklistList.reduce((acc: number, checklist: ChecklistCard) => 
    acc + checklist.steps.reduce((stepAcc: number, step: ChecklistStep) => 
      stepAcc + (step.planned_cost || 0), 0), 0);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className={"mb-8 text-xl md:text-2xl"}>Чеклисты</h1>
        <CreateButton />
      </div>
      <div className="flex flex-col gap-5">
        {checklistList.map((checklist: ChecklistCard, idx: number) => (
          <div
            className="flex justify-between p-2 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            key={checklist.id}
          >
            <Link href={`/checklist/${checklist.id}`}>
              {idx + 1}. {checklist.name}
            </Link>

            <div className="flex gap-1">
              <UpdateButton id={checklist.id} />
              <DeleteButton id={checklist.id} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Аналитика</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Всего чеклистов</h3>
            <p className="text-2xl font-bold text-blue-600">{totalChecklists}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Всего шагов</h3>
            <p className="text-2xl font-bold text-blue-600">{totalSteps}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Завершенные шаги</h3>
            <p className="text-2xl font-bold text-green-600">{completedSteps}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Запланированные затраты</h3>
            <p className="text-2xl font-bold text-blue-600">{totalPlannedCost.toLocaleString('ru-RU')} ₽</p>
          </div>
        </div>
      </div>
    </div>
  );
}
