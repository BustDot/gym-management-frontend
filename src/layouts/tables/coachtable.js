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
import MDAvatar from "../../components/MDAvatar";
import MDButton from "../../components/MDButton";
import Icon from "@mui/material/Icon";
import MDInput from "../../components/MDInput";
import {getToken, hasToken} from "../../utils/localtoken";

// Data
const Author = ({image, name}) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={image} name={name} size="sm"/>
        <MDBox ml={2} lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
                {name}
            </MDTypography>
        </MDBox>
    </MDBox>
);

function CoachTables() {
    const [rows, setRows] = useState([])
    const [addCoach, setAddCoach] = useState(false);

    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("男");
    const [avatar, setAvatar] = useState("https://tva4.sinaimg.cn/large/9bd9b167ly1g1p9a6q1dej20b40b40t2.jpg");

    const openAddCoach = () => setAddCoach(!addCoach);

    const handleDelete = (id) => {
        if (hasToken()) {
            const jwt_token = getToken();
            fetch("http://localhost:8000/coach/" + id + "/", {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer " + jwt_token,
                }
            }).then(res => updateCoachList())
        }
    }

    const columns = [
        {Header: "姓名", accessor: "name", width: "35%", align: "left"},
        {Header: "性别", accessor: "gender", align: "center"},
        {Header: "年龄", accessor: "age", align: "center"},
        {Header: "手机号", accessor: "phone", align: "center"},
        {Header: "操作", accessor: "action", align: "center"}
    ]

    const updateCoachList = async () => {
        fetch("http://localhost:8000/coach/")
            .then((res) => res.json())
            .then((data) => {
                if (data.result === "success") {
                    const temp_row = []
                    data.data.forEach((user) => {
                        temp_row.push({
                            name: <Author image={user.avatar} name={user.name}/>,
                            gender: user.gender,
                            phone: user.phone,
                            age: user.age,
                            action: (
                                <MDTypography
                                    onClick={() => handleDelete(user.id)}
                                    variant="caption"
                                    color="error"
                                    fontWeight="medium"
                                    sx={{cursor: "pointer"}}>
                                    删除
                                </MDTypography>
                            ),
                        })
                    })
                    setRows(temp_row)
                }
            })
    }

    useEffect(() => {
        updateCoachList();
    }, [])

    const handleCreateCoach = () => {
        if (hasToken()) {
            const jwt_token = getToken();
            const data = {
                name: name,
                gender: gender,
                age: age,
                phone: phone,
                avatar: avatar
            }
            fetch("http://localhost:8000/coach/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + jwt_token,
                },
                method: "POST",
                body: JSON.stringify(data)
            }).then(res => res.json())
                .then(data => {
                    setName(data.name);
                    setAge(data.age);
                    setPhone(data.phone);
                    setAvatar(data.avatar);
                    openAddCoach();
                }).then(() => updateCoachList());
        }

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
                                    教练管理
                                </MDTypography>
                                <MDBox sx={{float: "right"}}>
                                    <MDButton variant="gradient" color="dark" onClick={openAddCoach}>
                                        <Icon sx={{fontWeight: "bold"}}>add</Icon>
                                        &nbsp;添加教练
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={3}>
                                {!addCoach && <DataTable
                                    table={{columns, rows}}
                                    isSorted={true}
                                    showTotalEntries={false}
                                    canSearch={true}
                                    noEndBorder
                                />}
                                {addCoach && <>
                                    <MDBox m={3} display="flex" sx={{justifyContent: 'space-between'}}>
                                        <MDBox display="flex" alignItems="center" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                姓名: &nbsp;
                                            </MDTypography>
                                            <MDInput onChange={e => setName(e.target.value)} type="text" label="姓名"
                                                     value={name}/>
                                        </MDBox>
                                        <MDBox display="flex" alignItems="center" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                性别: &nbsp;
                                            </MDTypography>
                                            <MDInput onChange={e => setGender(e.target.value)} type="text" label="性别"
                                                     value={gender}/>
                                        </MDBox>
                                        <MDBox display="flex" alignItems="center" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                年龄: &nbsp;
                                            </MDTypography>
                                            <MDInput onChange={e => setAge(e.target.value)} type="number" label="年龄"
                                                     value={age}/>
                                        </MDBox>
                                        <MDBox display="flex" alignItems="center" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                手机: &nbsp;
                                            </MDTypography>
                                            <MDInput onChange={e => setPhone(e.target.value)} type="tel" label="手机"
                                                     value={phone}/>
                                        </MDBox>
                                        <MDBox display="flex" alignItems="center" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                头像: &nbsp;
                                            </MDTypography>
                                            <MDInput onChange={e => setAvatar(e.target.value)} type="tel" label="头像"
                                                     value={avatar}/>
                                        </MDBox>
                                    </MDBox>
                                    <MDBox mx={5} mb={3} display="flex" sx={{justifyContent: 'flex-start'}}>
                                        <MDButton variant="gradient" color="success" mr={2} onClick={handleCreateCoach}>
                                            <Icon sx={{fontWeight: "bold"}}>check</Icon>
                                            &nbsp;添加教练
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

export default CoachTables;
