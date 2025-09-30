import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Search, X, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  placeholder,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  clearable = false,
  disabled = false,
  required = false,
  fullWidth = false,
  size = 'default',
  variant = 'default',
  onClear,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const baseClasses = "flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
  const variants = {
    default: "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400",
    filled: "bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500",
    outlined: "border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400",
    underlined: "border-0 border-b-2 border-gray-300 dark:border-gray-600 rounded-none focus:border-blue-500 dark:focus:border-blue-400 px-0"
  };
  const sizes = {
    sm: "h-8 px-2 text-xs",
    default: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base"
  };
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    if (props.onChange) {
      props.onChange({ target: { value: '' } });
    }
  };
  const inputClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    error && "border-red-500 focus:border-red-500 focus:ring-red-500",
    success && "border-green-500 focus:border-green-500 focus:ring-green-500",
    leftIcon && "pl-10",
    (rightIcon || clearable || type === 'password') && "pr-10",
    fullWidth && "w-full",
    className
  );
  return (
    <div className={cn("relative", fullWidth && "w-full")}>
      {label && (
        <motion.label
          className={cn(
            "block text-sm font-medium mb-2 transition-colors duration-200",
            error ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500"
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {React.cloneElement(leftIcon, { className: "h-4 w-4" })}
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {clearable && props.value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          {rightIcon && !clearable && type !== 'password' && (
            <div className="text-gray-400">
              {React.cloneElement(rightIcon, { className: "h-4 w-4" })}
            </div>
          )}
          {error && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          {success && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>
      </div>
      {(error || success || helperText) && (
        <motion.div
          className={cn(
            "mt-1 text-xs",
            error ? "text-red-600 dark:text-red-400" : 
            success ? "text-green-600 dark:text-green-400" : 
            "text-gray-500 dark:text-gray-400"
          )}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          {error || helperText}
        </motion.div>
      )}
      {isFocused && variant === 'default' && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-blue-500 pointer-events-none"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 0.3, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
});
Input.displayName = "Input";
// Specialized Input Components
const SearchInput = React.forwardRef(({
  onSearch,
  clearable = true,
  placeholder = "Search...",
  ...props
}, ref) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.target.value);
    }
  };
  return (
    <Input
      ref={ref}
      type="search"
      leftIcon={<Search />}
      placeholder={placeholder}
      clearable={clearable}
      onKeyPress={handleKeyPress}
      {...props}
    />
  );
});
SearchInput.displayName = "SearchInput";
const FloatingLabelInput = React.forwardRef(({
  label,
  className,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(e.target.value !== '');
  };
  return (
    <div className={cn("relative", className)}>
      <Input
        ref={ref}
        className="peer"
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=" "
        {...props}
      />
      <motion.label
        className={cn(
          "absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none",
          "peer-focus:text-blue-500 peer-focus:text-xs peer-focus:-top-2 peer-focus:left-2 peer-focus:bg-white peer-focus:px-1",
          (isFocused || hasValue) && "text-xs -top-2 left-2 bg-white px-1 text-blue-500"
        )}
        initial={false}
        animate={{
          top: isFocused || hasValue ? -8 : 10,
          fontSize: isFocused || hasValue ? 12 : 14,
          left: isFocused || hasValue ? 8 : 12
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
    </div>
  );
});
FloatingLabelInput.displayName = "FloatingLabelInput";
const TextArea = React.forwardRef(({
  className,
  label,
  error,
  helperText,
  required = false,
  rows = 3,
  resize = true,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className={cn(
          "block text-sm font-medium mb-2",
          error ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300",
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          !resize && "resize-none",
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <div className={cn(
          "mt-1 text-xs",
          error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
        )}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});
TextArea.displayName = "TextArea";
export {
  Input,
  SearchInput,
  FloatingLabelInput,
  TextArea
};
