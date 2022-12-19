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
import $ from "jquery";

import {useState} from "react";

// react-router-dom components
import {Link, useNavigate} from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import {setLogin, setUsername, useUserController} from "../../../context/user";
import {
    getToken,
    removeAdmin,
    removeFresh,
    removeToken,
    setLocalAdmin,
    setRefresh,
    setToken
} from "../../../utils/localtoken";
import jwt_decode from "jwt-decode";

function Basic() {
    const [rememberMe, setRememberMe] = useState(false);
    const [loginUsername, setLoginUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [UserController, dispatchUser] = useUserController();
    const navigate = useNavigate();

    const handleLogin = () => {

        if (loginUsername === "") {
            setErrorMessage("邮箱不能为空");
        } else if (password === "") {
            setErrorMessage("密码不能为空");
        } else {
            console.log(loginUsername);
            $.ajax({
                url: "http://localhost:8000/settings/token/",
                type: "post",
                data: {
                    username: loginUsername,
                    password: password,
                },
                dataType: "json",
                success: resp => {
                    const {access, refresh} = resp;
                    setToken(access);
                    setRefresh(refresh);
                    setLogin(dispatchUser, true);
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
                                navigate("/dashboard");
                            } else {
                                removeToken();
                                removeFresh();
                                removeAdmin();
                                setLogin(dispatchUser, false);
                            }
                        }
                    })
                },
                error: () => {
                    setErrorMessage("账号或密码错误");
                }

            });
        }
    }

    const handleSetRememberMe = () => setRememberMe(!rememberMe);

    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        登录
                    </MDTypography>
                    <Grid container spacing={3} justifyContent="center" sx={{mt: 1, mb: 2}}>
                        <Grid item xs={2}>
                            <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                <FacebookIcon color="inherit"/>
                            </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                            <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                <GitHubIcon color="inherit"/>
                            </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                            <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                <GoogleIcon color="inherit"/>
                            </MDTypography>
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput onChange={e => setLoginUsername(e.target.value)} type="email" label="邮箱"
                                     fullWidth/>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput onChange={e => setPassword(e.target.value)} type="password" label="密码" fullWidth/>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDTypography
                                variant="button"
                                fontWeight="regular"
                                color="warning"
                                sx={{cursor: "pointer", userSelect: "none"}}
                            >
                                {errorMessage}
                            </MDTypography>
                        </MDBox>
                        <MDBox display="flex" alignItems="center" ml={-1}>
                            <Switch checked={rememberMe} onChange={handleSetRememberMe}/>
                            <MDTypography
                                variant="button"
                                fontWeight="regular"
                                color="text"
                                onClick={handleSetRememberMe}
                                sx={{cursor: "pointer", userSelect: "none", ml: -1}}
                            >
                                &nbsp;&nbsp;记住我
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton onClick={handleLogin} variant="gradient" color="info" fullWidth>
                                登录
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                没有账号？{" "}
                                <MDTypography
                                    component={Link}
                                    to="/authentication/sign-up"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    点我注册
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default Basic;
