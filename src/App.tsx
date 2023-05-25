import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import SearchPage from "./components/SearchPage";

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
      <Routes>
        <Route
          path="/"
          element={<LoginScreen setAuthenticated={setAuthenticated} />}
        />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
  );
};

export default App;
