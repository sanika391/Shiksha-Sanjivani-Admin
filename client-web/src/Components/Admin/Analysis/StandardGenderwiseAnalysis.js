import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const StandardGenderwiseAnalysis = ({
  selectedCity,
  selectedTaluka,
  selectedDistrict,
  selectedState,
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
        text: "Standard wise Dropout Analysis",
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
      `https://shiksha-sanjivani-admin.onrender.com/FilterStudentinGroupByTwo?state=${selectedState}&district=${selectedDistrict}&city=${selectedCity}&taluka=${selectedTaluka}&school&type1=Standard&type2=Gender`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const data = result.data.StudentsData;
        const standardWiseCounts = data.reduce((result, item) => {
          const standard = item.Standard;
          const gender = item.Gender || "Unknown";

          result[standard] = result[standard] || {
            standard,
            genderCounts: { other: 0, male: 0, female: 0 },
          };
          result[standard].genderCounts[gender] =
            (result[standard].genderCounts[gender] || 0) + item.numOfStudent;

          return result;
        }, {});

        // Convert the grouped data object into an array
        const resultArray = Object.values(standardWiseCounts);
        console.log(resultArray);

        const female = resultArray.map((s) => s.genderCounts.female);
        const male = resultArray.map((s) => s.genderCounts.other);
        const other = resultArray.map((s) => s.genderCounts.other);
        const categories = resultArray.map((s) => "Standard " + s.standard);
        const total = resultArray.map(
          (s) =>
            s.genderCounts.other + s.genderCounts.male + s.genderCounts.female
        );
        // const student = data.map((s) =>
        //   ((s.numOfStudent / total) * 100).toFixed(2)
        // );

        setChartData({
          ...chartData,
          series: [
            {
              name: "Female",
              data: female,
            },
            {
              name: "Male",
              data: male,
            },
            {
              name: "Other",
              data: other,
            },
            {
              name: "Total",
              data: total,
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
  }, [selectedCity, selectedDistrict, selectedState, selectedTaluka]);

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

export default StandardGenderwiseAnalysis;
