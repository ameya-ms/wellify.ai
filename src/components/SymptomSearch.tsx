import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface SymptomSearchProps {
  onSymptomChange: (symptoms: string[]) => void;
}

const commonSymptoms = [
  "Fever", "Headache", "Cough", "Sore Throat", "Nausea",
  "Fatigue", "Body Aches", "Runny Nose", "Shortness of Breath",
  "Dizziness", "Stomach Pain", "Diarrhea", "Vomiting", "Chills"
];

export const SymptomSearch = ({ onSymptomChange }: SymptomSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = commonSymptoms.filter(
        symptom =>
          symptom.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedSymptoms.includes(symptom)
      );
      setFilteredSymptoms(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredSymptoms([]);
      setShowDropdown(false);
    }
  }, [inputValue, selectedSymptoms]);

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      const newSymptoms = [...selectedSymptoms, symptom];
      setSelectedSymptoms(newSymptoms);
      onSymptomChange(newSymptoms);
      setInputValue("");
      setShowDropdown(false);
    }
  };

  const removeSymptom = (symptom: string) => {
    const newSymptoms = selectedSymptoms.filter(s => s !== symptom);
    setSelectedSymptoms(newSymptoms);
    onSymptomChange(newSymptoms);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (filteredSymptoms.length > 0) {
        addSymptom(filteredSymptoms[0]);
      } else {
        addSymptom(inputValue.trim());
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search symptoms (e.g., fever, headache)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowDropdown(true)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fade-in">
          {filteredSymptoms.map((symptom) => (
            <button
              key={symptom}
              onClick={() => addSymptom(symptom)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors text-foreground"
            >
              {symptom}
            </button>
          ))}
        </div>
      )}

      {/* Selected symptoms */}
      {selectedSymptoms.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 animate-fade-in">
          {selectedSymptoms.map((symptom) => (
            <Badge
              key={symptom}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-primary/10 transition-colors"
            >
              {symptom}
              <button
                onClick={() => removeSymptom(symptom)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
