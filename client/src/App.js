
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from 'semantic-ui-react';


import 'semantic-ui-css/semantic.min.css';
import './App.css';
import {  AuthProvider } from "./context/auth";
import AuthRouth from "./utils/authRouth";

//pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";

//components
import Menubar from "./components/Menubar";

function App() {
  return (
    <AuthProvider >
      <Router>
        <Container>
          <Menubar />
          <Route exact path="/" component={Home} />
          <AuthRouth exact path="/login" component={Login} />
          <AuthRouth exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
