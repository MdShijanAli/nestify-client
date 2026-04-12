import { MapPin } from "lucide-react";

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchAutocomplete({
  value,
  onChange,
}: SearchAutocompleteProps) {
  return (
    <div className="relative flex-1">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="City, zip, or property name..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 h-9"
        />
      </div>
    </div>
  );
}
