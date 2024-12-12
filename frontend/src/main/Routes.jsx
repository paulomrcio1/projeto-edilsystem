/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from '../components/home/Home'
import UserCrud from '../components/user/UserCrud' 
import ListCrud from '../components/user/ListCrud'
import EditCrud from '../components/user/EditCrud'

export default props =>(
    <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route path="/users" element={<UserCrud />}></Route>
        <Route path="/edit" element={<EditCrud />}></Route>
        <Route path="*" element={<ListCrud />}></Route>
    </Routes>
);