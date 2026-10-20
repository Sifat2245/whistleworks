import { Table, ConfigProvider, Select, Input, Button, Alert, Spin } from "antd";
import { ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import badge from "@/assets/svg/badge.svg";
import Icon from "@/components/common/Icon";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useRefereeEvaluations } from "@/hooks/api/useRankings";
import { useRecommendedLevels } from "@/hooks/api/useEvaluation";
import {
  resolveLevels,
  computeLevelCounts,
  LEVEL_LABELS,
} from "@/lib/recommendedLevels";
import RankingRefereeCard from "./RankingRefereeCard";

const { Option } = Select;

export default function RankingReportTable({ camp_id }) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState(null);
  const [minScore, setMinScore] = useState(null);

  const {
    evaluations = [],
    isLoading,
    error,
  } = useRefereeEvaluations(camp_id);

  // Recommended levels are driven by the camp's sports type
  // (e.g. HS Basketball → Large School Varsity ... JH/ELEM).
  const { data: recommendedLevels = [], isLoading: levelsLoading } =
    useRecommendedLevels(camp_id);

  const levels = resolveLevels(recommendedLevels);

  // If the level list swaps after the sports-type data loads (e.g. the user
  // picked a legacy level while the HS Basketball list was still loading),
  // clear the stale filter so it can't silently match nothing.
  useEffect(() => {
    if (level && !levels.includes(level)) {
      setLevel(null);
    }
  }, [levels, level]);

  const isPermissionDenied = error?.response?.status === 403;

  const filteredData = useMemo(() => {
    if (!evaluations?.length) return [];

    const processedData = evaluations.map((item) => {
      const levelCounts = computeLevelCounts(item, levels, recommendedLevels);

      return {
        key: item.referee_id,
        name: item.referee_name,
        avatarUrl: item.referee_avatar,
        address: item.referee_address,
        overall: item.averages?.overall !== undefined ? parseFloat(Number(item.averages.overall).toFixed(3)) : 0,
        callAccur: item.averages?.call_accuracy !== undefined ? parseFloat(Number(item.averages.call_accuracy).toFixed(1)) : 0,
        mech: item.averages?.court_position_mechanics !== undefined ? parseFloat(Number(item.averages.court_position_mechanics).toFixed(1)) : 0,
        fitMob: item.averages?.fitness_mobility !== undefined ? parseFloat(Number(item.averages.fitness_mobility).toFixed(1)) : 0,
        comm: item.averages?.communication_skills !== undefined ? parseFloat(Number(item.averages.communication_skills).toFixed(1)) : 0,
        consistency: item.averages?.consistency_of_calls !== undefined ? parseFloat(Number(item.averages.consistency_of_calls).toFixed(1)) : 0,
        gA: item.averages?.game_awareness !== undefined ? parseFloat(Number(item.averages.game_awareness).toFixed(1)) : 0,
        totalEvaluations: item.total_evaluations || 0,
        levelCounts,
      };
    });

    let filtered = processedData.filter((item) => {
      const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
      const matchesScore = minScore ? item.overall >= minScore : true;
      const matchesLevel =
        !level || (item.levelCounts[level] || 0) > 0;
      return matchesSearch && matchesLevel && matchesScore;
    });

    filtered.sort((a, b) => b.overall - a.overall);
    return filtered.map((item, index) => ({ ...item, rank: index + 1 }));
  }, [evaluations, search, level, minScore, levels, recommendedLevels]);

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setLevel(null);
    setMinScore(null);
  }, []);

  // NOW SAFE: No hooks after this line
  const levelColumns = levels.map((lvl) => ({
    title: (
      <span title={lvl} className="cursor-help">
        {LEVEL_LABELS[lvl] || lvl}
      </span>
    ),
    width: 90,
    align: "center",
    render: (_, record) =>
      (record.levelCounts[lvl] || 0) > 0 ? record.levelCounts[lvl] : "-",
  }));

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      width: 100,
      fixed: "left",
      render: (rank) => (
        <div className="flex items-center gap-2 font-semibold">
          <Icon src={badge} className="size-6" />
          <span>#{rank}</span>
        </div>
      ),
    },
    {
      title: "Referee",
      dataIndex: "name",
      width: 240,
      fixed: "left",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img src={record.avatarUrl} className="w-12 h-12 rounded-full object-cover shrink-0" alt="" />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-xs text-gray-500">
              {record.address}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Overall",
      dataIndex: "overall",
      width: 100,
      render: (value) => (value || 0).toFixed(3),
    },
    { title: "Call Accur.", dataIndex: "callAccur", width: 110, render: (v) => v?.toFixed(1) || "-" },
    { title: "Mech", dataIndex: "mech", width: 80, render: (v) => v?.toFixed(1) || "-" },
    { title: "Fit/Mob", dataIndex: "fitMob", width: 100, render: (v) => v?.toFixed(1) || "-" },
    { title: "Comm", dataIndex: "comm", width: 80, render: (v) => v?.toFixed(1) || "-" },
    { title: "Consistency", dataIndex: "consistency", width: 120, render: (v) => v?.toFixed(1) || "-" },
    { title: "G/A", dataIndex: "gA", width: 80, render: (v) => v?.toFixed(1) || "-" },
    ...levelColumns,
  ];

  // Early returns are now 100% safe
  if (isPermissionDenied) {
    return (
      <div className="w-full rounded-2xl border border-border p-8 bg-white">
        <Alert
          message="Ranking Report Not Available"
          description={
            <>
              <p>You do not have permission to view evaluations for this camp. Contact the director.</p>
              <p className="text-sm text-gray-600 mt-3">
                Note: The director controls access to the full ranking report.
              </p>
            </>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="max-w-3xl mx-auto"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full rounded-2xl border border-border p-12 bg-white flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!evaluations?.length) {
    return (
      <div className="w-full rounded-2xl border border-border p-8 bg-white">
        <Alert
          message="No Rankings Available"
          description="No evaluations have been submitted yet for this camp."
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-border p-4 sm:p-6 bg-white">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
        Complete Rankings
      </h1>

      {/* Responsive Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Input
          placeholder="Search referee name..."
          allowClear
          className="w-full sm:w-64 h-10 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder={levelsLoading ? "Loading levels..." : "Filter by recommended level"}
          allowClear
          className="w-full sm:w-56 h-10"
          value={level}
          onChange={setLevel}
        >
          {levels.map((lvl) => (
            <Option key={lvl} value={lvl}>
              {lvl}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Min overall score"
          allowClear
          className="w-full sm:w-48 h-10"
          value={minScore}
          onChange={setMinScore}
        >
          {[5, 6, 7, 8, 9].map((score) => (
            <Option key={score} value={score}>
              {score}.0+
            </Option>
          ))}
        </Select>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleResetFilters}
          className="w-full sm:w-auto h-10 flex items-center justify-center cursor-pointer"
        >
          Reset Filters
        </Button>
      </div>

      {/* Desktop Table View (md and up) */}
      <div className="hidden md:block">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1890ff",
            },
          }}
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={false}
            scroll={{ x: 1500 }}
            rowClassName="hover:bg-gray-50"
            locale={{ emptyText: "No data matching your filters" }}
          />
        </ConfigProvider>
      </div>

      {/* Mobile Card View (below md) */}
      <div className="block md:hidden space-y-3.5">
        {filteredData.length > 0 ? (
          filteredData.map((record) => (
            <RankingRefereeCard
              key={record.key}
              record={record}
              levels={levels}
            />
          ))
        ) : (
          <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium">No referees match your filters</p>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleResetFilters}
              className="mt-3 cursor-pointer"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}