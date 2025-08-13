import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Sidebar } from './Sidebar';
import { QuestionCard } from './QuestionCard';
import { useFormStore } from '../../store/formStore';
import { Image, Plus, Menu } from 'lucide-react';

export const FormBuilder: React.FC = () => {
  const { currentForm, updateForm, reorderQuestions } = useFormStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderQuestions(result.source.index, result.destination.index);
  };

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateForm({ headerImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentForm) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Card className="p-6 sm:p-8 text-center max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">No Form Selected</h2>
          <p className="text-sm sm:text-base text-gray-600">Create a new form to get started.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50 relative">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        {isMobile && sidebarCollapsed && (
          <div className="fixed bottom-4 left-4 z-30">
            <Button
              variant="primary"
              icon={Menu}
              onClick={() => setSidebarCollapsed(false)}
              className="shadow-2xl"
              size="sm"
            >
              Menu
            </Button>
          </div>
        )}

        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Form Header */}
              <Card className="p-4 sm:p-6">
                <div className="space-y-4">
                  {currentForm.headerImage && (
                    <div className="relative">
                      <img
                        src={currentForm.headerImage}
                        alt="Form header"
                        className="w-full h-32 sm:h-48 object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeaderImageUpload}
                        className="hidden"
                      />
                      <Button variant="ghost" icon={Image} size="sm">
                        <span className="hidden sm:inline">
                          {currentForm.headerImage ? 'Change Header Image' : 'Add Header Image'}
                        </span>
                        <span className="sm:hidden">
                          {currentForm.headerImage ? 'Change Image' : 'Add Image'}
                        </span>
                      </Button>
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={currentForm.title}
                      onChange={(e) => updateForm({ title: e.target.value })}
                      className="w-full text-lg sm:text-3xl font-bold bg-transparent border-none outline-none focus:bg-gray-50 rounded-lg p-2 -ml-2"
                      placeholder="Form Title"
                      style={{ 
                        fontFamily: currentForm.theme.font,
                        color: currentForm.theme.textColor 
                      }}
                    />
                  </div>

                  <div>
                    <textarea
                      value={currentForm.description}
                      onChange={(e) => updateForm({ description: e.target.value })}
                      className="w-full text-sm sm:text-lg bg-transparent border-none outline-none focus:bg-gray-50 rounded-lg p-2 -ml-2 resize-none"
                      placeholder="Form Description"
                      rows={2}
                      style={{ 
                        fontFamily: currentForm.theme.font,
                        color: currentForm.theme.textColor 
                      }}
                    />
                  </div>
                </div>
              </Card>

              {/* Questions */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="questions">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-[200px] rounded-xl transition-all duration-200 ${
                        snapshot.isDraggingOver 
                          ? 'bg-blue-50 border-2 border-dashed border-blue-300' 
                          : ''
                      }`}
                    >
                      {currentForm.questions.length === 0 ? (
                        <Card className="p-8 sm:p-12 text-center">
                          <div className="text-gray-400 mb-4">
                            <Plus size={isMobile ? 24 : 32} className="mx-auto" />
                          </div>
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-600 mb-2">
                            No questions yet
                          </h3>
                          <p className="text-xs sm:text-base text-gray-500 mb-4">
                            Add your first question using the sidebar
                          </p>
                          {isMobile && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setSidebarCollapsed(false)}
                              className="mt-4"
                            >
                              Open Menu
                            </Button>
                          )}
                        </Card>
                      ) : (
                        currentForm.questions.map((question, index) => (
                          <QuestionCard
                            key={question.id}
                            question={question}
                            index={index}
                          />
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};