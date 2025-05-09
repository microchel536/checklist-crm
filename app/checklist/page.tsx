"use server";

import React, { Suspense } from "react";
import Link from "next/link";
import { fetchChecklistList } from "@/app/lib/data";
import {
  CreateButton,
  UpdateButton,
  DeleteButton,
} from "@/app/ui/checklist/buttons";
import { ChecklistCard, ChecklistStep } from "@/app/lib/definitions";
import TimelineChart from "@/app/ui/checklist/timeline-chart";
import Notifications from "@/app/ui/checklist/notifications";
import { lusitana } from "@/app/ui/fonts";
import ChecklistList from "@/app/ui/checklist/checklist-list";

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
    <main>
      <div className="flex justify-between">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Чеклисты</h1>
        <CreateButton />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<div>Loading...</div>}>
          <ChecklistList checklists={checklistList} />
        </Suspense>
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
      <TimelineChart checklists={checklistList} />
      <Notifications checklists={checklistList} />
    </main>
  );
}
