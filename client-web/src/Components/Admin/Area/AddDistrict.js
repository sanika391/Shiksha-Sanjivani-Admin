import React, { useEffect, useState } from "react";
import FetchState from "../../../API/FetchState";

const AddDistrict = () => {
  const [stateName, setStateName] = useState([]);
  const [selectedState, setSelectedState] = useState(""); // new state for selected state
  const [districtName, setDistrictName] = useState("");

  useEffect(() => {
    FetchState().then((res) => {
      setStateName(res);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        state: selectedState,
        district: districtName,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:9999/addDistricts",
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      if (result.rcode === 200) {
        console.log("District added successfully");
        setSelectedState("");
        setDistrictName("");
      } else {
        console.error("Failed to add district");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-[#f8f9fa] m-5 h-screen">
    <div className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded shadow-md shadow-gray-600">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add District</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="font-bold text-md text-gray-500">Select State</span>
          <select
            className="mt-1 p-2 w-full border rounded-md outline-2 focus:outline-gray-300"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            required
          >
            <option value="">Select State</option>
            {stateName.map((item, index) => (
              <option key={index} value={item._id}>
                {item.name}
              </option>
            ))}
            {/* Add more states as needed */}
          </select>
        </label>
        <label className="block mb-4">
          <span className="font-bold text-md text-gray-500">District Name</span>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md outline-2 focus:outline-gray-300"
            value={districtName}
            onChange={(e) => setDistrictName(e.target.value)}
            required
          />
        </label>
        <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-4 my-3 rounded-md font-semibold hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue"
        >
          Add District
        </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddDistrict;
