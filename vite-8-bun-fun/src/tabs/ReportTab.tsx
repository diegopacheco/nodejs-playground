import { useQuery } from "@tanstack/react-query";
import { getProductReport } from "../store";

export default function ReportTab() {
  const { data: report } = useQuery({
    queryKey: ["report"],
    queryFn: getProductReport,
  });

  if (!report) return null;

  return (
    <div>
      <h2>Product Report</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="value">{report.totalProducts}</div>
          <div className="label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="value">${report.totalValue.toLocaleString()}</div>
          <div className="label">Total Inventory Value</div>
        </div>
        <div className="stat-card">
          <div className="value">${report.avgPrice.toFixed(2)}</div>
          <div className="label">Average Price</div>
        </div>
        <div className="stat-card">
          <div className="value">{report.avgRating.toFixed(1)}</div>
          <div className="label">Average Rating</div>
        </div>
      </div>
      <h2>By Category</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(report.byCategory).map(([cat, count]) => (
            <tr key={cat}>
              <td>{cat}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
