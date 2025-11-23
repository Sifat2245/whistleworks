import { Table, ConfigProvider, theme, Avatar } from "antd";
import profile from "@/assets/dashboard/profile.png";
import badge from "@/assets/svg/badge.svg";
import Icon from "@/components/common/Icon";

export default function RankingReportTable() {
  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      width: 100,
      render: (rank) => (
        <div className="flex items-center space-x-2 font-semibold">
          {<Icon src={badge} className="size-6" />}
          <span className="text-[14px]">#{rank}</span>
        </div>
      ),
    },
    {
      title: "Referee",
      dataIndex: "name",
      key: "name",
      width: 180,
      render: (_, record) => (
        <div className="flex items-center space-x-3!">
          <Avatar src={record.avatarUrl} size="large" />
          <span className="text-[14px]">{record.name}</span>
        </div>
      ),
    },
    {
      title: "Overall",
      dataIndex: "overall",
      key: "overall",
      width: 100,
      sorter: (a, b) => a.overall - b.overall,
      render: (text) => (
        <span className="font-semibold text-[14px] text-green-700">{text}</span>
      ),
    },
    {
      title: "Call Accur.",
      dataIndex: "callAccur",
      key: "callAccur",
      width: 120,
      sorter: (a, b) => a.callAccur - b.callAccur,
    },
    {
      title: "Mech",
      dataIndex: "mech",
      key: "mech",
      width: 80,
    },
    {
      title: "Fit/Mob",
      dataIndex: "fitMob",
      key: "fitMob",
      width: 100,
    },
    {
      title: "Comm",
      dataIndex: "comm",
      key: "comm",
      width: 80,
    },
    {
      title: "Consistency",
      dataIndex: "consistency",
      key: "consistency",
      width: 120,
    },
    // Technical Metrics
    {
      title: "G/A",
      dataIndex: "gA",
      key: "gA",
      width: 80,
    },
    {
      title: "DI",
      dataIndex: "d1",
      key: "d1",
      width: 60,
    },
    {
      title: "D2",
      dataIndex: "d2",
      key: "d2",
      width: 60,
    },
    {
      title: "NAIA",
      dataIndex: "naia",
      key: "naia",
      width: 80,
    },
    {
      title: "JC",
      dataIndex: "jc",
      key: "jc",
      width: 60,
    },
    {
      title: "HS",
      dataIndex: "hs",
      key: "hs",
      width: 60,
    },
    {
      title: "JH",
      dataIndex: "jh",
      key: "jh",
      width: 60,
    },
  ];

  const customTheme = {
    token: {
      colorPrimary: "#14b8a6", // Tailwind cyan-500
      colorSuccess: "#10b981", // Tailwind emerald-500
      colorBgContainer: "#ffffff",
      borderRadius: 8,
    },
    components: {
      Table: {
        headerBg: "#f8fafc", // Tailwind slate-50 for header background
        headerColor: "#1e293b",
        headerBorderRadius: 8,
        borderColor: "#e2e8f0",
        rowHoverBg: "#00aeef1a", // Light cyan hover effect
        cellPaddingBlock: 12,
        cellPaddingInline: 16,
      },
    },
  };

  return (
    <div className="w-full rounded-2xl border  border-border p-5">
      <style>
        {`
          .ant-table-wrapper .ant-table-tbody > tr > td {
            border-bottom: none !important;
            
          }
        `}
      </style>
      {/* Title */}
      <h1 className="text-xl font-medium mb-7">Complete Rankings</h1>

      <ConfigProvider
        theme={{ algorithm: theme.defaultAlgorithm, ...customTheme }}
      >
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={refereeData}
            pagination={false}
            bordered={false}
            scroll={{ x: 1300 }}
          />
        </div>
      </ConfigProvider>
    </div>
  );
}

const refereeData = [
  {
    key: "1",
    rank: 1,
    name: "Emily Chen",
    avatarUrl: profile,
    overall: 9.8,
    callAccur: 9.2,
    mech: 8.5,
    fitMob: 9.5,
    comm: 9.3,
    consistency: 9.5,
    gA: 8.8,
    d1: 5,
    d2: 4,
    naia: 8,
    jc: 7,
    hs: 6,
    jh: 3,
  },
  {
    key: "2",
    rank: 2,
    name: "Javier Lopez",
    avatarUrl: profile,
    overall: 9.6,
    callAccur: 9.0,
    mech: 8.7,
    fitMob: 9.0,
    comm: 9.1,
    consistency: 9.2,
    gA: 8.6,
    d1: 4,
    d2: 5,
    naia: 7,
    jc: 8,
    hs: 7,
    jh: 4,
  },
  {
    key: "3",
    rank: 3,
    name: "Sarah Miller",
    avatarUrl: profile,
    overall: 9.4,
    callAccur: 8.8,
    mech: 8.2,
    fitMob: 9.1,
    comm: 8.9,
    consistency: 9.0,
    gA: 8.5,
    d1: 3,
    d2: 4,
    naia: 7,
    jc: 6,
    hs: 6,
    jh: 5,
  },
  {
    key: "4",
    rank: 4,
    name: "David Kim",
    avatarUrl: profile,
    overall: 9.2,
    callAccur: 8.5,
    mech: 7.9,
    fitMob: 8.8,
    comm: 8.5,
    consistency: 8.8,
    gA: 8.2,
    d1: 4,
    d2: 3,
    naia: 6,
    jc: 5,
    hs: 5,
    jh: 4,
  },
  {
    key: "5",
    rank: 5,
    name: "Maria Rossi",
    avatarUrl: profile,
    overall: 9.1,
    callAccur: 8.6,
    mech: 8.0,
    fitMob: 8.5,
    comm: 8.7,
    consistency: 8.9,
    gA: 8.3,
    d1: 5,
    d2: 4,
    naia: 5,
    jc: 6,
    hs: 7,
    jh: 3,
  },
];
