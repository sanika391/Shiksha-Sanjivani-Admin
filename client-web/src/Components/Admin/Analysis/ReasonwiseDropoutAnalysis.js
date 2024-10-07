import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ReasonwiseDropoutAnalysis = ({
  selectedCity,
  selectedTaluka,
  selectedDistrict,
  selectedState,
  standard,
}) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Capacity",
        data: [30, 40, 35, 50],
      },
      {
        name: "Enroll Athelte",
        data: [49, 60, 10, 12],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -10,
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          colors: ["#000"],
        },
        formatter: function (val) {
          return val + "%"; // Append "%" to the label
        },
      },
      xaxis: {
        categories: ["Cricket", "Basket Ball", "Volly Ball", "Tennis"],
      },
      yaxis: {
        title: {
          text: "Percentage of Dropout students",
          style: {
            fontSize: "12px",
            // fontWeight: "bold",
            fontFamily: undefined,
            color: "#263238",
          }, // Your Y-axis title
        },
      },
      colors: ["#3498db", "#5dade2", "#85c1e9"],
      title: {
        text: "Reason wise Dropout Analysis",
        align: "center",
        margin: 50,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "26px",
          fontWeight: "bold",
          fontFamily: undefined,
          color: "#263238",
        },
      },
      fill: {
        opacity: 1,
      },
    },
  });

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://shiksha-sanjivani-admin.onrender.com/FilterStudentinGroupByTwo?state=${selectedState}&district=${selectedDistrict}&city=${selectedCity}&taluka=${selectedTaluka}&school&type1=Reasons&type2=null&standard=`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const data = result.data.StudentsData;
        console.log(data);
        const categories = data
          .filter(
            (s) =>
              s.Reasons !== undefined && s.Reasons !== null && s.Reasons !== ""
          )
          .map((s) => s.Reasons);

        // const student = data
        //   .filter(
        //     (s) =>
        //       s.Reasons !== undefined && s.Reasons !== null && s.Reasons !== ""
        //   )
        //   .map((s) => s.numOfStudent);
        let total = 0;
        data.map((s) => {
          total += s.numOfStudent;
        });
        const student = data
          .filter(
            (s) =>
              s.Reasons !== undefined && s.Reasons !== null && s.Reasons !== ""
          )
          .map((s) => ((s.numOfStudent / total) * 100).toFixed(2));

        setChartData({
          ...chartData,
          series: [
            {
              name: "Reason",
              data: student,
            },
          ],
          options: {
            ...chartData.options,
            xaxis: {
              ...chartData.options.xaxis,
              categories: categories,
            },
          },
        });
      })
      .catch((error) => console.log("error", error));
  }, [selectedCity, selectedDistrict, selectedState, selectedTaluka, standard]);

  return (
    <div className="chart m-8">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={chartData.options.chart.height}
      />
    </div>
  );
};

export default ReasonwiseDropoutAnalysis;
