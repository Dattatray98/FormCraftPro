import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { FormBuilder } from './components/builder/FormBuilder';
import { FormPreview } from './components/preview/FormPreview';
import { useFormStore } from './store/formStore';

function App() {
  const { isPreviewMode, currentForm, createNewForm } = useFormStore();

  useEffect(() => {
    // Create a default form on app start
    if (!currentForm) {
      createNewForm();
    }
  }, [currentForm, createNewForm]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={isPreviewMode ? 'preview' : 'builder'}
          initial={{ opacity: 0, x: isPreviewMode ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isPreviewMode ? -100 : 100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-full"
        >
          {isPreviewMode ? <FormPreview /> : <FormBuilder />}
        </motion.div>
      </div>
    </div>
  );
}

export default App;