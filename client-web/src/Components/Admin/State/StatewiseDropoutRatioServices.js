export const StatewiseDropoutAnalysisServices = {
  getData() {
    return fetch("https://shiksha-sanjivani-admin.onrender.com/statewiseDropout")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        return res.data;
      });
  },

  getCustomersSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  },

  getCustomersMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  },

  getCustomersLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  },

  getCustomersXLarge() {
    return Promise.resolve(this.getData());
  },
};
