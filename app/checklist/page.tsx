"use server";

import React from "react";
import Link from "next/link";
import { fetchChecklistList } from "@/app/lib/data";
import {
  CreateButton,
  UpdateButton,
  DeleteButton,
} from "@/app/ui/checklist/buttons";

export default async function Page() {
  const checklistList = await fetchChecklistList();

  return (
    <div>
      <div className="flex justify-between">
        <h1 className={"mb-8 text-xl md:text-2xl"}>Чеклисты</h1>
        <CreateButton />
      </div>
      <div className="flex flex-col gap-5">
        {checklistList.map((checklist, idx) => (
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
    </div>
  );
}
