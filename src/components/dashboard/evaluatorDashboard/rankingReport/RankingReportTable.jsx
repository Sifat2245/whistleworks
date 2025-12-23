import { Table, ConfigProvider, theme, Avatar, Select, Input, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import badge from "@/assets/svg/badge.svg";
import Icon from "@/components/common/Icon";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMemo, useState } from "react";

const { Option } = Select;

// Note: filter by lebel options
const LEVEL_OPTIONS = [
  { label: "NCAA D1", value: "NCAA_D1" },
  { label: "NCAA D2", value: "NCAA_D2" },
  { label: "NAIA", value: "NAIA" },
  { label: "JUCO", value: "JUCO" },
  { label: "HS", value: "HS" },
  { label: "JH / ELEM", value: "JH/ELEM" },
];


export default function RankingReportTable({ camp_id }) {
  const axiosInstace = useAxiosSecure();

  // Note: Filter states
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState(null);
  const [minScore, setMinScore] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["referees-ranking", camp_id],
    enabled: !!camp_id,
    queryFn: async () => {
      const response = await axiosInstace.get(
        `/referee/evaluation/camp/${camp_id}`
      );
      return response?.data?.data;
    },
    refetchInterval: 2000,
    refetchOnWindowFocus: true
  });

  // Note: Apply filters
  const filteredData = useMemo(() => {
    const rawData =
      data?.evaluations?.map((item, index) => ({
        key: item.id,
        rank: index + 1,
        name: item.referee?.name,
        avatarUrl: item.referee?.avatar,
        overall: item.average_score,
        callAccur: item.performance_criteria?.call_accuracy,
        mech: item.performance_criteria?.court_position_mechanics,
        fitMob: item.performance_criteria?.fitness_mobility,
        comm: item.performance_criteria?.communication_skills,
        consistency: item.performance_criteria?.consistency_of_calls,
        gA: item.performance_criteria?.game_awareness,
        level: item.recommended_highest_level,
        d1: item.recommended_highest_level === "NCAA_D1" ? "✔" : "",
        d2: item.recommended_highest_level === "NCAA_D2" ? "✔" : "",
        naia: item.recommended_highest_level === "NAIA" ? "✔" : "",
        jc: item.recommended_highest_level === "JUCO" ? "✔" : "",
        hs: item.recommended_highest_level === "HS" ? "✔" : "",
        jh: item.recommended_highest_level === "JH/ELEM" ? "✔" : "",
      })) || [];

    return rawData.filter((item) => {
      const matchSearch = item.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchLevel = level ? item.level === level : true;
      const matchScore = minScore ? item.overall >= minScore : true;

      return matchSearch && matchLevel && matchScore;
    });
  }, [data, search, level, minScore]);

  const handleResetFilters = () => {
    setSearch("");
    setLevel(null);
    setMinScore(null);
  };

  // Note: tabel column list
  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      width: 100,
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
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatarUrl} size="large" />
          <span>{record.name}</span>
        </div>
      ),
    },
    { title: "Overall", dataIndex: "overall", width: 100 },
    { title: "Call Accur.", dataIndex: "callAccur", width: 120 },
    { title: "Mech", dataIndex: "mech", width: 80 },
    { title: "Fit/Mob", dataIndex: "fitMob", width: 100 },
    { title: "Comm", dataIndex: "comm", width: 80 },
    { title: "Consistency", dataIndex: "consistency", width: 120 },
    { title: "G/A", dataIndex: "gA", width: 80 },
    { title: "DI", dataIndex: "d1", width: 60 },
    { title: "D2", dataIndex: "d2", width: 60 },
    { title: "NAIA", dataIndex: "naia", width: 80 },
    { title: "JC", dataIndex: "jc", width: 60 },
    { title: "HS", dataIndex: "hs", width: 60 },
    { title: "JH", dataIndex: "jh", width: 60 },
  ];

  // Note: ranking report
  return (
    <div className="w-full rounded-2xl border border-border p-5">
      <h1 className="text-xl font-medium mb-5">Complete Rankings</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Input
          placeholder="Search referee..."
          allowClear
          className="w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          placeholder="Filter by level"
          allowClear
          className="w-52"
          value={level}
          onChange={setLevel}
          style={{ border: "1px solid #e8e8e8", borderRadius: "5px", padding: "10px" }}
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
          className="w-52"
          value={minScore}
          onChange={setMinScore}
          style={{ border: "1px solid #e8e8e8", borderRadius: "5px", padding: "10px" }}
        >
          {[5, 6, 7, 8, 9].map((score) => (
            <Option key={score} value={score}>
              {score}+
            </Option>
          ))}
        </Select>

        <Button
          icon={<ReloadOutlined />}
          onClick={handleResetFilters}
        >
          Reset
        </Button>
      </div>


      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ x: 1300 }}
        />
      </ConfigProvider>
    </div>
  );
}
