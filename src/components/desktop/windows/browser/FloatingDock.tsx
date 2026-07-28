import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Terminal, BriefcaseBusiness, Trophy, Mail } from 'lucide-react';

interface DockItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  mouseX: any;
  setHoveredItem: (id: string | null) => void;
  hoveredItem: string | null;
}

const DockItem = ({ id, label, icon, href, mouseX, setHoveredItem, hoveredItem }: DockItemProps) => {
  const ref = useRef<HTMLAnchorElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 76, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="bv-dock-item-wrapper">
      <motion.a
        ref={ref}
        href={href}
        style={{ width, height: width }}
        className="bv-dock-item cursor-interactive"
        onMouseEnter={() => setHoveredItem(id)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={(e) => {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="bv-dock-icon flex items-center justify-center w-full h-full pointer-events-none">
          {icon}
        </span>
        {/* Glowing LED indicator dot inside the glass circle */}
        <span className="bv-dock-indicator" />
      </motion.a>
      
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredItem === id && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="bv-dock-tooltip"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FloatingDock = () => {
  const mouseX = useMotionValue(Infinity);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const DOCK_ITEMS = [
    { id: 'work', label: 'Work', icon: <Terminal className="w-full h-full text-current transition-all duration-300" strokeWidth={1.8} />, href: '#bv-work' },
    { id: 'experience', label: 'Experience', icon: <BriefcaseBusiness className="w-full h-full text-current transition-all duration-300" strokeWidth={1.8} />, href: '#bv-experience' },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-full h-full text-current transition-all duration-300" strokeWidth={1.8} />, href: '#bv-achievements' },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-full h-full text-current transition-all duration-300" strokeWidth={1.8} />, href: '#bv-contact' },
  ];

  return (
    <div className="bv-floating-dock-container">
      <motion.div
        className="bv-floating-dock"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {DOCK_ITEMS.map((item) => (
          <DockItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            href={item.href}
            mouseX={mouseX}
            setHoveredItem={setHoveredItem}
            hoveredItem={hoveredItem}
          />
        ))}
      </motion.div>
    </div>
  );
};
