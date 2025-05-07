"use client";

import StepElementForm from "@/app/ui/checklist/form/step-element-form"; // Используем относительный путь
import React from "react";
import { NewChecklistStep } from "@/app/lib/definitions";

// Создаем фиктивный шаг
const mockStep: NewChecklistStep = {
    name: "Название шага",
    description: "Описание шага",
    planned_cost: 0,
    final_cost: 0,
    image_url: "",
    docs_url: "",
    contractor_accepted: false,
    start_date: "",
    end_date: ""
  };
  
  // Замыкающие функции (без параметров)
  const changeStepMock = () => {};
  const deleteStepMock = () => {};
  
  // Фиксированный индекс
  const idx = 0;
  
  const Home = () => {
    return (
      <div className="container mx-auto my-8">
        <StepElementForm
          step={mockStep}
          changeStep={changeStepMock}
          deleteStep={deleteStepMock}
          idx={idx}
        />
      </div>
    );
  };
  
  export default Home;
