import { create } from 'zustand';
import { FormData, Question, FormTheme } from '../types/form';

interface FormStore {
  currentForm: FormData | null;
  isPreviewMode: boolean;
  setCurrentForm: (form: FormData) => void;
  updateForm: (updates: Partial<FormData>) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  updateTheme: (theme: Partial<FormTheme>) => void;
  setPreviewMode: (isPreview: boolean) => void;
  createNewForm: () => void;
}

const defaultTheme: FormTheme = {
  primaryColor: '#3B82F6',
  secondaryColor: '#6366F1',
  accentColor: '#8B5CF6',
  backgroundColor: '#F8FAFC',
  textColor: '#1E293B',
  font: 'Inter',
};

export const useFormStore = create<FormStore>((set, get) => ({
  currentForm: null,
  isPreviewMode: false,

  setCurrentForm: (form) => set({ currentForm: form }),

  updateForm: (updates) => 
    set((state) => ({
      currentForm: state.currentForm 
        ? { ...state.currentForm, ...updates, updatedAt: new Date() }
        : null
    })),

  addQuestion: (question) =>
    set((state) => ({
      currentForm: state.currentForm
        ? {
            ...state.currentForm,
            questions: [...state.currentForm.questions, question],
            updatedAt: new Date()
          }
        : null
    })),

  updateQuestion: (questionId, updates) =>
    set((state) => ({
      currentForm: state.currentForm
        ? {
            ...state.currentForm,
            questions: state.currentForm.questions.map(q =>
              q.id === questionId ? { ...q, ...updates } : q
            ),
            updatedAt: new Date()
          }
        : null
    })),

  deleteQuestion: (questionId) =>
    set((state) => ({
      currentForm: state.currentForm
        ? {
            ...state.currentForm,
            questions: state.currentForm.questions.filter(q => q.id !== questionId),
            updatedAt: new Date()
          }
        : null
    })),

  reorderQuestions: (startIndex, endIndex) =>
    set((state) => {
      if (!state.currentForm) return state;
      
      const questions = [...state.currentForm.questions];
      const [reorderedItem] = questions.splice(startIndex, 1);
      questions.splice(endIndex, 0, reorderedItem);

      return {
        currentForm: {
          ...state.currentForm,
          questions,
          updatedAt: new Date()
        }
      };
    }),

  updateTheme: (themeUpdates) =>
    set((state) => ({
      currentForm: state.currentForm
        ? {
            ...state.currentForm,
            theme: { ...state.currentForm.theme, ...themeUpdates },
            updatedAt: new Date()
          }
        : null
    })),

  setPreviewMode: (isPreview) => set({ isPreviewMode: isPreview }),

  createNewForm: () => {
    const newForm: FormData = {
      id: `form_${Date.now()}`,
      title: 'Untitled Form',
      description: 'Form description',
      theme: defaultTheme,
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ currentForm: newForm, isPreviewMode: false });
  },
}));