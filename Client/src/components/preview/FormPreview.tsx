import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useFormStore } from '../../store/formStore';
import { CategorizePreview } from './CategorizePreview';
import { ClozePreview } from './ClozePreview';
import { ComprehensionPreview } from './ComprehensionPreview';
import { Send, CheckCircle, ArrowUp } from 'lucide-react';

export const FormPreview: React.FC = () => {
  const { currentForm } = useFormStore();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!currentForm) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Card className="p-6 sm:p-8 text-center max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">No Form Selected</h2>
          <p className="text-sm sm:text-base text-gray-600">Create a form to preview it.</p>
        </Card>
      </div>
    );
  }

  const handleResponse = (response: any) => {
    setResponses(prev => ({
      ...prev,
      [response.questionId]: response
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', responses);
    setSubmitted(true);
    // In a real app, this would send to backend
  };

  const formStyle = {
    backgroundColor: currentForm.theme.backgroundColor,
    fontFamily: currentForm.theme.font,
    color: currentForm.theme.textColor,
    backgroundImage: currentForm.theme.backgroundImage 
      ? `url(${currentForm.theme.backgroundImage})` 
      : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={formStyle}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center w-full max-w-md"
        >
          <Card className="p-8 sm:p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl font-bold text-gray-800 mb-4"
            >
              Thank You!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-base text-gray-600"
            >
              Your response has been submitted successfully.
            </motion.p>
          </Card>
        </motion.div>
      </div>
    );
  }

  const totalQuestions = currentForm.questions.length;
  const answeredQuestions = Object.keys(responses).length;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen relative" style={formStyle}>
      {/* Progress Bar */}
      {totalQuestions > 0 && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200">
          <div className="h-1 bg-gray-200">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="px-4 py-2 text-xs sm:text-sm text-gray-600 text-center">
            {answeredQuestions} of {totalQuestions} questions completed
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-3 sm:p-6" style={{ paddingTop: totalQuestions > 0 ? '80px' : '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Form Header */}
          <Card className="relative overflow-hidden">
            {currentForm.headerImage && (
              <div className="relative h-48 sm:h-64 mb-6">
                <img
                  src={currentForm.headerImage}
                  alt="Form header"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 text-white">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl sm:text-4xl font-bold mb-2" 
                    style={{ fontFamily: currentForm.theme.font }}
                  >
                    {currentForm.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm sm:text-lg opacity-90" 
                    style={{ fontFamily: currentForm.theme.font }}
                  >
                    {currentForm.description}
                  </motion.p>
                </div>
              </div>
            )}
            
            {!currentForm.headerImage && (
              <div className="p-4 sm:p-8">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl sm:text-4xl font-bold mb-4" 
                  style={{ 
                    fontFamily: currentForm.theme.font,
                    color: currentForm.theme.primaryColor 
                  }}
                >
                  {currentForm.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm sm:text-lg text-gray-600" 
                  style={{ fontFamily: currentForm.theme.font }}
                >
                  {currentForm.description}
                </motion.p>
              </div>
            )}
          </Card>

          {/* Questions */}
          <div className="space-y-4 sm:space-y-6">
            <AnimatePresence>
              {currentForm.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="scroll-mt-20"
                >
                  {question.type === 'categorize' && (
                    <CategorizePreview
                      question={question}
                      onResponse={handleResponse}
                    />
                  )}
                  {question.type === 'cloze' && (
                    <ClozePreview
                      question={question}
                      onResponse={handleResponse}
                    />
                  )}
                  {question.type === 'comprehension' && (
                    <ComprehensionPreview
                      question={question}
                      onResponse={handleResponse}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          {currentForm.questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="sticky bottom-4 sm:bottom-6 flex justify-center px-4 z-30"
            >
              <Button
                variant="primary"
                size="lg"
                icon={Send}
                onClick={handleSubmit}
                className="shadow-2xl w-full sm:w-auto min-w-[200px]"
                style={{
                  background: `linear-gradient(135deg, ${currentForm.theme.primaryColor}, ${currentForm.theme.secondaryColor})`
                }}
              >
                Submit Form
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 sm:right-6 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 hover:shadow-xl transition-all z-40"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};