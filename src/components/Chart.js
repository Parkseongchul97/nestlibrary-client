import React from "react";
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

// 데이터

// 함수형 컴포넌트로 변경
const Example = React.memo(({ channel }) => {
  const data = [];
  channel?.map((channelInfo, index1) => {
    channelInfo?.chartDTO?.map((chart, index2) => {
      const name = channelInfo.channelName;
      console.log(chart);
      if (index1 === 0) {
        data.push({
          name: chart.date.split("-").slice(1).join("-"),
          [name + "댓글"]: chart.commentCount,
          [name + "게시글"]: chart.postCount,
        });
      } else {
        data[index2] = {
          ...data[index2],
          [name + "댓글"]: chart.commentCount,
          [name + "게시글"]: chart.postCount,
        };
      }
    });
  });

  console.log(data);
  const color = [["#8884d8"], ["#0884d8"], ["#82ca9d"]];

  return (
    <ResponsiveContainer width="100%" height="100%">
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
        {channel.map((channelInfo, index1) => (
          <>
            <Line
              key={index1 + "-post"} // key는 필수로 추가하는 것이 좋습니다
              type="linear"
              dataKey={channelInfo.channelName + "게시글"}
              stroke={color[index1]}
              activeDot={{ r: 4 }}
            />
            <Line
              key={index1 + "-comment"} // key 추가
              type="linear"
              dataKey={channelInfo.channelName + "댓글"}
              stroke={color[index1]}
              strokeDasharray="2 2 2 2"
            />
          </>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
});

export default Example;
