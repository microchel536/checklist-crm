"use client";

import React from "react"; 
import clsx from "clsx";
import Image from "next/image";
import { formatCurrency } from "@/app/lib/utils";
import { ChecklistStep as ChecklistStepType } from "@/app//lib/definitions";




export const ChecklistStep = ({
  step,
  idx,
  updateChecklistStep,
}: {
  step: ChecklistStepType;
  idx: number;
  updateChecklistStep: (id: string, state: boolean) => void;
}) => {
  return (
    <div
      className={clsx(
        "rounded-lg bg-blue-600 text-white p-7 flex justify-between gap-3",
        {
          "opacity-70":
            !step.contractor_accepted ||
            (step.contractor_accepted && step.customer_accepted),
        }
      )}
    >
      <div className="flex flex-1 flex-col gap-3 justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">
            {idx}. {step.name}
          </h2>
          <p className="text-sm">
            Планируемые затраты: <b>{formatCurrency(step.planned_cost)}</b>
          </p>
          <p className="text-sm">{step.description}</p>
          {step.final_cost && (
            <p className="text-sm">
              Итоговые затраты: <b>{formatCurrency(step.final_cost)}</b>
            </p>
          )}
          {(step.start_date || step.end_date) && (
            <p className="text-sm">
              Даты проведения:{" "}
              {step.start_date
                ? new Date(step.start_date).toLocaleDateString()
                : "-"}
              /
              {step.end_date
                ? new Date(step.end_date).toLocaleDateString()
                : "-"}
            </p>
          )}
          {step.docs_url && (
            <a
              className="text-sm underline"
              target="_blank"
              href={step.docs_url}
            >
              Просмотреть приложенный документ.
            </a>
          )}
        </div>
        <div className="flex gap-4">
          <button
            disabled
            className={clsx("py-1 px-2 rounded opacity-50", {
              "bg-gray-600 opacity-50": !step.contractor_accepted,
              "bg-green-500": step.contractor_accepted,
            })}
          >
            {step.contractor_accepted
              ? "Исполнитель ✅"
              : "Ожидается подтвеждение исполнителем... ❌"}
          </button>
          {step.contractor_accepted && (
            <div className="flex gap-1">
              <button
                onClick={() => updateChecklistStep(step.id, true)}
                disabled={Boolean(step.customer_accepted)}
                className="bg-green-500 py-1 px-2 rounded disabled:opacity-50"
              >
                Принять ✅
              </button>
              {!step.customer_accepted && (
                <button
                  onClick={() => updateChecklistStep(step.id, false)}
                  className="bg-green-500 py-1 px-2 rounded disabled:opacity-50"
                >
                  Отправить на доработку ❌
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {step.image_url ? (
        <Image
          className="rounded-lg flex-1 max-h-200"
          alt={step.name}
          src={step.image_url}
          width={200}
          height={64}
        />
      ) : (
        <div className="flex w-64 h-64 items-center justify-center rounded-lg bg-gray-400 flex-1">
          <p className="text-md">Фото не добавлено</p>
        </div>
      )}
    </div>
  );
};
