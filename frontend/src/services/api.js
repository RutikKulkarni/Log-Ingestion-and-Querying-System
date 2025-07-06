const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchLogs = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/logs${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

export const fetchSampleLogs = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/logs/sample${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sample logs:", error);
    throw error;
  }
};

export const ingestLog = async (logData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error ingesting log:", error);
    throw error;
  }
};

export default API_BASE_URL;
