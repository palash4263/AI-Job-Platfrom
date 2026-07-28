import axios from "axios";

export const uploadResume = async (file, location) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("location", location);

  const response = await axios.post(
    "http://localhost:8081/api/resume/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};