import { NewChecklistStep } from "./definitions";
import { InputPairType } from "./definitions";

export const INITIAL_STEP: NewChecklistStep = {
  name: "Мой этап",
  description: "",
  planned_cost: 0,
  final_cost: null,
  contractor_accepted: false,
  start_date: null,
  end_date: null,
  docs_url: null,
  image_url: null,
};

export const INITIAL_INPUT_PAIR: InputPairType = {
  price: 0,
  quantity: 0
};

// Первоначальные данные
export const INITIAL_PAIRS: InputPairType[] = [
  { price: 0, quantity: 0 },
  { price: 0, quantity: 0 }
];
