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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";

// Data
// Images
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getToken, hasToken} from "../../utils/localtoken";
import BalanceCard from "./components/balance";
import DataTable from "../../examples/Tables/DataTable";

function Overview() {
    const {user_id} = useParams();
    const [rows, setRows] = useState([])
    const [userData, setUserData] = useState({})
    const columns = [
        {Header: "课程名称", accessor: "name", width: "35%", align: "left"},
        {Header: "开始时间", accessor: "time", align: "center"},
        {Header: "持续时间(h)", accessor: "duration", align: "center"},
        {Header: "教练", accessor: "coach", align: "center"},
        {Header: "操作", accessor: "action", align: "center"}
    ]

    useEffect(() => {
        updateCourseList();
        if (hasToken()) {
            const jwt_token = getToken();
            fetch("http://localhost:8000/sysuser/" + user_id + "/", {
                headers: {
                    'Authorization': "Bearer " + jwt_token,
                }
            }).then(res => res.json())
                .then(data => {
                    setUserData(data.data);
                })
        }
    }, [])

    const handleDelete = (course, sys_user, coach) => {
        if (hasToken()) {
            const data = {
                course: course,
                sys_user: sys_user,
                coach: coach
            }
            const jwt_token = getToken();
            fetch("http://localhost:8000/courseorder/" + username + "/", {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer " + jwt_token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(res => updateCourseList())
        }
    }

    const updateCourseList = () => {
        fetch("http://localhost:8000/courseorder/list/" + user_id + "/")
            .then((res) => res.json())
            .then((data) => {
                if (data.result === "success") {
                    const temp_row = []
                    data.data.forEach((course) => {
                        const startTime = new Date(course.course_begin);
                        if (course.is_selected) {
                            temp_row.push({
                                name: course.course_name,
                                time: startTime.toLocaleString('chinese', {hour12: false}),
                                duration: course.course_last,
                                coach: course.coach_name,
                                action: (<MDTypography
                                        onClick={() => handleDelete(course.id, username, course.coach)}
                                        variant="caption"
                                        color="error"
                                        fontWeight="medium"
                                        sx={{cursor: "pointer"}}>
                                        退选
                                    </MDTypography>
                                ),
                            })
                        }

                    })
                    setRows(temp_row);
                }
            })
    }

    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox mb={2}/>
            <Header avatar={userData.avatar} name={userData.name}>
                <MDBox mt={5} mb={3}>
                    <Grid container spacing={1}>
                        {/*<Grid item xs={12} md={6} xl={4}>*/}
                        {/*    <PlatformSettings/>*/}
                        {/*</Grid>*/}
                        <Grid item xs={12} md={6} xl={6} sx={{display: "flex"}}>
                            <Divider orientation="vertical" sx={{ml: -2, mr: 1}}/>
                            <ProfileInfoCard
                                title="个人信息"
                                description="欢迎来到宏德健身房，您是尊贵的会员，好好吃饭，好好生活，不要让健身成为您的负担哦!"
                                user_id={user_id}
                                action={{route: "", tooltip: "编辑信息"}}
                                shadow={false}
                            />
                            <Divider orientation="vertical" sx={{mx: 0}}/>
                        </Grid>
                        <Grid item xs={12} xl={6}>
                            <BalanceCard title="余额信息" description="您可以在此处查看或充值课时。" user_id={user_id}
                                         shadow={false}/>
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox pt={2} px={2} lineHeight={1.25}>
                    <MDTypography variant="h6" fontWeight="medium">
                        已选课程
                    </MDTypography>
                    <MDBox mb={1}>
                        <MDTypography variant="button" color="text">
                            您可以在这里查看已选课程
                        </MDTypography>
                    </MDBox>
                </MDBox>
                <MDBox p={2}>
                    <DataTable
                        table={{columns, rows}}
                        isSorted={true}
                        showTotalEntries={false}
                        canSearch={true}
                        noEndBorder
                    />
                </MDBox>
            </Header>
            <Footer/>
        </DashboardLayout>
    );
}

export default Overview;
