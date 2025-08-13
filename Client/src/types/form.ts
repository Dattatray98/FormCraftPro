export interface FormTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  font: string;
  backgroundPattern?: string;
  backgroundImage?: string;
}

export interface BaseQuestion {
  id: string;
  type: 'categorize' | 'cloze' | 'comprehension';
  title: string;
  image?: string;
  customStyles?: {
    backgroundColor?: string;
    textColor?: string;
    font?: string;
  };
}

export interface CategorizeQuestion extends BaseQuestion {
  type: 'categorize';
  categories: string[];
  items: Array<{
    id: string;
    text: string;
    category: string;
  }>;
}

export interface ClozeQuestion extends BaseQuestion {
  type: 'cloze';
  sentence: string;
  blanks: Array<{
    id: string;
    position: number;
    correctAnswer: string;
  }>;
}

export interface ComprehensionQuestion extends BaseQuestion {
  type: 'comprehension';
  passage: string;
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple-choice' | 'short-answer';
    options?: string[];
    correctAnswer?: string;
  }>;
}

export type Question = CategorizeQuestion | ClozeQuestion | ComprehensionQuestion;

export interface FormData {
  id: string;
  title: string;
  description: string;
  headerImage?: string;
  theme: FormTheme;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: Date;
}