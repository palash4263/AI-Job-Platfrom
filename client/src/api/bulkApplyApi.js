import axios from "axios";

export const bulkApply =
  async (jobs) => {

    const response =
      await axios.post(
        "http://localhost:8081/api/jobs/bulk-apply",
        jobs
      );

    return response.data;
};