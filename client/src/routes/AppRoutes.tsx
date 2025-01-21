import {Route, Routes} from "react-router-dom";
import React from "react";
import {MyProfilePage, NewAccountPage, DecisionPage, HomePage, FeedPage } from "../pages";
import {useLoader} from "../contexts/LoaderContext";
import {Spinner} from "@heroui/react";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route index path={'/'} element={<DecisionPage/>}></Route>
            <Route path={'/home'} element={<HomePage/>} >
                <Route index path={''} element={<FeedPage/>}></Route>
                <Route element={<p>Pisu</p>}></Route>
                <Route path={'myProfile'} element={<MyProfilePage/>}></Route>
            </Route>
            <Route path="/newAccount" element={<NewAccountPage/>}/>
        </Routes>
    );
}