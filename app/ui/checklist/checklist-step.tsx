"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChecklistStep } from "@/app/lib/definitions";
import { updateStepComment } from "@/app/lib/actions";

interface ChecklistStepProps {
  step: ChecklistStep;
  idx: number;
  updateChecklistStep: (id: string, state: boolean) => Promise<void>;
}

export function ChecklistStepComponent({ step, idx, updateChecklistStep }: ChecklistStepProps) {
  const [comment, setComment] = useState(step.comment || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleCommentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleCommentBlur = async () => {
    try {
      await updateStepComment(step.id, comment);
      // Обновляем состояние step после успешного сохранения
      step.comment = comment;
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
      // Восстанавливаем предыдущее значение в случае ошибки
      setComment(step.comment || "");
    }
  };

  const handleDeleteComment = async () => {
    try {
      await updateStepComment(step.id, "");
      step.comment = "";
      setComment("");
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{idx}. {step.name}</h3>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={step.contractor_accepted}
              onChange={(e) => updateChecklistStep(step.id, e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-sm">Подтверждено</span>
          </label>
        </div>
      </div>
      <p className="text-gray-600 mb-2">{step.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <p className="text-sm text-gray-500">Плановая стоимость:</p>
          <p className="font-medium">{step.planned_cost} ₽</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Фактическая стоимость:</p>
          <p className="font-medium">{step.final_cost} ₽</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <p className="text-sm text-gray-500">Дата начала:</p>
          <p className="font-medium">
            {step.start_date ? new Date(step.start_date).toLocaleDateString() : "Не указана"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Дата окончания:</p>
          <p className="font-medium">
            {step.end_date ? new Date(step.end_date).toLocaleDateString() : "Не указана"}
          </p>
        </div>
      </div>
      {step.image_url && (
        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-1">Изображение:</p>
          <div className="relative w-full h-48">
            <Image
              src={step.image_url}
              alt={step.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      )}
      {step.docs_url && (
        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-1">Документы:</p>
          <a
            href={step.docs_url}
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
          {!isEditing && step.comment && (
            <button
              onClick={handleDeleteComment}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Удалить комментарий
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={comment}
              onChange={handleCommentChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Введите комментарий..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setComment(step.comment || "");
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Отмена
              </button>
              <button
                onClick={handleCommentBlur}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Сохранить
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="w-full p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            {comment || "Добавить комментарий..."}
          </div>
        )}
      </div>
    </div>
  );
}
