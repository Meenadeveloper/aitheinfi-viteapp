import React, {useState, useEffect } from "react";
import BreadCrumb from "../../Common/BreadCrumb";
import { useNavigate } from "react-router-dom";
import {
  GradientChart,
} from "../../Common/Components/chart/RadiantChart";
import TagIcon from "@mui/icons-material/Tag";         // for #
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // for $
import LineChart from "../../Common/Components/chart/LineChart";
import FilterBar from "../../Common/Components/chart/FilterBar";
import BasicLineChart from "../../Common/Components/chart/BasicLineChart";
import WelcomeWidget from "./Ecommerce/WelcomeWidget";
interface HexagonProps {
  label: string;
}
// Hexagon component with clip-path hex shape
const Hexagon: React.FC<HexagonProps> = ({ label }) => (
  <div className="w-70 h-70 bg-[#00b0f0] clip-hexagon">
    <div className="w-40 h-40  clip-hexagon flex items-center justify-center text-white text-sm font-semibold">
      {label}
    </div>
  </div>
);
// Tailwind clip-path hexagon utility via style tag or external CSS
const hexClipPath = `
  .clip-hexagon {
    clip-path: polygon(
      25% 6.7%, 75% 6.7%, 100% 50%, 
      75% 93.3%, 25% 93.3%, 0% 50%
    );
  }
`;

const Overview = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/overview");
  }, [navigate]);

  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState<FilterState | null>(null);
  // Declare FilterState if needed
  type FilterState = {
    year: string[];
    month: string[];
    strategy: string[];
    longShort: string[];
    intraMultiday: string[];
  };

  // Then your component code using FilterState below

  function onFilterSubmit(filters: FilterState) {
    setLoading(true);
    setFilterData(null);

    setTimeout(() => {
      setLoading(false);
      setFilterData(filters);
      console.log("Submitted Filters:", filters);
    }, 2000);
  }
  return (
    <React.Fragment>
      <style>{hexClipPath}</style>
      <BreadCrumb title="Overview" pageTitle="Dashboards" />
      <WelcomeWidget />
      <FilterBar onSubmit={onFilterSubmit} />
      {/* Optionally show loading UI */}
      {loading && <div className="text-white p-4">Loading filters...</div>}

      {/* Continue with rest of Overview UI */}

      {/* You can show submitted filters or charts here */}
      {/* {filterData && (
        <pre className="text-white p-4 bg-gray-800 rounded">
          {JSON.stringify(filterData, null, 2)}
        </pre>
      )} */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[24%_50%_22%]">
        {/* Left column */}
        <div className="card">
          <div className="card-body flex flex-col gap-4 items-center justify-between w-full  h-full">
            {/* Total Gross / Total Net */}

            <div className="card w-full backdrop-blur-lg  dark:!bg-black/40">
              <div className="card-body flex items-center justify-center  flex-col gap-4 h-full">
                <h6 className="mb-2 text-[16px]">TOTAL GROSS</h6>
                <p className="text-[50px]">500</p>
              </div>
            </div>
            <div className="card w-full backdrop-blur-lg dark:!bg-black/40">
              <div className="card-body flex items-center justify-center   flex-col gap-4 h-full">
                <h6 className="mb-2 text-[16px]">TOTEL NET</h6>
                <p className="text-[50px]">400</p>
              </div>
            </div>
          </div>
        </div>
        {/* Center column */}
        <div className="card">
          <div className="card-body flex flex-col justify-between h-full">
            <h6 className="mb-2 text-[16px]">WIN RATE</h6>
            <GradientChart chartId="gradientChart" />
            <div className="flex justify-end mt-2 space-x-4">
              <Hexagon label="Risk Reward" />
              <Hexagon label="Profit Factor" />
            </div>
          </div>
        </div>
        {/* Right column */}
        <div className="flex flex-col gap-2 h-full">
          <div className="card flex-1">
            <div className="card-body flex items-center justify-center flex-col gap-4 ">
              {/* Number of Trades */}

              <h6 className="mb-2 text-[16px] uppercase"> Number of Trades</h6>
              <p className="text-[50px]">200</p>
            </div>
          </div>
          <div className="card flex-1">
            <div className="card-body flex items-center justify-center flex-col gap-4 ">
              {/* Fees */}

              <h6 className="mb-2 text-[16px] uppercase"> Fees</h6>
              <p className="text-[50px]">200</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[40%_55%]">
        <div className="card">
          <div className="card-body">
            <h6 className="mb-2 text-[14px] p-2 px-4 backdrop-blur-lg dark:!bg-black/40 rounded-[10px] w-[fit-content]">
              Wins x Losses
            </h6>
            <div className="grid grid-cols-2 gap-2">
              <div className="card  ">
                <div className="card-body flex backdrop-blur-lg dark:!bg-black/40  gap-4 rounded-[6px] ">
                  <div className="bg-blue-900 p-2 rounded-[5px] h-[fit-content]">
                    <TagIcon sx={{ color: "#fff" }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] font-bold dark:text-white">
                      Wins
                    </p>
                    <p className="text-[14px]  dark:text-white">100</p>
                  </div>
                </div>
              </div>

              <div className="card ">
                <div className="card-body flex  backdrop-blur-lg dark:!bg-black/40 gap-4 rounded-[6px]">
                  <div className="bg-blue-900 p-2 rounded-[5px] h-[fit-content]">
                    <AttachMoneyIcon sx={{ color: "#fff" }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] font-bold dark:text-white">
                      Wins
                    </p>
                    <p className="text-[14px]  dark:text-white">200</p>
                  </div>
                </div>
              </div>

              <div className="card flex-1 ">
                <div className="card-body flex backdrop-blur-lg dark:!bg-black/40  gap-4 rounded-[6px] ">
                  <div className="bg-blue-900 p-2 rounded-[5px] h-[fit-content]">
                    <TagIcon sx={{ color: "#fff" }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] font-bold dark:text-white">
                      Wins
                    </p>
                    <p className="text-[14px]  dark:text-white">100</p>
                  </div>
                </div>
              </div>

              <div className="card flex-1">
                <div className="card-body flex backdrop-blur-lg dark:!bg-black/40 gap-4 rounded-[6px]">
                  <div className="bg-blue-900 p-2 rounded-[5px] h-[fit-content]">
                    <AttachMoneyIcon sx={{ color: "#fff" }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] font-bold dark:text-white">
                      Wins
                    </p>
                    <p className="text-[14px]  dark:text-white">200</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h6 className="mb-4 text-[14px] p-2 px-4 dark:text-white backdrop-blur-lg dark:!bg-black/40 rounded-[10px] w-[fit-content]">
              P&L Last 30days
            </h6>
            <LineChart chartId="columnNegativeValueChart" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h6 className="mb-4 text-15">Gross and Net</h6>
          <BasicLineChart chartId="chartLine" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Overview;
