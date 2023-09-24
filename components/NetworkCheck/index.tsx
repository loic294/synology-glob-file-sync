import axios from "axios";
import React, { useEffect, useState } from "react";

export function NetworkCheck() {
  const [networkIssue, setNetworkIssue] = useState(false);

  const checkNetwork = async () => {
    try {
      const response = await axios.get("/api/isProxyActive");
      console.log("NETWORK CHECK", response.data, response.data.isProxyActive);
      setNetworkIssue(!response.data.isProxyActive);
    } catch (e) {
      setNetworkIssue(true);
    }
  };

  useEffect(() => {
    checkNetwork();
    setInterval(checkNetwork, 5000);
  }, []);

  const installProxy = async () => {
    axios.post("/api/installProxy");
  };

  if (!networkIssue) {
    return null;
  }

  return (
    <div className="alert alert-warning">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>
        The local proxy isn't working. Please enable it so the files can be
        moved between folders.
      </span>
      <button className="btn btn-sm btn-outline" onClick={installProxy}>
        Install Proxy
      </button>
    </div>
  );
}
