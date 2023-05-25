import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import SearchPage from "./pages/SearchPage";

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
