import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useFormStore } from '../../store/formStore';
import { Question, CategorizeQuestion, ClozeQuestion, ComprehensionQuestion } from '../../types/form';
import { 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Image, 
  Plus,
  GripVertical,
  Grid3x3,
  FileText,
  BookOpen
} from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';

interface QuestionCardProps {
  question: Question;
  index: number;
}

const QuestionTypeIcon = ({ type }: { type: Question['type'] }) => {
  const icons = {
    categorize: Grid3x3,
    cloze: FileText,
    comprehension: BookOpen,
  };
  const Icon = icons[type];
  return <Icon size={14} />;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
  const { updateQuestion, deleteQuestion } = useFormStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (updates: Partial<Question>) => {
    updateQuestion(question.id, updates);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleUpdate({ image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderQuestionSpecificFields = () => {
    switch (question.type) {
      case 'categorize':
        const categorizeQ = question as CategorizeQuestion;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-2">
                {categorizeQ.categories.map((category, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => {
                        const newCategories = [...categorizeQ.categories];
                        newCategories[index] = e.target.value;
                        handleUpdate({ categories: newCategories });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    {categorizeQ.categories.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => {
                          const newCategories = categorizeQ.categories.filter((_, i) => i !== index);
                          handleUpdate({ categories: newCategories });
                        }}
                      />
                    )}
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    handleUpdate({ categories: [...categorizeQ.categories, `Category ${categorizeQ.categories.length + 1}`] });
                  }}
                  className="text-xs"
                >
                  Add Category
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Items
              </label>
              <div className="space-y-2">
                {categorizeQ.items.map((item, index) => (
                  <div key={item.id} className="flex gap-2">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => {
                        const newItems = [...categorizeQ.items];
                        newItems[index] = { ...item, text: e.target.value };
                        handleUpdate({ items: newItems });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <select
                      value={item.category}
                      onChange={(e) => {
                        const newItems = [...categorizeQ.items];
                        newItems[index] = { ...item, category: e.target.value };
                        handleUpdate({ items: newItems });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      {categorizeQ.categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => {
                        const newItems = categorizeQ.items.filter((_, i) => i !== index);
                        handleUpdate({ items: newItems });
                      }}
                    />
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    const newItem = {
                      id: `item_${Date.now()}`,
                      text: `Item ${categorizeQ.items.length + 1}`,
                      category: categorizeQ.categories[0] || 'Category 1'
                    };
                    handleUpdate({ items: [...categorizeQ.items, newItem] });
                  }}
                  className="text-xs"
                >
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        );

      case 'cloze':
        const clozeQ = question as ClozeQuestion;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Sentence with blanks (use ___ for blanks)
              </label>
              <textarea
                value={clozeQ.sentence}
                onChange={(e) => handleUpdate({ sentence: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Correct Answers
              </label>
              <div className="space-y-2">
                {clozeQ.blanks.map((blank, index) => (
                  <div key={blank.id} className="flex gap-2">
                    <span className="px-3 py-2 bg-gray-100 rounded-lg text-xs sm:text-sm flex-shrink-0">
                      Blank {index + 1}
                    </span>
                    <input
                      type="text"
                      value={blank.correctAnswer}
                      onChange={(e) => {
                        const newBlanks = [...clozeQ.blanks];
                        newBlanks[index] = { ...blank, correctAnswer: e.target.value };
                        handleUpdate({ blanks: newBlanks });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => {
                        const newBlanks = clozeQ.blanks.filter((_, i) => i !== index);
                        handleUpdate({ blanks: newBlanks });
                      }}
                    />
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    const newBlank = {
                      id: `blank_${Date.now()}`,
                      position: 0,
                      correctAnswer: ''
                    };
                    handleUpdate({ blanks: [...clozeQ.blanks, newBlank] });
                  }}
                  className="text-xs"
                >
                  Add Blank
                </Button>
              </div>
            </div>
          </div>
        );

      case 'comprehension':
        const compQ = question as ComprehensionQuestion;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Passage
              </label>
              <textarea
                value={compQ.passage}
                onChange={(e) => handleUpdate({ passage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Questions
              </label>
              <div className="space-y-3">
                {compQ.questions.map((q, index) => (
                  <Card key={q.id} className="p-3 sm:p-4">
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          const newQuestions = [...compQ.questions];
                          newQuestions[index] = { ...q, question: e.target.value };
                          handleUpdate({ questions: newQuestions });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Enter question"
                      />
                      
                      <div className="flex gap-2">
                        <select
                          value={q.type}
                          onChange={(e) => {
                            const newQuestions = [...compQ.questions];
                            newQuestions[index] = { ...q, type: e.target.value as 'multiple-choice' | 'short-answer' };
                            handleUpdate({ questions: newQuestions });
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="short-answer">Short Answer</option>
                        </select>
                        
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => {
                            const newQuestions = compQ.questions.filter((_, i) => i !== index);
                            handleUpdate({ questions: newQuestions });
                          }}
                        />
                      </div>

                      {q.type === 'multiple-choice' && (
                        <div className="space-y-2">
                          {q.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newQuestions = [...compQ.questions];
                                  const newOptions = [...(q.options || [])];
                                  newOptions[optIndex] = e.target.value;
                                  newQuestions[index] = { ...q, options: newOptions };
                                  handleUpdate({ questions: newQuestions });
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder={`Option ${optIndex + 1}`}
                              />
                              {(q.options?.length || 0) > 2 && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  icon={Trash2}
                                  onClick={() => {
                                    const newQuestions = [...compQ.questions];
                                    const newOptions = (q.options || []).filter((_, i) => i !== optIndex);
                                    newQuestions[index] = { ...q, options: newOptions };
                                    handleUpdate({ questions: newQuestions });
                                  }}
                                />
                              )}
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Plus}
                            onClick={() => {
                              const newQuestions = [...compQ.questions];
                              const newOptions = [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`];
                              newQuestions[index] = { ...q, options: newOptions };
                              handleUpdate({ questions: newQuestions });
                            }}
                            className="text-xs"
                          >
                            Add Option
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    const newQuestion = {
                      id: `q_${Date.now()}`,
                      question: '',
                      type: 'multiple-choice' as const,
                      options: ['Option 1', 'Option 2'],
                      correctAnswer: 'Option 1'
                    };
                    handleUpdate({ questions: [...compQ.questions, newQuestion] });
                  }}
                  className="text-xs"
                >
                  Add Question
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Draggable draggableId={question.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-4 ${snapshot.isDragging ? 'opacity-50 rotate-2 scale-105' : ''}`}
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`overflow-hidden ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500' : 'hover:shadow-lg'} transition-all`}>
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div
                    {...provided.dragHandleProps}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <GripVertical className="text-gray-400" size={16} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <QuestionTypeIcon type={question.type} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-600 capitalize">
                      {question.type} Question
                    </span>
                  </div>
                  
                  <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={isExpanded ? ChevronUp : ChevronDown}
                      onClick={() => setIsExpanded(!isExpanded)}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => deleteQuestion(question.id)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={question.title}
                    onChange={(e) => handleUpdate({ title: e.target.value })}
                    className="w-full text-sm sm:text-lg font-semibold bg-transparent border-none outline-none focus:bg-gray-50 rounded-lg p-2 -ml-2"
                    placeholder="Question title"
                  />
                </div>

                {question.image && (
                  <div className="mb-4">
                    <img
                      src={question.image}
                      alt="Question"
                      className="w-full h-24 sm:h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button variant="ghost" size="sm" icon={Image} className="text-xs sm:text-sm">
                      {question.image ? 'Change Image' : 'Add Image'}
                    </Button>
                  </label>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 sm:pt-4 border-t border-gray-200">
                        {renderQuestionSpecificFields()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};