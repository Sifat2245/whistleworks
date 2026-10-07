const TopPerformersTable = ({ list }) => {
  if (!list || !list.length) return null;

  return (
    <div className="mt-3 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
      <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800">
          Top-Ranked Officials Leaderboard
        </span>
        <span className="text-[11px] font-semibold text-slate-500">
          Aggregate Multi-Camp Index
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Official</th>
              <th className="p-3">Score</th>
              <th className="p-3">Camps</th>
              <th className="p-3">Certified Tier</th>
              <th className="p-3">Status Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((item) => (
              <tr key={item.rank} className="hover:bg-slate-50/90 transition-colors">
                <td className="p-3 font-extrabold text-primary">#{item.rank}</td>
                <td className="p-3 font-bold text-slate-900">{item.name}</td>
                <td className="p-3 font-black text-emerald-600">{item.score} / 10</td>
                <td className="p-3 text-slate-600">{item.camps} Camps</td>
                <td className="p-3 text-slate-600">{item.level}</td>
                <td className="p-3">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopPerformersTable;
