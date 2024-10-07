import { redirect } from "react-router-dom";

const LoginVerify = async () => {
  const token = localStorage.getItem("token");
  if (token === null) {
    return null;
  } else {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      token: token,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const response = await fetch(
      "https://shiksha-sanjivani-admin.onrender.com/verify",
      requestOptions
    );
    const result = await response.json();
    console.log(result);
    if (result.rcode === 200) {
      if (result.data.Role === 0) {
        return redirect("/admin");
      } else if (result.data.Role === 1) {
        return redirect("/authority");
      } else if (result.data.Role === 5) {
        return redirect("/school");
      } else {
        return redirect("/");
      }
    } else {
      localStorage.removeItem("token");
      return redirect("/");
    }
  }
};

export default LoginVerify;
