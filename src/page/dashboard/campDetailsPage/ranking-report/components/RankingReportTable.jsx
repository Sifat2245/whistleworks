import { Table, ConfigProvider, Select, Input, Button, Alert, Spin } from "antd";
import { ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import badge from "@/assets/svg/badge.svg";
import Icon from "@/components/common/Icon";
import { useMemo, useState, useCallback } from "react";
import { useRefereeEvaluations } from "@/hooks/api/useRankings";

const { Option } = Select;

const LEVEL_OPTIONS = [
  { label: "DI", value: "NCAA D1" },
  { label: "D2", value: "NCAA D2" },
  { label: "NAIA", value: "NAIA" },
  { label: "JC", value: "JUCO" },
  { label: "HS", value: "HS" },
  { label: "JH", value: "JH/ELEM" },
];

export default function RankingReportTable({ camp_id }) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState(null);
  const [minScore, setMinScore] = useState(null);

  const {
    evaluations = [],
    isLoading,
    error,
  } = useRefereeEvaluations(camp_id);

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
        d1: levelCounts["NCAA D1"] || 0,
        d2: levelCounts["NCAA D2"] || 0,
        naia: levelCounts["NAIA"] || 0,
        jc: levelCounts["JUCO"] || 0,
        hs: levelCounts["HS"] || 0,
        jh: levelCounts["JH/ELEM"] || 0,
      };
    });

    let filtered = processedData.filter((item) => {
      const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
      const matchesScore = minScore ? item.overall >= minScore : true;
      const matchesLevel =
        !level ||
        (level === "NCAA D1" && item.d1 > 0) ||
        (level === "NCAA D2" && item.d2 > 0) ||
        (level === "NAIA" && item.naia > 0) ||
        (level === "JUCO" && item.jc > 0) ||
        (level === "HS" && item.hs > 0) ||
        (level === "JH/ELEM" && item.jh > 0);
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
    {
      title: "DI",
      dataIndex: "d1",
      width: 70,
      align: "center",
      render: (count) => (count > 0 ? count : "-"),
    },
    {
      title: "D2",
      dataIndex: "d2",
      width: 70,
      align: "center",
      render: (count) => (count > 0 ? count : "-"),
    },
    {
      title: "NAIA",
      dataIndex: "naia",
      width: 80,
      align: "center",
      render: (count) => (count > 0 ? count : "-"),
    },
    {
      title: "JC",
      dataIndex: "jc",
      width: 70,
      align: "center",
      render: (count) => (count > 0 ? count : "-"),
    },
    {
      title: "HS",
      dataIndex: "hs",
      width: 70,
      align: "center",
      render: (count) => (count > 0 ? count : "-"),
    },
    {
      title: "JH",
      dataIndex: "jh",
      width: 70,
      align: "center",
      render: (count) => (count > 0 ? count : "-"),
    },
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
          placeholder="Filter by recommended level"
          allowClear
          className="w-56"
          value={level}
          onChange={setLevel}
        >
          {LEVEL_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
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