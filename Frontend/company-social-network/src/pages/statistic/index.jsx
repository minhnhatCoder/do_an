import React, { useEffect, useState } from "react";
import { Date, Month } from "../../components/input";
import SelectDepartment from "../../components/Select/department";
import dayjs from "dayjs";
import { useRootState } from "../../store";
import {
  convertTimeStampToString,
  getCurrentTimeStamp,
  getMonthOfTimeStamp,
  getYearOfTimeStamp,
} from "../../helper/timeHelper";
import { VerticalBarChart } from "../../components/chart/Vertical";
import { Avatar, Drawer, Rate, Spin, Table, Tag } from "antd";
import TaskServices from "../../services/tasksServices";
import { LineChart } from "../../components/chart/Line";

const Statistic = () => {
  const userInfo = useRootState((state) => state.userInfo);
  const [loading, setLoading] = useState();
  const depts = useRootState((state) => state.depts);
  const [filter, setFilter] = useState({
    month: 1,
    year: 2021,
    dept_id: null,
  });
  const [dataChart, setDataChart] = useState();
  const [dataTable, setDataTable] = useState([]);
  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState([]);

  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "user",
      width: 200,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Avatar src={value?.image} size="large" />
          <p className="font-semibold">{value?.display_name}</p>
        </div>
      ),
    },
    {
      title: "Tổng số công việc",
      dataIndex: "task_total",
      width: 200,
      render: (value, data) => {
        return (
          <p
            className="font-bold  text-right hover:text-orange-500 cursor-pointer"
            onClick={() => {
              setShow(true);
              setTasks(data?.tasks).map((task) => ({
                key: task?._id,
                title: task?.title,
                reciever: task.reciever,
                time:
                  convertTimeStampToString(task.start_date, "right") +
                  " - " +
                  convertTimeStampToString(task.end_date, "right"),
                priority: task.priority,
                status: task.status,
                star: task?.star,
              }));
            }}
          >
            {data?.task_cancel + data?.task_complete + data?.task_doing + data?.task_todo}
          </p>
        );
      },
    },
    {
      title: "Số công việc cần làm",
      dataIndex: "task_todo",
      width: 200,
      render: (value, data) => (
        <p
          className="font-bold text-gray-500 text-right hover:text-orange-500 cursor-pointer"
          onClick={() => {
            setTasks(
              data?.tasks
                ?.filter((t) => t?.status == 1)
                .map((task) => ({
                  key: task?._id,
                  title: task?.title,
                  reciever: task.reciever,
                  time:
                    convertTimeStampToString(task.start_date, "right") +
                    " - " +
                    convertTimeStampToString(task.end_date, "right"),
                  priority: task.priority,
                  status: task.status,
                  star: task?.star,
                }))
            );
            setShow(true);
          }}
        >
          {value}
        </p>
      ),
    },
    {
      title: "Số công việc đang làm",
      dataIndex: "task_doing",
      width: 200,
      render: (value, data) => (
        <p
          className="font-bold text-blue-500 text-right hover:text-orange-500 cursor-pointer"
          onClick={() => {
            setTasks(
              data?.tasks
                ?.filter((t) => t?.status == 2)
                .map((task) => ({
                  key: task?._id,
                  title: task?.title,
                  reciever: task.reciever,
                  time:
                    convertTimeStampToString(task.start_date, "right") +
                    " - " +
                    convertTimeStampToString(task.end_date, "right"),
                  priority: task.priority,
                  status: task.status,
                  star: task?.star,
                }))
            );
            setShow(true);
          }}
        >
          {value}
        </p>
      ),
    },
    {
      title: "Số công việc đã hoàn thành",
      dataIndex: "task_complete",
      width: 200,
      render: (value, data) => (
        <p
          className="font-bold text-green-500 text-right hover:text-orange-500 cursor-pointer"
          onClick={() => {
            setTasks(
              data?.tasks
                ?.filter((t) => t?.status == 3)
                .map((task) => ({
                  key: task?._id,
                  title: task?.title,
                  reciever: task.reciever,
                  time:
                    convertTimeStampToString(task.start_date, "right") +
                    " - " +
                    convertTimeStampToString(task.end_date, "right"),
                  priority: task.priority,
                  status: task.status,
                  star: task?.star,
                }))
            );
            setShow(true);
          }}
        >
          {value}
        </p>
      ),
    },
    {
      title: "Số công việc đã hủy",
      dataIndex: "task_cancel",
      width: 200,
      render: (value, data) => (
        <p
          className="font-bold text-red-500 text-right hover:text-orange-500 cursor-pointer"
          onClick={() => {
            setTasks(
              data?.tasks
                ?.filter((t) => t?.status == 4)
                .map((task) => ({
                  key: task?._id,
                  title: task?.title,
                  reciever: task.reciever,
                  time:
                    convertTimeStampToString(task.start_date, "right") +
                    " - " +
                    convertTimeStampToString(task.end_date, "right"),
                  priority: task.priority,
                  status: task.status,
                  star: task?.star,
                }))
            );
            setShow(true);
          }}
        >
          {value}
        </p>
      ),
    },
  ];

  const getTaskStatistic = async () => {
    try {
      setLoading(true);
      const params = {
        start_date: dayjs(`${filter?.month}-${filter?.year}`, "M-YYYY").startOf("month").valueOf() / 1000,
        end_date: dayjs(`${filter?.month}-${filter?.year}`, "M-YYYY").endOf("month").valueOf() / 1000,
        dept_id: filter?.dept_id,
      };
      const res = await TaskServices.getStatistic(params);
      const labels = res?.data?.map((i) => i?.user?.display_name);
      const chart_data = {
        labels,
        datasets: [
          {
            label: "Cần làm",
            data: res?.data?.map((i) => i?.task_todo),
            backgroundColor: "#AEC3AE",
          },
          {
            label: "Đang làm",
            data: res?.data?.map((i) => i?.task_doing),
            backgroundColor: "#AED2FF",
          },
          {
            label: "Hoàn thành",
            data: res?.data?.map((i) => i?.task_complete),
            backgroundColor: "#A6FF96",
          },
          {
            label: "Đã hủy",
            data: res?.data?.map((i) => i?.task_cancel),
            backgroundColor: "#C63D2F",
          },
        ],
      };
      setDataChart(chart_data);
      setDataTable(res?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFilter({
      month: getMonthOfTimeStamp(getCurrentTimeStamp()) - 1,
      year: getYearOfTimeStamp(getCurrentTimeStamp() / 1000),
      dept_id: userInfo?.department?._id,
    });
  }, []);

  useEffect(() => {
    getTaskStatistic();
  }, [filter]);

  return (
    <div className="main-content h-full">
      <div className="overflow-y-auto h-full bg-white rounded-lg">
        <div className="p-3 border-b pb-6">
          <div className="flex gap-2">
            <SelectDepartment
              menuPlacement={"bottom"}
              title="Phòng ban"
              className="w-72"
              value={filter?.dept_id}
              onChange={(e) => {
                setFilter({ ...filter, dept_id: e?.value });
              }}
            />
            <Month
              title={"Tháng"}
              className="w-72"
              format="M-YYYY"
              value={dayjs(`${filter?.month}-${filter?.year}`, "M-YYYY").startOf("month")}
              onChange={(date) => {
                setFilter({ ...filter, month: dayjs(date).month() + 1, year: dayjs(date).year() });
              }}
            />
          </div>
        </div>
        <Spin spinning={loading}>
          {/* <div className="w-[1500px] h-[400px] mx-auto">
            <VerticalBarChart
              data={dataChart}
              title={`Thống kê công việc phòng ban ${depts?.find((d) => d?._id == filter?.dept_id)?.name} tháng ${
                filter?.month
              } năm ${filter?.year}`}
            />
          </div> */}
          <div className="w-full p-3">
            <p className="font-bold text-2xl mb-10 text-center text-neutral-500">{`Bảng thống kê công việc phòng ban ${
              depts?.find((d) => d?._id == filter?.dept_id)?.name
            } tháng ${filter?.month} năm ${filter?.year}`}</p>
            <Table
              columns={columns}
              dataSource={dataTable}
              pagination={false}
              scroll={{
                y: 600,
              }}
            />
          </div>
        </Spin>
        <DarawerTask tasks={tasks} show={show} setShow={setShow} />
      </div>
    </div>
  );
};

export default Statistic;

const DarawerTask = ({ tasks, show, setShow }) => {
  console.log(tasks);
  return (
    <Drawer
      title="Danh sách công việc"
      placement="right"
      width={1500}
      onClose={() => {
        setShow(false);
      }}
      open={show}
    >
      <Table
        columns={[
          {
            title: "Công việc",
            dataIndex: "title",
            key: "title",
          },
          {
            title: "Người thực hiện",
            dataIndex: "receiver",
            key: "receiver",
            render: (value, { reciever }) => {
              return (
                <div className="flex items-center gap-2">
                  <Avatar src={reciever?.image} size="large" />
                  <p className="font-semibold">{reciever?.display_name}</p>
                </div>
              );
            },
          },
          {
            title: "Thời hạn",
            dataIndex: "time",
            key: "time",
          },
          {
            title: "Ưu tiên",
            key: "priority",
            dataIndex: "priority",
            width: 100,
            render: (priority) => {
              switch (priority) {
                case 1:
                  return <Tag color="red">Cao</Tag>;
                case 2:
                  return <Tag color="orange">Trung bình</Tag>;
                case 3:
                  return <Tag color="blue">Thấp</Tag>;
                case 4:
                  return <Tag color="gray">Không ưu tiên</Tag>;

                default:
                  return <Tag color="red">Cao</Tag>;
              }
            },
          },
          {
            title: "Đánh giá",
            key: "star",
            dataIndex: "star",
            render: (value) => {
              return <Rate disabled defaultValue={value} />;
            },
          },
        ]}
        dataSource={tasks}
        pagination={false}
        scroll={{
          y: 600,
        }}
      />
    </Drawer>
  );
};
