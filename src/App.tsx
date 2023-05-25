import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import SearchPage from "./components/SearchPage";
import AppContext from "./AppContext";

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const sharedData = {
    theme: "dark",
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
  };

  return (
    <AppContext.Provider value={sharedData.theme}>
      <Routes>
        <Route
          path="/"
          element={<LoginScreen setAuthenticated={setAuthenticated} />}
        />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </AppContext.Provider>
  );
};

export default App;
