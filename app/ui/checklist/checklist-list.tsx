"use client";

import React from "react";
import Link from "next/link";
import { ChecklistCard } from "@/app/lib/definitions";
import { UpdateButton, DeleteButton } from "./buttons";

interface ChecklistListProps {
  checklists: ChecklistCard[];
}

export default function ChecklistList({ checklists }: ChecklistListProps) {
  return (
    <>
      {checklists.map((checklist: ChecklistCard, idx: number) => (
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
    </>
  );
} 