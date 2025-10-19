import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface SymptomSearchProps {
  onSymptomChange: (symptoms: string[]) => void;
  currentSymptoms?: string[];
}

const commonSymptoms = [
  "Fever", "Headache", "Cough", "Sore Throat", "Nausea",
  "Fatigue", "Body Aches", "Runny Nose", "Shortness of Breath",
  "Dizziness", "Stomach Pain", "Diarrhea", "Vomiting", "Chills",
  "Broken Bone", "Swellings", "Congestion", "Sneezing", "Chest Pain"
];

export const SymptomSearch = ({ onSymptomChange, currentSymptoms = [] }: SymptomSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSymptoms, setFilteredSymptoms] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = commonSymptoms.filter(
        symptom =>
          symptom.toLowerCase().includes(inputValue.toLowerCase()) &&
          !currentSymptoms.includes(symptom)
      );
      setFilteredSymptoms(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredSymptoms([]);
      setShowDropdown(false);
    }
  }, [inputValue, currentSymptoms]);

  const addSymptom = (symptom: string) => {
    // Find the properly cased version from commonSymptoms list (case-insensitive match)
    const properCasedSymptom = commonSymptoms.find(
      s => s.toLowerCase() === symptom.toLowerCase()
    ) || symptom; // If not found in list, use as-is (for custom symptoms)
    
    if (!currentSymptoms.includes(properCasedSymptom)) {
      const newSymptoms = [...currentSymptoms, properCasedSymptom];
      onSymptomChange(newSymptoms);
      setInputValue("");
      setShowDropdown(false);
    }
  };

  const removeSymptom = (symptom: string) => {
    const newSymptoms = currentSymptoms.filter(s => s !== symptom);
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
    </div>
  );
};
