import { Table, ConfigProvider, Select, Input, Button, Alert, Spin } from "antd";
import { ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import badge from "@/assets/svg/badge.svg";
import Icon from "@/components/common/Icon";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useRefereeEvaluations } from "@/hooks/api/useRankings";
import { useRecommendedLevels } from "@/hooks/api/useEvaluation";
import { resolveLevels, LEVEL_LABELS } from "@/lib/recommendedLevels";

const { Option } = Select;

export default function RankingReportTable({ camp_id, sports_type_name }) {
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
    useRecommendedLevels(sports_type_name);

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
      const levelCounts = {};
      (item.recommended_levels || []).forEach((rl) => {
        levelCounts[rl.level] = rl.count;
      });

      return {
        key: item.referee_id,
        name: item.referee_name,
        avatarUrl: item.referee_avatar,
        address: item.referee_address,
        overall: parseFloat(item.averages.overall.toFixed(3)),
        callAccur: parseFloat(item.averages.call_accuracy.toFixed(1)),
        mech: parseFloat(item.averages.court_position_mechanics.toFixed(1)),
        fitMob: parseFloat(item.averages.fitness_mobility.toFixed(1)),
        comm: parseFloat(item.averages.communication_skills.toFixed(1)),
        consistency: parseFloat(item.averages.consistency_of_calls.toFixed(1)),
        gA: parseFloat(item.averages.game_awareness.toFixed(1)),
        totalEvaluations: item.total_evaluations,
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
  }, [evaluations, search, level, minScore]);

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
    <div className="w-full rounded-2xl border border-border p-5 bg-white">
      <h1 className="text-2xl font-semibold mb-6">Complete Rankings</h1>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <Input
          placeholder="Search referee name..."
          allowClear
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder={levelsLoading ? "Loading levels..." : "Filter by recommended level"}
          allowClear
          className="w-56"
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
          className="w-48"
          value={minScore}
          onChange={setMinScore}
        >
          {[5, 6, 7, 8, 9].map((score) => (
            <Option key={score} value={score}>
              {score}.0+
            </Option>
          ))}
        </Select>
        <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>

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
  );
}