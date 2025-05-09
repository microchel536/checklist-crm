"use client";

import React from "react";
import { ChecklistCard } from "@/app/lib/definitions";

interface NotificationsProps {
  checklists: ChecklistCard[];
}

export default function Notifications({ checklists }: NotificationsProps) {
  // Собираем все шаги из всех чеклистов с их датами окончания
  const allSteps = checklists.flatMap((checklist) =>
    checklist.steps
      .filter((step) => step.end_date) // Фильтруем только шаги с датой окончания
      .map((step) => ({
        ...step,
        checklistName: checklist.name,
        endDate: new Date(step.end_date!),
      }))
  );

  // Сортируем по дате окончания (от ближайшей к дальней)
  const sortedSteps = allSteps.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());

  // Берем только ближайшие 5 шагов
  const upcomingSteps = sortedSteps.slice(0, 5);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Ближайшие сроки</h2>
      <div className="bg-white rounded-lg shadow">
        {upcomingSteps.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {upcomingSteps.map((step) => (
              <li key={`${step.checklistName}-${step.name}`} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{step.name}</p>
                    <p className="text-sm text-gray-500">{step.checklistName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {step.endDate.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {step.customer_accepted && step.contractor_accepted
                        ? "Завершено"
                        : "В процессе"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Нет предстоящих сроков
          </div>
        )}
      </div>
    </div>
  );
} 