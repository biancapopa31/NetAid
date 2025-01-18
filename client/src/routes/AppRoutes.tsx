import {Route, Routes} from "react-router-dom";
import {HomePage} from "../pages/HomePage";
import {CacaPage} from "../pages/caca";
import React from "react";
import {DecisionPage} from "../pages/DecisionPage";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route index path={'/'} element={<DecisionPage/>}></Route>
            <Route path={'/home'} element={<HomePage/>} >
                <Route path={'caca'} element={<CacaPage/>}></Route>
                <Route index element={<p>Pisu</p>}></Route>
            </Route>
            <Route path="/newAccount" element={<p>New Account</p>}/>
        </Routes>
    );
}