import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../common/Card';
import { CategorizeQuestion } from '../../types/form';

interface CategorizePreviewProps {
  question: CategorizeQuestion;
  onResponse: (response: any) => void;
}

export const CategorizePreview: React.FC<CategorizePreviewProps> = ({ 
  question, 
  onResponse 
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [categorizedItems, setCategorizedItems] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    question.categories.forEach(cat => {
      initial[cat] = [];
    });
    return initial;
  });
  const [unassignedItems, setUnassignedItems] = useState<string[]>(
    question.items.map(item => item.text)
  );
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);

  const handleDragStart = (itemText: string) => {
    setDraggedItem(itemText);
  };

  const handleTouchStart = (e: React.TouchEvent, itemText: string) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setDraggedItem(itemText);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent, category?: string) => {
    if (!draggedItem || !touchStartPos) return;

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const categoryElement = element?.closest('[data-category]');
    
    if (categoryElement) {
      const targetCategory = categoryElement.getAttribute('data-category');
      if (targetCategory) {
        moveItemToCategory(draggedItem, targetCategory);
      }
    } else if (category) {
      moveItemToCategory(draggedItem, category);
    }

    setDraggedItem(null);
    setTouchStartPos(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const moveItemToCategory = (itemText: string, category: string) => {
    // Remove from current location
    const newCategorizedItems = { ...categorizedItems };
    const newUnassignedItems = unassignedItems.filter(item => item !== itemText);
    
    // Remove from other categories
    Object.keys(newCategorizedItems).forEach(cat => {
      newCategorizedItems[cat] = newCategorizedItems[cat].filter(item => item !== itemText);
    });

    // Add to new category
    newCategorizedItems[category] = [...newCategorizedItems[category], itemText];

    setCategorizedItems(newCategorizedItems);
    setUnassignedItems(newUnassignedItems);

    // Send response
    onResponse({
      questionId: question.id,
      type: 'categorize',
      answer: newCategorizedItems
    });
  };

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    if (!draggedItem) return;
    moveItemToCategory(draggedItem, category);
    setDraggedItem(null);
  };

  const handleDropToUnassigned = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Remove from categories
    const newCategorizedItems = { ...categorizedItems };
    Object.keys(newCategorizedItems).forEach(cat => {
      newCategorizedItems[cat] = newCategorizedItems[cat].filter(item => item !== draggedItem);
    });

    // Add to unassigned
    const newUnassignedItems = [...unassignedItems, draggedItem];

    setCategorizedItems(newCategorizedItems);
    setUnassignedItems(newUnassignedItems);
    setDraggedItem(null);

    onResponse({
      questionId: question.id,
      type: 'categorize',
      answer: newCategorizedItems
    });
  };

  const ItemCard = ({ item, isInCategory = false }: { item: string; isInCategory?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white border rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:scale-105 text-sm select-none ${
        draggedItem === item ? 'opacity-50 scale-95' : ''
      } ${isInCategory ? 'border-blue-200' : 'border-gray-200'}`}
      draggable
      onDragStart={() => handleDragStart(item)}
      onTouchStart={(e) => handleTouchStart(e, item)}
      onTouchMove={handleTouchMove}
      onTouchEnd={(e) => handleTouchEnd(e)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {item}
    </motion.div>
  );

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-base sm:text-xl font-semibold mb-2">{question.title}</h3>
      {question.image && (
        <img
          src={question.image}
          alt="Question"
          className="w-full h-32 sm:h-48 object-cover rounded-lg mb-4"
        />
      )}

      <div className="text-xs sm:text-sm text-gray-600 mb-4">
        Drag items into the correct categories below
      </div>

      <div className="space-y-4">
        {/* Unassigned Items */}
        <div
          className="space-y-3"
          onDragOver={handleDragOver}
          onDrop={handleDropToUnassigned}
        >
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            Items to Categorize ({unassignedItems.length})
          </h4>
          <div className="min-h-[100px] p-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <AnimatePresence>
                {unassignedItems.map((item) => (
                  <ItemCard key={item} item={item} />
                ))}
              </AnimatePresence>
            </div>
            {unassignedItems.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-4">
                All items have been categorized
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.categories.map((category) => (
            <div
              key={category}
              className="space-y-3"
              data-category={category}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, category)}
              onTouchEnd={(e) => handleTouchEnd(e, category)}
            >
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                {category} ({categorizedItems[category].length})
              </h4>
              <div className="min-h-[120px] p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg">
                <div className="space-y-2">
                  <AnimatePresence>
                    {categorizedItems[category].map((item) => (
                      <ItemCard key={item} item={item} isInCategory />
                    ))}
                  </AnimatePresence>
                </div>
                {categorizedItems[category].length === 0 && (
                  <div className="text-center text-blue-400 text-sm py-8">
                    Drop items here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};