import {Route, Routes} from "react-router-dom";
import {HomePage} from "../pages/HomePage";
import {CacaPage} from "../pages/caca";
import React from "react";
import {DecisionPage} from "../pages/DecisionPage";
import {NewAccountPage} from "../pages/NewAccountPage";
import {MyProfilePage} from "../pages/MyProfilePage";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route index path={'/'} element={<DecisionPage/>}></Route>
            <Route path={'/home'} element={<HomePage/>} >
                <Route index path={'caca'} element={<CacaPage/>}></Route>
                <Route element={<p>Pisu</p>}></Route>
                <Route path={'myProfile'} element={<MyProfilePage/>}></Route>
            </Route>
            <Route path="/newAccount" element={<NewAccountPage/>}/>
        </Routes>
    );
}