import { useState } from "react";
import CrudTab from "./tabs/CrudTab";
import SearchTab from "./tabs/SearchTab";
import Top3Tab from "./tabs/Top3Tab";
import ReportTab from "./tabs/ReportTab";
import FeedbackTab from "./tabs/FeedbackTab";

const tabs = ["CRUD", "Search", "Top 3", "Report", "Feedback"];

export default function App() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <h1>Product Manager</h1>
      <div className="tabs">
        {tabs.map((t, i) => (
          <button
            key={t}
            className={`tab-btn ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            {t}
          </button>
        ))}
      </div>
      {active === 0 && <CrudTab />}
      {active === 1 && <SearchTab />}
      {active === 2 && <Top3Tab />}
      {active === 3 && <ReportTab />}
      {active === 4 && <FeedbackTab />}
    </div>
  );
}
