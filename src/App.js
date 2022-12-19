/**
 =========================================================
 * Material Dashboard 2 React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import {useEffect, useState} from "react";

// react-router components
import {Navigate, Route, Routes, useLocation} from "react-router-dom";

// @mui material components
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// RTL plugins
// Material Dashboard 2 React routes
import {routes, userRoutes} from "routes";

// Material Dashboard 2 React contexts
import {setMiniSidenav, setOpenConfigurator, useMaterialUIController} from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

import {setLogin, setUsername, useUserController} from "./context/user";

// Path configuration
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Dashboard from "./layouts/dashboard";
import Tables from "./layouts/tables";
import Profile from "./layouts/profile";

import {getToken, hasAdmin, hasToken, removeAdmin, removeFresh, removeToken, setLocalAdmin} from "./utils/localtoken";
import $ from "jquery";
import jwt_decode from 'jwt-decode';
import CoachTables from "./layouts/tables/coachtable";
import CourseTables from "./layouts/tables/coursetable";
import SelectTables from "./layouts/tables/selecttable";

export default function App() {
    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        direction,
        layout,
        openConfigurator,
        sidenavColor,
        transparentSidenav,
        whiteSidenav,
        darkMode,
    } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const {pathname} = useLocation();
    const [UserController, dispatchUser] = useUserController();
    const {
        login,
        access,
        refresh,
        admin,
        username
    } = UserController;

    useEffect(() => {
        if (hasToken()) {
            const jwt_token = getToken();
            const access_obj = jwt_decode(jwt_token);
            $.ajax({
                'url': "http://localhost:8000/settings/getinfo/",
                type: "get",
                headers: {
                    'Authorization': "Bearer " + jwt_token,
                },
                data: {
                    user_id: access_obj.user_id,
                },
                success: resp => {
                    console.log(resp);
                    if (resp.result === "success") {
                        setLogin(dispatchUser, true);
                        setUsername(dispatchUser, resp.id);
                        if (resp.is_admin === true) setLocalAdmin(true);
                    } else {
                        removeToken();
                        removeFresh();
                        removeAdmin();
                        setLogin(dispatchUser, false);
                    }
                }
            })
        }
    }, [])

    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

    // Change the openConfigurator state
    const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

    // Setting the dir attribute for the body element
    useEffect(() => {
        document.body.setAttribute("dir", direction);
    }, [direction]);

    // Setting page scroll to 0 when changing the route
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [pathname]);

    const getRoutes = (allRoutes) =>
        allRoutes.map((route) => {
            if (route.collapse) {
                return getRoutes(route.collapse);
            }

            if (route.route) {
                return <Route exact path={route.route} element={route.component} key={route.key}/>;
            }

            return null;
        });

    const configsButton = (
        <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3.25rem"
            height="3.25rem"
            bgColor="white"
            shadow="sm"
            borderRadius="50%"
            position="fixed"
            right="2rem"
            bottom="2rem"
            zIndex={99}
            color="dark"
            sx={{cursor: "pointer"}}
            onClick={handleConfiguratorOpen}
        >
            <Icon fontSize="small" color="inherit">
                settings
            </Icon>
        </MDBox>
    );

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <CssBaseline/>
            {hasAdmin() && layout === "dashboard" && (
                <>
                    <Sidenav
                        color={sidenavColor}
                        brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                        brandName="宏德健身房"
                        routes={routes}
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    />
                    <Configurator/>
                    {configsButton}
                </>
            )}
            {!hasAdmin() && layout === "dashboard" && (
                <>
                    <Sidenav
                        color={sidenavColor}
                        brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                        brandName="宏德健身房"
                        routes={userRoutes()}
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    />
                    <Configurator/>
                    {configsButton}
                </>
            )}
            <Routes>
                {/*{getRoutes(routes)}*/}
                <Route path="/dashboard"
                       element={hasToken() ? <Dashboard/> : <Navigate replace to="/authentication/sign-in"/>}/>
                <Route path="/users/:user_id"
                       element={hasToken() ? <Profile/> : <Navigate replace to="/authentication/sign-in"/>}/>
                <Route path="/users"
                       element={hasToken() ? <Tables/> : <Navigate replace to="/authentication/sign-in"/>}/>
                <Route path="/coaches"
                       element={hasToken() ? <CoachTables/> :
                           <Navigate replace to="/authentication/sign-in"/>}/>
                <Route path="/courses"
                       element={hasToken() ? <CourseTables/> :
                           <Navigate replace to="/authentication/sign-in"/>}/>
                <Route path="/select"
                       element={hasToken() ? <SelectTables/> :
                           <Navigate replace to="/authentication/sign-in"/>}/>
                <Route path="/authentication/sign-in"
                       element={hasToken() ? <Navigate replace to="/dashboard"/> : <SignIn/>}/>
                <Route path="/authentication/sign-up"
                       element={hasToken() ? <Navigate replace to="/dashboard"/> : <SignUp/>}/>
                <Route path="/*" element={<Navigate replace to="/authentication/sign-in"/>}/>
            </Routes>
        </ThemeProvider>
    );
}
