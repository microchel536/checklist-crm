"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChecklistCard } from "@/app/lib/definitions";

interface TimelineChartProps {
  checklists: ChecklistCard[];
}

export default function TimelineChart({ checklists }: TimelineChartProps) {
  const [selectedChecklistIndex, setSelectedChecklistIndex] = useState(0);
  const selectedChecklist = checklists[selectedChecklistIndex];

  // Подготовка данных для графика
  const chartData = selectedChecklist.steps.map((step) => ({
    name: step.name,
    startDate: step.start_date ? new Date(step.start_date).toLocaleDateString() : "Не начато",
    endDate: step.end_date ? new Date(step.end_date).toLocaleDateString() : "Не завершено",
    status: step.customer_accepted && step.contractor_accepted ? "Завершено" : "В процессе",
  }));

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">График работ</h2>
        <div className="flex gap-2">
          {checklists.map((checklist, index) => (
            <button
              key={checklist.id}
              onClick={() => setSelectedChecklistIndex(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedChecklistIndex === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {checklist.name}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="startDate" name="Дата начала" fill="#3B82F6" />
              <Bar dataKey="endDate" name="Дата окончания" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 