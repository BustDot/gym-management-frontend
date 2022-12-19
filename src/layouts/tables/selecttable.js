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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import {useEffect, useState} from "react";
import MDButton from "../../components/MDButton";
import Icon from "@mui/material/Icon";
import MDInput from "../../components/MDInput";
import {getToken, hasToken} from "../../utils/localtoken";
import Autocomplete from "@mui/material/Autocomplete";
import {useUserController} from "../../context/user";

// Data
const Author = ({name}) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDBox ml={2} lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
                {name}
            </MDTypography>
        </MDBox>
    </MDBox>
);

function SelectTables() {
    const [UserController, dispatchUser] = useUserController();
    const {
        username
    } = UserController;
    const [rows, setRows] = useState([])
    const [addCourse, setAddCourse] = useState(false);

    const [name, setName] = useState("");
    const [time, setTime] = useState("10:30:00");
    const [duration, setDuration] = useState(0);
    const [coach, setCoach] = useState("");
    const [date, setDate] = useState("2022-12-20");

    const [coachList, setCoachList] = useState([])

    const openAddCoach = () => setAddCourse(!addCourse);

    const columns = [
        {Header: "课程名称", accessor: "name", width: "35%", align: "left"},
        {Header: "开始时间", accessor: "time", align: "center"},
        {Header: "持续时间(h)", accessor: "duration", align: "center"},
        {Header: "教练", accessor: "coach", align: "center"},
        {Header: "操作", accessor: "action", align: "center"}
    ]

    const updateCoachList = () => {
        fetch("http://localhost:8000/coach/")
            .then((res) => res.json())
            .then((data) => {
                if (data.result === "success") {
                    const temp_row = []
                    data.data.forEach((user) => {
                        temp_row.push(user.name)
                    })
                    setCoachList(temp_row)
                }
            })
    }

    const handleSelect = (course, sys_user, coach) => {
        if (hasToken()) {
            const data = {
                course: course,
                sys_user: sys_user,
                coach: coach
            }
            const jwt_token = getToken();
            fetch("http://localhost:8000/courseorder/" + username + "/", {
                method: "POST",
                headers: {
                    'Authorization': "Bearer " + jwt_token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(res => res.json())
                .then(data => {
                    if (data.result === 'error') {
                        alert("余额不足！请在个人信息页面充值！")
                    }
                    console.log(data);
                    updateCourseList();
                })
        }
    }

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
        fetch("http://localhost:8000/courseorder/list/" + username + "/")
            .then((res) => res.json())
            .then((data) => {
                if (data.result === "success") {
                    const temp_row = []
                    data.data.forEach((course) => {
                        const startTime = new Date(course.course_begin);
                        temp_row.push({
                            name: course.course_name,
                            time: startTime.toLocaleString('chinese', {hour12: false}),
                            duration: course.course_last,
                            coach: course.coach_name,
                            action: (course.is_selected ? <MDTypography
                                        onClick={() => handleDelete(course.id, username, course.coach)}
                                        variant="caption"
                                        color="error"
                                        fontWeight="medium"
                                        sx={{cursor: "pointer"}}>
                                        退选
                                    </MDTypography> :
                                    <MDTypography
                                        onClick={() => handleSelect(course.id, username, course.coach)}
                                        variant="caption"
                                        color="text"
                                        fontWeight="medium"
                                        sx={{cursor: "pointer"}}>
                                        选课
                                    </MDTypography>
                            ),
                        })
                    })
                    setRows(temp_row);
                }
            })
    }

    useEffect(() => {
        updateCourseList();
        updateCoachList();

    }, [])

    const handleCreateCourse = () => {
        if (hasToken()) {
            const jwt_token = getToken();
            const data = {
                course_name: name,
                course_begin: date + " " + time,
                course_last: duration,
                coach_name: coach,
            }
            fetch("http://localhost:8000/course/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + jwt_token,
                },
                method: "POST",
                body: JSON.stringify(data)
            }).then(res => res.json())
                .then(data => {
                    // setName(data.name);
                    // setTime(data.age);
                    // setDuration(data.phone);
                })
        }
        updateCourseList();
        openAddCoach();
    }

    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white" mt={0.8} sx={{float: "left"}}>
                                    课程选择
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                {!addCourse && <DataTable
                                    table={{columns, rows}}
                                    isSorted={true}
                                    showTotalEntries={false}
                                    canSearch={true}
                                    noEndBorder
                                />}
                                {addCourse && <>
                                    <MDBox m={3} display="flex" sx={{justifyContent: 'space-between'}}>
                                        <MDBox display="flex" alignItems="center" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                课程名称: &nbsp;
                                            </MDTypography>
                                            <MDInput onChange={e => setName(e.target.value)} type="text" label="课程名称"
                                                     value={name}/>
                                        </MDBox>
                                        <MDBox display="flex" alignItems="center" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                开始时间: &nbsp;
                                            </MDTypography>
                                            <MDInput onChange={e => setDate(e.target.value)} type="date"/>
                                            <MDInput onChange={e => setTime(e.target.value)} type="time"/>
                                        </MDBox>
                                        <MDBox display="flex" alignItems="center" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                持续时间(h): &nbsp;
                                            </MDTypography>
                                            <MDInput onChange={e => setDuration(e.target.value)} type="number"
                                                     label="持续时间"/>
                                        </MDBox>
                                        <MDBox display="flex" alignItems="center" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                开课教练: &nbsp;
                                            </MDTypography>
                                            <Autocomplete
                                                disableClearable
                                                options={coachList}
                                                onChange={(event, newValue) => {
                                                    setCoach(newValue)
                                                }}
                                                sx={{width: "10rem"}}
                                                renderInput={(params) => <MDInput {...params} />}
                                            />
                                        </MDBox>
                                    </MDBox>
                                    <MDBox mx={5} mb={3} display="flex" sx={{justifyContent: 'flex-start'}}>
                                        <MDButton variant="gradient" color="success" mr={2}
                                                  onClick={handleCreateCourse}>
                                            <Icon sx={{fontWeight: "bold"}}>check</Icon>
                                            &nbsp;添加课程
                                        </MDButton>
                                        <MDButton variant="gradient" color="error" onClick={openAddCoach}>
                                            <Icon sx={{fontWeight: "bold"}}>close</Icon>
                                            &nbsp;取消添加
                                        </MDButton>
                                    </MDBox>
                                </>
                                }
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer/>
        </DashboardLayout>
    );
}

export default SelectTables;
