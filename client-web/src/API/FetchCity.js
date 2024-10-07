const FetchCity = async (state, district, taluka, cityType) => {
  console.log(state, district, taluka);
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const response = await fetch(
    `https://shiksha-sanjivani-admin.onrender.com/getCities?state=${state || null}&district=${
      district || null
    }&taluka=${taluka || null}`,
    requestOptions
  );
  const result = await response.json();
  return result.data || [];
};

export default FetchCity;
