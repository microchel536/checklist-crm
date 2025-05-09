"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { formatCurrency } from "@/app/lib/utils";
import { ChecklistStep } from "@/app/lib/definitions";
import { updateChecklistStep, updateStepComment } from "@/app/lib/actions";

interface Item {
  price: string, // теперь точно строка
  quantity: string // тоже строка
}

const App = () => {
  const [items, setItems] = React.useState<Item[]>([]);
  
  // Добавляем новую пару цена-количество
  const addItem = () => {
    setItems([...items, {price: '', quantity: ''}]); // добавляем пустые строки
  };

  // Удаляем последнюю добавленную пару
  const removeLastItem = () => {
    if(items.length > 0){
      setItems(items.slice(0, items.length - 1)); // удаляем последний элемент
    }
  };

  // Расчёт общей стоимости
  const calculateTotalCost = () => {
    let total = 0;
    
    for(const item of items){
      const parsedPrice = parseFloat(item.price); // преобразуем в число
      const parsedQuantity = parseFloat(item.quantity); // преобразуем в число
      
      if(!isNaN(parsedPrice) && !isNaN(parsedQuantity)){ // проверяем валидные данные
        total += parsedPrice * parsedQuantity;
      }
    }
    
    return total.toFixed(2); // округляем итоговую сумму до двух знаков после запятой
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {/* Кнопки добавления/удаления пар */}
      <button onClick={addItem}>Добавить</button>
      <button disabled={items.length === 0} onClick={removeLastItem}>Удалить</button>

      {/* Поля ввода цены и количества */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <input type="number"
                 step="any"
                 placeholder={`Цена ${index+1}`}
                 value={item.price}
                 onChange={(event) => {
                   const newItems = [...items]; // копируем массив
                   newItems[index].price = event.target.value; // обновляем свойство
                   setItems(newItems); // устанавливаем новое состояние
                 }}
          />
          
          <input type="number"
                 step="any"
                 placeholder={`Количество ${index+1}`}
                 value={item.quantity}
                 onChange={(event) => {
                   const newItems = [...items]; // аналогично предыдущему блоку
                   newItems[index].quantity = event.target.value;
                   setItems(newItems);
                 }}
          />
        </React.Fragment>
      ))}

      {/* Кнопка расчёта суммы */}
      <button onClick={() => alert(`Общая сумма: ${calculateTotalCost()}`)}>
        Рассчитать стоимость
      </button>
    </div>
  );
};

export default App;

interface ChecklistStepProps {
  step: ChecklistStep;
}

export function ChecklistStepComponent({ step }: ChecklistStepProps) {
  const [comment, setComment] = useState(step.comment || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleCommentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleCommentBlur = async () => {
    setIsEditing(false);
    await updateStepComment(step.id, comment);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{step.name}</h3>
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
          <img
            src={step.image_url}
            alt={step.name}
            className="max-w-full h-auto rounded-lg"
          />
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
        <p className="text-sm text-gray-500 mb-1">Комментарий:</p>
        {isEditing ? (
          <textarea
            value={comment}
            onChange={handleCommentChange}
            onBlur={handleCommentBlur}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Введите комментарий..."
          />
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
