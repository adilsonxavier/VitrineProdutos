import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"
import Home from "./components/pages/Home";
import Company from "./components/pages/Company";
import Container from "./components/layout/Container";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Login from "./components/pages/login";
import Fotos from "./components/pages/fotos";
import ProdutosAdmin2 from "./components/pages/ProdutosAdmin2";
import ProdutoForm from "./components/pages/ProdutoForm";

import ContextProvider from "./components/Contexts/Context1";

export default function App() {
    return (
        <Router >

            <ContextProvider>
                <Header />

                <Container >
                    <Switch>

                        <Route exact path="/">
                            <Home />
                        </Route>

                        <Route path="/company">
                            <Company />
                        </Route>

                        <Route path="/login">
                            <Login />
                        </Route>

                        <Route path="/produtoForm/:id">
                            <ProdutoForm />
                        </Route>

                        <Route path="/fotos/:id">
                            <Fotos />
                        </Route>

                        <Route path="/produtosAdmin">
                            <ProdutosAdmin2 />
                        </Route>

                    </Switch>

                </Container>
                <Footer />
            </ContextProvider>
        </Router>

    );
}