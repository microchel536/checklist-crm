"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChecklistStep } from "@/app/lib/definitions";
import { updateStepComment, updateChecklistStep } from "@/app/lib/actions";

interface ChecklistStepProps {
  step: ChecklistStep;
  idx: number;
  updateChecklistStep: (id: string, state: boolean) => Promise<void>;
}

export function ChecklistStepComponent({ step, idx, updateChecklistStep }: ChecklistStepProps) {
  const [comment, setComment] = useState(step.comment || "");
  const [isEditing, setIsEditing] = useState(false);
  const [localStep, setLocalStep] = useState(step);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    setError(null);
  };

  const handleSaveComment = async () => {
    setIsSaving(true);
    setError(null);
    try {
      console.log('Saving comment for step:', localStep.id, 'comment:', comment);
      await updateStepComment(localStep.id, comment);
      console.log('Comment saved successfully');
      setLocalStep(prev => ({ ...prev, comment }));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
      setError(error instanceof Error ? error.message : "Не удалось сохранить комментарий. Попробуйте еще раз.");
      setComment(localStep.comment || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteComment = async () => {
    setIsSaving(true);
    setError(null);
    try {
      console.log('Deleting comment for step:', localStep.id);
      await updateStepComment(localStep.id, "");
      console.log('Comment deleted successfully');
      setLocalStep(prev => ({ ...prev, comment: "" }));
      setComment("");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setError(error instanceof Error ? error.message : "Не удалось удалить комментарий. Попробуйте еще раз.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await updateChecklistStep(localStep.id, e.target.checked);
      setLocalStep(prev => ({ ...prev, contractor_accepted: e.target.checked }));
    } catch (error) {
      console.error("Failed to update step status:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{idx}. {localStep.name}</h3>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={localStep.contractor_accepted}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-sm">Подтверждено</span>
          </label>
        </div>
      </div>
      <p className="text-gray-600 mb-2">{localStep.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <p className="text-sm text-gray-500">Плановая стоимость:</p>
          <p className="font-medium">{localStep.planned_cost} ₽</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Фактическая стоимость:</p>
          <p className="font-medium">{localStep.final_cost} ₽</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <p className="text-sm text-gray-500">Дата начала:</p>
          <p className="font-medium">
            {localStep.start_date ? new Date(localStep.start_date).toLocaleDateString() : "Не указана"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Дата окончания:</p>
          <p className="font-medium">
            {localStep.end_date ? new Date(localStep.end_date).toLocaleDateString() : "Не указана"}
          </p>
        </div>
      </div>
      {localStep.image_url && (
        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-1">Изображение:</p>
          <div className="relative w-full h-48">
            <Image
              src={localStep.image_url}
              alt={localStep.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      )}
      {localStep.docs_url && (
        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-1">Документы:</p>
          <a
            href={localStep.docs_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Открыть документы
          </a>
        </div>
      )}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm text-gray-500">Комментарий:</p>
          {!isEditing && localStep.comment && (
            <button
              onClick={handleDeleteComment}
              disabled={isSaving}
              className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              {isSaving ? "Удаление..." : "Удалить комментарий"}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 mb-2">{error}</p>
        )}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={comment}
              onChange={handleCommentChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Введите комментарий..."
              disabled={isSaving}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setComment(localStep.comment || "");
                  setError(null);
                }}
                disabled={isSaving}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveComment}
                disabled={isSaving}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => !isSaving && setIsEditing(true)}
            className={`w-full p-2 border rounded-lg ${!isSaving ? 'cursor-pointer hover:bg-gray-50' : ''}`}
          >
            {localStep.comment || "Добавить комментарий..."}
          </div>
        )}
      </div>
    </div>
  );
}
