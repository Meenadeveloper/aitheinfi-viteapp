import { useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
// import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Loader2 } from "lucide-react";

type FilterState = {
  year: string[];
  month: string[];
  strategy: string[];
  longShort: string[];
  intraMultiday: string[];
};

const YEARS = ["2019", "2020", "2021"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const STRATEGIES = ["Strategy1", "Strategy2", "Strategy3", "Strategy4"];
const LONG_SHORT = ["Long", "Short"];
const INTRA_MULTIDAY = ["Intraday"];

function ToggleGroup({
  label,
  options,
  selected,
  onSelect,
  multi = true,
}: {
  label: string;
  options: string[];
  selected: string[];
  onSelect: (values: string[]) => void;
  multi?: boolean;
}) {
  function handleClick(option: string) {
    if (multi) {
      onSelect(
        selected.includes(option)
          ? selected.filter((v) => v !== option)
          : [...selected, option]
      );
    } else {
      onSelect(selected[0] === option ? [] : [option]);
    }
  }
  return (
    <div className="mb-2 flex flex-col  gap-2">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-2">
        <span className="mr-3 dark:text-white  text-[14px] font-bold min-w-[65px] uppercase">
          {label}
        </span>
        <div className="flex flex-wrap gap-4">
          <TuneIcon
            fontSize="medium"
            className="dark:text-[#fff]  cursor-pointer"
          />
          <FilterAltOffIcon
            fontSize="medium"
            className="dark:text-[#fff] cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
                className={`px-4 py-1 rounded-md text-xs font-semibold
                
            ${
              selected.includes(option)
                ? "bg-[#f2f2f2] text-black"
                : "bg-[#00b0f0] text-white hover:bg-[#14B9FF] hover:text-black transition"
            }
          `}
            onClick={() => handleClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

const initialFilterState: FilterState = {
  year: [],
  month: [],
  strategy: [],
  longShort: [],
  intraMultiday: [],
};

type FilterBarProps = {
  onSubmit: (filters: FilterState) => void;
};

const FilterBar = ({ onSubmit }: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
// loading state inside FilterBar if you want spinner inside button
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit(filters);
    }, 2000);
  }
  return (
    <div className="card w-full  p-4 space-y-2 mx-auto">
      {/* Year and Month Rows */}
      <div className="flex flex-col md:flex-row md:gap-[20px]  gap-2 mb-2">
        <div className="card backdrop-blur-lg dark:!bg-black/40 p-4">
          <ToggleGroup
            label="Year"
            options={YEARS}
            selected={filters.year}
            onSelect={(year) => setFilters((f) => ({ ...f, year }))}
            multi
          />
        </div>
        <div className="card backdrop-blur-lg dark:!bg-black/40 p-4">
          <ToggleGroup
            label="Month"
            options={MONTHS}
            selected={filters.month}
            onSelect={(month) => setFilters((f) => ({ ...f, month }))}
            multi
          />
        </div>
      </div>
      {/* Strategy, Long/Short, Intra/Multiday Row */}
      <div className="flex flex-col md:flex-row md:gap-[20px]  gap-2">
        <div className="card backdrop-blur-lg dark:!bg-black/40 p-4">
          <ToggleGroup
            label="Strategy"
            options={STRATEGIES}
            selected={filters.strategy}
            onSelect={(strategy) => setFilters((f) => ({ ...f, strategy }))}
            multi
          />
        </div>
        <div className="card backdrop-blur-lg dark:!bg-black/40 p-4">
          <ToggleGroup
            label="Long or Short"
            options={LONG_SHORT}
            selected={filters.longShort}
            onSelect={(longShort) => setFilters((f) => ({ ...f, longShort }))}
            multi={false}
          />
        </div>
        <div className="card backdrop-blur-lg dark:!bg-black/40 p-4">
          <ToggleGroup
            label="Intra or Multiday"
            options={INTRA_MULTIDAY}
            selected={filters.intraMultiday}
            onSelect={(intraMultiday) =>
              setFilters((f) => ({ ...f, intraMultiday }))
            }
            multi={false}
          />
        </div>
      </div>
      <div className="pt-3 flex justify-end">
        <button
          type="button"
          className="flex items-center text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 ltr:mr-2 rtl:ml-2 animate-spin" />
              Processing...
            </>
          ) : (
            <> Submit</>
          )}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
