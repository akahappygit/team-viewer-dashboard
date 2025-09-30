import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
const Dropdown = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  placement = 'bottom-start',
  offset = 8,
  className,
  contentClassName,
  disabled = false,
  closeOnSelect = true,
  ...props
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen]);
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  const handleItemClick = (callback) => {
    return (...args) => {
      if (callback) {
        callback(...args);
      }
      if (closeOnSelect) {
        setIsOpen(false);
      }
    };
  };
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: placement.includes('top') ? 10 : -10,
      transition: {
        duration: 0.1
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };
  const placementClasses = {
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'left-start': 'right-full top-0 mr-2',
    'left-end': 'right-full bottom-0 mr-2',
    'right-start': 'left-full top-0 ml-2',
    'right-end': 'left-full bottom-0 ml-2'
  };
  return (
    <div className={cn("relative inline-block", className)} {...props}>
      {}
      <div
        ref={triggerRef}
        onClick={toggleDropdown}
        className={cn(
          "cursor-pointer",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {trigger}
      </div>
      {}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className={cn(
              "absolute z-50 min-w-[8rem] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg",
              placementClasses[placement],
              contentClassName
            )}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === DropdownItem) {
                return React.cloneElement(child, {
                  onClick: handleItemClick(child.props.onClick)
                });
              }
              return child;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  selected = false,
  icon,
  shortcut,
  variant = 'default',
  className,
  ...props
}) => {
  const variants = {
    default: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
    destructive: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
  };
  return (
    <motion.button
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg",
        variants[variant],
        selected && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { backgroundColor: "rgba(0,0,0,0.05)" } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      {...props}
    >
      <div className="flex items-center">
        {icon && (
          <span className="mr-2 flex-shrink-0">
            {React.cloneElement(icon, { className: "h-4 w-4" })}
          </span>
        )}
        {children}
        {selected && (
          <Check className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
        )}
      </div>
      {shortcut && (
        <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
          {shortcut}
        </span>
      )}
    </motion.button>
  );
};
const DropdownSeparator = ({ className }) => (
  <div className={cn("my-1 h-px bg-gray-200 dark:bg-gray-700", className)} />
);
const DropdownLabel = ({ children, className }) => (
  <div className={cn("px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", className)}>
    {children}
  </div>
);
// Specialized Dropdown Components
const Select = ({
  value,
  onValueChange,
  placeholder = "Select an option...",
  options = [],
  disabled = false,
  className,
  triggerClassName,
  ...props
}) => {
  const selectedOption = options.find(option => option.value === value);
  const trigger = (
    <div className={cn(
      "flex items-center justify-between w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
      disabled && "opacity-50 cursor-not-allowed",
      triggerClassName
    )}>
      <span className={cn(
        selectedOption ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
      )}>
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      <ChevronDown className="h-4 w-4 text-gray-400" />
    </div>
  );
  return (
    <Dropdown
      trigger={trigger}
      disabled={disabled}
      className={cn("w-full", className)}
      {...props}
    >
      {options.map((option) => (
        <DropdownItem
          key={option.value}
          onClick={() => onValueChange(option.value)}
          selected={value === option.value}
          icon={option.icon}
        >
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};
const MultiSelect = ({
  value = [],
  onValueChange,
  placeholder = "Select options...",
  options = [],
  disabled = false,
  className,
  triggerClassName,
  maxDisplay = 2,
  ...props
}) => {
  const selectedOptions = options.filter(option => value.includes(option.value));
  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onValueChange(newValue);
  };
  const displayText = selectedOptions.length === 0 
    ? placeholder
    : selectedOptions.length <= maxDisplay
    ? selectedOptions.map(opt => opt.label).join(', ')
    : `${selectedOptions.slice(0, maxDisplay).map(opt => opt.label).join(', ')} +${selectedOptions.length - maxDisplay}`;
  const trigger = (
    <div className={cn(
      "flex items-center justify-between w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
      disabled && "opacity-50 cursor-not-allowed",
      triggerClassName
    )}>
      <span className={cn(
        selectedOptions.length > 0 ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
      )}>
        {displayText}
      </span>
      <ChevronDown className="h-4 w-4 text-gray-400" />
    </div>
  );
  return (
    <Dropdown
      trigger={trigger}
      disabled={disabled}
      className={cn("w-full", className)}
      closeOnSelect={false}
      {...props}
    >
      {options.map((option) => (
        <DropdownItem
          key={option.value}
          onClick={() => handleToggle(option.value)}
          selected={value.includes(option.value)}
          icon={option.icon}
        >
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};
const ContextMenu = ({
  children,
  items,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleContextMenu = (e) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };
  return (
    <>
      <div onContextMenu={handleContextMenu} className="w-full h-full">
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed z-50 min-w-[8rem] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg",
              className
            )}
            style={{
              left: position.x,
              top: position.y
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            {...props}
          >
            {items.map((item, index) => (
              <DropdownItem
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                icon={item.icon}
                variant={item.variant}
              >
                {item.label}
              </DropdownItem>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
export {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  Select,
  MultiSelect,
  ContextMenu
};
