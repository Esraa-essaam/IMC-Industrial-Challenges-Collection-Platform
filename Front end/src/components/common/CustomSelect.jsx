import React, { useState, useRef, useEffect, Children } from 'react';

/**
 * CustomSelect - Replicates the modern dropdown UI with IMC identity blue shadow
 * Matching reference image: rounded corners, smooth chevron, active highlight, custom scrollbar.
 */
export default function CustomSelect({
  value,
  onChange,
  options: propOptions,
  children,
  placeholder = '-- اختر من القائمة --',
  name,
  id,
  disabled = false,
  className = '',
  style = {},
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Parse options from props or children (<option>)
  const options = [];
  if (propOptions && Array.isArray(propOptions) && propOptions.length > 0) {
    options.push(...propOptions);
  } else if (children) {
    Children.forEach(children, (child) => {
      if (!child) return;
      if (child.type === 'option') {
        options.push({
          value: child.props.value !== undefined ? child.props.value : '',
          label: child.props.children || child.props.label || '',
          disabled: child.props.disabled || false,
        });
      }
    });
  }

  // Find selected option
  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const displayLabel =
    selectedOption && selectedOption.value !== ''
      ? selectedOption.label
      : options.find((opt) => opt.value === '')?.label || placeholder;

  const isPlaceholderActive = !selectedOption || selectedOption.value === '';

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.querySelectorAll('.custom-select-option');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (opt) => {
    if (opt.disabled) return;
    if (onChange) {
      onChange({
        target: {
          value: opt.value,
          name: name || id || '',
        },
      });
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        const idx = options.findIndex((opt) => String(opt.value) === String(value));
        setHighlightedIndex(idx >= 0 ? idx : 0);
      } else if (highlightedIndex >= 0 && options[highlightedIndex]) {
        handleSelect(options[highlightedIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(options.length - 1);
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    } else if (e.key === 'Tab') {
      if (isOpen) {
        setIsOpen(false);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`custom-select-wrapper ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
      style={{ position: 'relative', width: '100%', ...style }}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden real select for form accessibility / validity */}
      <select
        name={name}
        id={id}
        value={value}
        onChange={() => {}}
        required={required}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        }}
      >
        {options.map((opt, i) => (
          <option key={`${opt.value}-${i}`} value={opt.value}>
            {typeof opt.label === 'string' ? opt.label : opt.value}
          </option>
        ))}
      </select>

      {/* Visible Trigger Box */}
      <div
        className={`custom-select-trigger ${isOpen ? 'active' : ''} ${isPlaceholderActive ? 'is-placeholder' : ''}`}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="custom-select-value-text">{displayLabel}</span>
        
        {/* Chevron Icon */}
        <span className={`custom-select-chevron ${isOpen ? 'rotated' : ''}`}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

      {/* Dropdown Menu (Matching User Reference Image) */}
      {isOpen && (
        <div className="custom-select-dropdown" role="listbox">
          <div className="custom-select-options-list" ref={listRef}>
            {options.map((opt, index) => {
              const isSelected = String(opt.value) === String(value);
              const isHighlighted = highlightedIndex === index;
              return (
                <div
                  key={`${opt.value}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`custom-select-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${opt.disabled ? 'disabled' : ''}`}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span className="custom-option-label">{opt.label}</span>
                  {isSelected && (
                    <span className="custom-option-check">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

