"use client";

import React, { useState } from 'react';

// Интерфейс для пары цена-количество
interface InputPair {
  price: string;
  quantity: string;
}

// Определим разрешенные поля (только price и quantity)
type FieldKey = 'price' | 'quantity';

const MultipleInputForm = () => {
  const [inputs, setInputs] = useState<InputPair[]>(
    [{ price: '', quantity: '' }]
  ); // Начальное состояние (одна пара)

  const handleAddRow = () => {
    setInputs([...inputs, { price: '', quantity: '' }]);
  };

  const handleRemoveRow = () => {
    if (inputs.length > 1) {
      setInputs(inputs.slice(0, inputs.length - 1));
    }
  };

  // Метод расчета обычной итоговой суммы
  const handleCalculate = () => {
    let totalSum = 0;
    inputs.forEach(({ price, quantity }) => {
      const numPrice = Number(price);
      const numQty = Number(quantity);
      if (!Number.isNaN(numPrice) && !Number.isNaN(numQty)) {
        totalSum += numPrice * numQty;
      }
    });
    alert(`Итоговая сумма: ${totalSum.toFixed(2)}`);
  };

  // Новый метод расчета итоговой суммы с НДС
  const calculateWithVAT = () => {
    let totalSum = 0;
    inputs.forEach(({ price, quantity }) => {
      const numPrice = Number(price);
      const numQty = Number(quantity);
      if (!Number.isNaN(numPrice) && !Number.isNaN(numQty)) {
        totalSum += numPrice * numQty;
      }
    });
    const vatAmount = totalSum * 0.2; // Ставка НДС — 20%
    const totalWithVat = totalSum + vatAmount;
    alert(
      `Общая стоимость с НДС (20%): ${totalWithVat.toFixed(2)}\n` +
      `НДС (20%): ${vatAmount.toFixed(2)}`
    );
  };

  // Обработчик изменения полей формы
  const handleInputChange = (idx: number, field: FieldKey, value: string) => {
    const updatedRows = [...inputs];
    updatedRows[idx][field] = value;
    setInputs(updatedRows);
  };

  return (
    <div className="space-y-4">
      {/* Пары полей */}
      {inputs.map((row, idx) => (
        <div key={idx} className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-1">
            <label
              htmlFor={`price-${idx}`}
              className="block text-sm font-medium mb-2"
            >
              Цена #{idx + 1}
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                id={`price-${idx}`}
                name={`price-${idx}`}
                type="number"
                value={row.price}
                onChange={(e) =>
                  handleInputChange(idx, 'price', e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label
              htmlFor={`quantity-${idx}`}
              className="block text-sm font-medium mb-2"
            >
              Количество #{idx + 1}
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                id={`quantity-${idx}`}
                name={`quantity-${idx}`}
                type="number"
                value={row.quantity}
                onChange={(e) =>
                  handleInputChange(idx, 'quantity', e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Кнопки управления строками */}
      <div className="flex justify-between space-x-4">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
        >
          Добавить строку
        </button>
        <button
          onClick={handleRemoveRow}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Удалить последнюю строку
        </button>
      </div>

      {/* Новая кнопка для расчета суммы с НДС */}
      <button
        onClick={calculateWithVAT}
        className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
      >
        Посчитать с НДС (20%)
      </button>

      {/* Исходная кнопка для обычного расчета */}
      <button
        onClick={handleCalculate}
        className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md"
      >
        Посчитать договорную цену
      </button>
    </div>
  );
};

export default MultipleInputForm;

export default MultipleInputForm;
