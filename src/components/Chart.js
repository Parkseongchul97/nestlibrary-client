import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  // 날짜가 와야함
  {
    name: "Page A",
    댓글: 1,
    게시글: 5,
  },
  {
    name: "Page B",
    댓글: 10,
    게시글: 18,
  },
  {
    name: "Page C",
    댓글: 10,
    게시글: 50,
  },
  {
    name: "Page D",
    댓글: 30,
    게시글: 14,
  },
  {
    name: "Page E",
    댓글: 80,
    게시글: 60,
  },
  {
    name: "Page F",
    댓글: 1,
    게시글: 4,
  },
  {
    name: "Page G",
    댓글: 0,
    게시글: 0,
  },
];

export default class Example extends PureComponent {
  static demoUrl =
    "https://codesandbox.io/p/sandbox/line-chart-width-xaxis-padding-8v7952";

  render() {
    return (
      <ResponsiveContainer>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="게시글"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="댓글" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
