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

// react-router-dom components
import {Link, useNavigate} from "react-router-dom";
import $ from 'jquery';

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import {useState} from "react";
import {setLogin, useUserController} from "../../../context/user";

function Cover() {
    const [loginUsername, setLoginUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [UserController, dispatchUser] = useUserController();

    const navigate = useNavigate();

    const handleClick = () => {
        if (loginUsername === "") {
            setErrorMessage("用户名不能为空");
        } else if (password === "") {
            setErrorMessage("密码不能为空");
        } else if (passwordConfirm === "") {
            setErrorMessage("确认密码不能为空");
        } else if (password !== passwordConfirm) {
            setErrorMessage("两次输入密码不一致");
        } else {
            $.ajax({
                url: "http://localhost:8000/settings/register/",
                type: "post",
                data: {
                    username: loginUsername,
                    password: password,
                    password_confirm: passwordConfirm,
                },
                dataType: "json",
                success: resp => {
                    if (resp.result === "success") {
                        setLogin(dispatchUser, true);
                        navigate("/dashboard");
                    } else {
                        setErrorMessage(resp.result);
                    }

                }
            });
        }
    }


    return (
        <CoverLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="success"
                    mx={2}
                    mt={-3}
                    p={3}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        注册
                    </MDTypography>
                    <MDTypography display="block" variant="button" color="white" my={1}>
                        欢迎加入我们👏
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput type="email" onChange={e => setLoginUsername(e.target.value)} label="邮箱"
                                     variant="standard" fullWidth/>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="password" onChange={e => setPassword(e.target.value)} label="密码"
                                     variant="standard" fullWidth/>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="password" onChange={e => setPasswordConfirm(e.target.value)} label="确认密码"
                                     variant="standard" fullWidth/>
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
                        <MDBox mt={4} mb={1}>
                            <MDButton onClick={handleClick} variant="gradient" color="info" fullWidth>
                                注册
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                已经有账号了？{" "}
                                <MDTypography
                                    component={Link}
                                    to="/authentication/sign-in"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    登录
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </CoverLayout>
    );
}

export default Cover;
