import React from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";

export default function FormActions({
  addNewStep,
  handleSubmit,
  submitButtonText = "Создать чеклист",
}: {
  submitButtonText?: string;
  handleSubmit: () => void;
  addNewStep: () => void;
}) {
  return (
    <div className="flex justify-between mt-6">
      <Button onClick={addNewStep} type="button">
        Добавить этап
      </Button>

      <div className="flex justify-end gap-4">
        <Link
          href="/checklist"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button onClick={handleSubmit}>{submitButtonText}</Button>
      </div>
    </div>
  );
}
