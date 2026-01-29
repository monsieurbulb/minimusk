
export enum Step {
  GROUNDING = 0,
  DEFINE_PROBLEM = 1,
  INTERROGATE_REQUIREMENTS = 2,
  DELETE = 3,
  SIMPLIFY = 4,
  ACCELERATE = 5,
  AUTOMATE = 6,
  REFLECTION = 7
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ProjectState {
  currentStep: Step;
  problem: string;
  facts: string[];
  assumptions: string[];
  requirements: string[];
  deletedItems: string[];
  simplification: string;
  testIdeas: string[];
  reflection: string;
}
