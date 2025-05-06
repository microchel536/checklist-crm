"use client";

import React from "react"; 
import clsx from "clsx";
import Image from "next/image";
import { formatCurrency } from "@/app/lib/utils";
import { ChecklistStep as ChecklistStepType } from "@/app//lib/definitions";






      interface Item {
  price: number | string,
  quantity: number | string
}

const App = () => {
  const [items, setItems] = React.useState<Item[]>([]);
  
  // Добавляем новую пару цена-количество
  const addItem = () => {
    setItems([...items, {price: '', quantity: ''}]);
  };

  // Удаляем последнюю добавленную пару
  const removeLastItem = () => {
    if(items.length > 0){
      setItems(items.slice(0, items.length - 1));
    }
  };

  // Расчет общей стоимости
  const calculateTotalCost = () => {
    let total = 0;
    
    for(const item of items){
      const parsedPrice = parseFloat(item.price);
      const parsedQuantity = parseFloat(item.quantity);
      
      if(!isNaN(parsedPrice) && !isNaN(parsedQuantity)){
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
                   const newItems = [...items];
                   newItems[index].price = event.target.value;
                   setItems(newItems);
                 }}
          />
          
          <input type="number"
                 step="any"
                 placeholder={`Количество ${index+1}`}
                 value={item.quantity}
                 onChange={(event) => {
                   const newItems = [...items];
                   newItems[index].quantity = event.target.value;
                   setItems(newItems);
                 }}
          />
        </React.Fragment>
      ))}

      {/* Кнопка расчета суммы */}
      <button onClick={() => alert(`Общая сумма: ${calculateTotalCost()}`)}>
        Рассчитать стоимость
      </button>
    </div>
  );
};

export default App;







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
