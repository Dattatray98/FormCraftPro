import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { ClozeQuestion } from '../../types/form';

interface ClozePreviewProps {
  question: ClozeQuestion;
  onResponse: (response: any) => void;
}

export const ClozePreview: React.FC<ClozePreviewProps> = ({ 
  question, 
  onResponse 
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [focusedBlank, setFocusedBlank] = useState<string | null>(null);

  const handleAnswerChange = (blankId: string, answer: string) => {
    const newAnswers = { ...answers, [blankId]: answer };
    setAnswers(newAnswers);
    onResponse({
      questionId: question.id,
      type: 'cloze',
      answer: newAnswers
    });
  };

  const renderSentenceWithBlanks = () => {
    const parts = question.sentence.split('___');
    const result: React.ReactNode[] = [];

    parts.forEach((part, index) => {
      result.push(<span key={`text-${index}`}>{part}</span>);
      
      if (index < question.blanks.length) {
        const blank = question.blanks[index];
        result.push(
          <motion.span
            key={blank.id}
            className="inline-block mx-1"
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.05 }}
          >
            <input
              type="text"
              value={answers[blank.id] || ''}
              onChange={(e) => handleAnswerChange(blank.id, e.target.value)}
              onFocus={() => setFocusedBlank(blank.id)}
              onBlur={() => setFocusedBlank(null)}
              className={`inline-block w-16 sm:w-24 px-2 py-1 text-center border-b-2 bg-transparent focus:outline-none transition-all text-sm sm:text-base ${
                focusedBlank === blank.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="___"
              style={{ minWidth: '60px' }}
            />
          </motion.span>
        );
      }
    });

    return result;
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

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 rounded-xl">
        <div className="text-sm sm:text-lg leading-relaxed">
          {renderSentenceWithBlanks()}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="text-xs sm:text-sm text-gray-600">
          Fill in the blanks by clicking on the underlined spaces above.
        </div>
        <div className="text-xs text-blue-600">
          {Object.keys(answers).length} of {question.blanks.length} completed
        </div>
      </div>

      {/* Mobile helper */}
      <div className="mt-4 sm:hidden">
        <div className="text-xs text-gray-500 mb-2">Blanks to fill:</div>
        <div className="space-y-2">
          {question.blanks.map((blank, index) => (
            <div key={blank.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-12">Blank {index + 1}:</span>
              <input
                type="text"
                value={answers[blank.id] || ''}
                onChange={(e) => handleAnswerChange(blank.id, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder={`Answer for blank ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};