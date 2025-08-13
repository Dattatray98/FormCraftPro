import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { useFormStore } from '../../store/formStore';
import { Eye, Save, FormInput, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar: React.FC = () => {
  const { isPreviewMode, setPreviewMode, currentForm } = useFormStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSave = () => {
    if (currentForm) {
      // In a real app, this would save to backend
      console.log('Saving form:', currentForm);
      alert('Form saved successfully!');
    }
  };

  const togglePreview = () => {
    setPreviewMode(!isPreviewMode);
    setMobileMenuOpen(false);
  };

  const handleSaveAndClose = () => {
    handleSave();
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-3 sm:px-6 py-2 sm:py-4 sticky top-0 z-50 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <FormInput className="text-white" size={window.innerWidth < 640 ? 14 : 16} />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
              <span className="hidden sm:inline">FormCraft Pro</span>
              <span className="sm:hidden">FormCraft</span>
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">Premium Form Builder</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant={isPreviewMode ? "primary" : "secondary"}
            icon={Eye}
            onClick={togglePreview}
            size="sm"
          >
            {isPreviewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          
          {!isPreviewMode && (
            <Button
              variant="primary"
              icon={Save}
              onClick={handleSave}
              size="sm"
            >
              Save Form
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <Button
            variant="ghost"
            size="sm"
            icon={mobileMenuOpen ? X : Menu}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden mt-3 pt-3 border-t border-gray-200 space-y-2 overflow-hidden"
          >
            <Button
              variant={isPreviewMode ? "primary" : "secondary"}
              icon={Eye}
              onClick={togglePreview}
              className="w-full justify-center"
              size="sm"
            >
              {isPreviewMode ? 'Switch to Edit Mode' : 'Preview Form'}
            </Button>
            
            {!isPreviewMode && (
              <Button
                variant="primary"
                icon={Save}
                onClick={handleSaveAndClose}
                className="w-full justify-center"
                size="sm"
              >
                Save Form
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};