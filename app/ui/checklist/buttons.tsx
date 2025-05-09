"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { deleteChecklist } from "@/app/lib/actions";

interface ButtonProps {
  id: string;
}

export function CreateButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/checklist/create")}
      className="rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      Создать чеклист
    </button>
  );
}

export function UpdateButton({ id }: ButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/checklist/${id}/edit`)}
      className="rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      Изменить
    </button>
  );
}

export function DeleteButton({ id }: ButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить этот чеклист?")) {
      await deleteChecklist(id);
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    >
      Удалить
    </button>
  );
}
