"use client";

interface SegmentedControlProps {
  value: string;
  options: Array<{ value: string; label: string | React.ReactNode }>;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  value,
  options,
  onChange,
  className = "",
}: SegmentedControlProps) {
  return (
    <div className={`flex gap-1 p-1 bg-gray-100 rounded-lg ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-all ${
            value === option.value
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          {typeof option.label === "string" ? (
            option.label
          ) : (
            <div className="flex items-center justify-center">{option.label}</div>
          )}
        </button>
      ))}
    </div>
  );
}

