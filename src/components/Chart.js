import React, { Fragment } from "react";
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

const ChartComponent = React.memo(({ channel }) => {
  const data = [];
  if (channel) {
    channel?.map((channelInfo, index1) => {
      channelInfo?.chartDTO?.map((chart, index2) => {
        const name = channelInfo?.channelName;
        console.log(chart);
        if (index1 === 0) {
          data.push({
            name: chart?.date.split("-").slice(1).join("-"),
            [name + "채널 댓글"]: chart?.commentCount,
            [name + "채널 게시글"]: chart?.postCount,
          });
        } else {
          data[index2] = {
            ...data[index2],
            [name + "채널 댓글"]: chart.commentCount,
            [name + "채널 게시글"]: chart.postCount,
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
            <Fragment key={index1}>
              <Line
                type="linear"
                dataKey={channelInfo.channelName + "채널 게시글"}
                stroke={color[index1]}
                activeDot={{ r: 4 }}
              />
              <Line
                type="linear"
                dataKey={channelInfo.channelName + "채널 댓글"}
                stroke={color[index1]}
                strokeDasharray="2 2 2 2"
              />
            </Fragment>
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  } else {
    return <></>;
  }
});

export default ChartComponent;
