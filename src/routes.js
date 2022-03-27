import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { Container } from "@mui/material";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Transfers from "./components/Transfers";
import { useSelector } from "react-redux";
import Spinner from "./helpers/Spinner";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { UserIsAuthenticated, UserIsNotAuthenticated } from "./auth";

const AuthIsLoaded = ({ children }) => {
  const profile = useSelector(({ firebase: { profile } }) => profile);

  if (isLoaded(profile) && isEmpty(profile)) return children;

  if (isLoaded(profile) && !isEmpty(profile)) return children;

  return <Spinner />;
};

const RoutesComponent = () => {
  return (
    <Router>
      <AuthIsLoaded>
        <Navbar />
        <Container maxWidth={"xl"}>
          <Routes>
            <Route exact path={"/"} element={<Home />} />
            <Route exact path="/login" element={<UserIsNotAuthenticated />}>
              <Route exact path="/login" element={<Login />} />
            </Route>
            <Route exact path="/transfers" element={<UserIsAuthenticated />}>
              <Route exact path={"/transfers"} element={<Transfers />} />
            </Route>
            <Route exact path={"*"} element={<NotFound />} />
          </Routes>
        </Container>
        <Footer />
      </AuthIsLoaded>
    </Router>
  );
};

export default RoutesComponent;
