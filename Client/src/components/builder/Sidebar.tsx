import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { useFormStore } from '../../store/formStore';
import { 
  Plus, 
  Palette, 
  Type, 
  Image, 
  ChevronLeft, 
  ChevronRight,
  Grid3x3,
  FileText,
  BookOpen,
  X
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CategorizeQuestion, ClozeQuestion, ComprehensionQuestion } from '../../types/form';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { addQuestion, updateTheme, currentForm } = useFormStore();
  const [activeTab, setActiveTab] = useState<'questions' | 'theme'>('questions');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const colorPalettes = [
    { name: 'Ocean', colors: ['#3B82F6', '#0EA5E9', '#06B6D4', '#0891B2'] },
    { name: 'Sunset', colors: ['#F97316', '#EF4444', '#EC4899', '#8B5CF6'] },
    { name: 'Forest', colors: ['#10B981', '#059669', '#0D9488', '#047857'] },
    { name: 'Purple', colors: ['#8B5CF6', '#A855F7', '#9333EA', '#7C3AED'] },
    { name: 'Rose', colors: ['#F43F5E', '#EC4899', '#D946EF', '#A855F7'] },
    { name: 'Emerald', colors: ['#10B981', '#059669', '#0891B2', '#0284C7'] },
  ];

  const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'Nunito', 'Source Sans Pro'];

  const addCategorizeQuestion = () => {
    const question: CategorizeQuestion = {
      id: uuidv4(),
      type: 'categorize',
      title: 'New Categorize Question',
      categories: ['Category 1', 'Category 2'],
      items: [
        { id: uuidv4(), text: 'Item 1', category: 'Category 1' },
        { id: uuidv4(), text: 'Item 2', category: 'Category 2' },
      ]
    };
    addQuestion(question);
    if (isMobile) onToggle();
  };

  const addClozeQuestion = () => {
    const question: ClozeQuestion = {
      id: uuidv4(),
      type: 'cloze',
      title: 'New Cloze Question',
      sentence: 'The quick brown ___ jumps over the lazy ___.',
      blanks: [
        { id: uuidv4(), position: 16, correctAnswer: 'fox' },
        { id: uuidv4(), position: 40, correctAnswer: 'dog' },
      ]
    };
    addQuestion(question);
    if (isMobile) onToggle();
  };

  const addComprehensionQuestion = () => {
    const question: ComprehensionQuestion = {
      id: uuidv4(),
      type: 'comprehension',
      title: 'New Comprehension Question',
      passage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      questions: [
        {
          id: uuidv4(),
          question: 'What is the main idea?',
          type: 'multiple-choice',
          options: ['Option A', 'Option B', 'Option C'],
          correctAnswer: 'Option A'
        }
      ]
    };
    addQuestion(question);
    if (isMobile) onToggle();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-1 flex-1"
            >
              <Button
                variant={activeTab === 'questions' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('questions')}
                className="flex-1 text-xs sm:text-sm"
              >
                Questions
              </Button>
              <Button
                variant={activeTab === 'theme' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('theme')}
                className="flex-1 text-xs sm:text-sm"
              >
                Theme
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="sm"
          icon={isMobile ? X : (isCollapsed ? ChevronRight : ChevronLeft)}
          onClick={onToggle}
          className="ml-2"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'questions' && (
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Add Questions</h3>
                  
                  <Card className="p-3 sm:p-4" hover>
                    <Button
                      variant="secondary"
                      icon={Grid3x3}
                      onClick={addCategorizeQuestion}
                      className="w-full justify-start text-xs sm:text-sm"
                      size="sm"
                    >
                      Categorize Question
                    </Button>
                    <p className="text-xs text-gray-600 mt-2">
                      Drag items into categories
                    </p>
                  </Card>

                  <Card className="p-3 sm:p-4" hover>
                    <Button
                      variant="secondary"
                      icon={FileText}
                      onClick={addClozeQuestion}
                      className="w-full justify-start text-xs sm:text-sm"
                      size="sm"
                    >
                      Cloze Question
                    </Button>
                    <p className="text-xs text-gray-600 mt-2">
                      Fill in the blanks
                    </p>
                  </Card>

                  <Card className="p-3 sm:p-4" hover>
                    <Button
                      variant="secondary"
                      icon={BookOpen}
                      onClick={addComprehensionQuestion}
                      className="w-full justify-start text-xs sm:text-sm"
                      size="sm"
                    >
                      Comprehension Question
                    </Button>
                    <p className="text-xs text-gray-600 mt-2">
                      Reading passage with questions
                    </p>
                  </Card>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Customize Theme</h3>
                  
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Palette size={14} />
                      Color Palettes
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      {colorPalettes.map((palette) => (
                        <Card key={palette.name} className="p-3" hover>
                          <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <div className="flex gap-1">
                              {palette.colors.map((color, index) => (
                                <div
                                  key={index}
                                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-200"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm font-medium flex-1">{palette.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateTheme({
                              primaryColor: palette.colors[0],
                              secondaryColor: palette.colors[1],
                              accentColor: palette.colors[2],
                            })}
                            className="w-full text-xs"
                          >
                            Apply Palette
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Type size={14} />
                      Fonts
                    </h4>
                    <div className="space-y-2">
                      {fonts.map((font) => (
                        <button
                          key={font}
                          className={`w-full p-2 sm:p-3 text-left rounded-lg border transition-all hover:bg-gray-50 text-xs sm:text-sm ${
                            currentForm?.theme.font === font
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                          style={{ fontFamily: font }}
                          onClick={() => updateTheme({ font })}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Image size={14} />
                      Background
                    </h4>
                    <Card className="p-3 sm:p-4">
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              updateTheme({ backgroundImage: e.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {!isCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onToggle}
          />
        )}
        <motion.div
          initial={false}
          animate={{ 
            x: isCollapsed ? '-100%' : '0%',
            opacity: isCollapsed ? 0 : 1
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 border-r border-gray-200"
        >
          {sidebarContent}
        </motion.div>
      </>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 60 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 h-full flex flex-col shadow-lg relative z-10"
    >
      {sidebarContent}
    </motion.div>
  );
};