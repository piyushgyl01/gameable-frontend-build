import { useState, useEffect } from "react";
// const useFetch = (url, initialData) => {
//   const [data, setData] = useState(initialData);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     setLoading(true);
//     fetch(url)
//       .then((res) => res.json())
//       .then((data) => {
//         setData(data);
//       })
//       .catch((error) => setError(error.message))
//       .finally(() => setLoading(false));
//   }, [url]);
//   return { data, loading, error };
// };
// export default useFetch;
// in useFetch.js
const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, error, loading, refetch: fetchData };
};

export default useFetch;
