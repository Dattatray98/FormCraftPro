import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { ComprehensionQuestion } from '../../types/form';

interface ComprehensionPreviewProps {
  question: ComprehensionQuestion;
  onResponse: (response: any) => void;
}

export const ComprehensionPreview: React.FC<ComprehensionPreviewProps> = ({ 
  question, 
  onResponse 
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showPassage, setShowPassage] = useState(true);

  const handleAnswerChange = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    onResponse({
      questionId: question.id,
      type: 'comprehension',
      answer: newAnswers
    });
  };

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-base sm:text-xl font-semibold mb-4">{question.title}</h3>
      {question.image && (
        <img
          src={question.image}
          alt="Question"
          className="w-full h-32 sm:h-48 object-cover rounded-lg mb-6"
        />
      )}

      {/* Mobile Toggle for Passage */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowPassage(!showPassage)}
          className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm"
        >
          {showPassage ? 'Hide Passage' : 'Show Passage'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Passage */}
        <div className={`${!showPassage ? 'hidden sm:block' : ''}`}>
          <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Reading Passage
          </h4>
          <Card className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 sticky top-4" glass>
            <div className="text-sm sm:text-base text-gray-800 leading-relaxed max-h-96 overflow-y-auto">
              {question.passage}
            </div>
          </Card>
        </div>

        {/* Questions */}
        <div className={`${showPassage ? 'hidden sm:block' : ''}`}>
          <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            Questions ({question.questions.length})
          </h4>
          <div className="space-y-4">
            {question.questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="mb-3">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm sm:text-base font-medium leading-relaxed">{q.question}</span>
                    </div>
                  </div>

                  {q.type === 'multiple-choice' ? (
                    <div className="space-y-2 ml-9">
                      {q.options?.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
                            answers[q.id] === option
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={option}
                            checked={answers[q.id] === option}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center ${
                            answers[q.id] === option
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[q.id] === option && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-sm sm:text-base">{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="ml-9">
                      <textarea
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                        rows={3}
                        placeholder="Enter your answer here..."
                      />
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Progress:</span>
          <span className="font-medium text-blue-600">
            {Object.keys(answers).length} of {question.questions.length} answered
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(answers).length / question.questions.length) * 100}%` }}
          />
        </div>
      </div>
    </Card>
  );
};