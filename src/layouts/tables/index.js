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

function Tables() {
    // const {columns, rows} = authorsTableData();
    const [rows, setRows] = useState([])
    const columns = [
        {Header: "姓名", accessor: "name", width: "35%", align: "left"},
        {Header: "性别", accessor: "gender", align: "left"},
        {Header: "手机号", accessor: "phone", align: "center"},
        {Header: "购买课时", accessor: "card_time", align: "center"},
        {Header: "剩余课时", accessor: "left_time", align: "center"},
        {Header: "操作", accessor: "action", align: "center"}
    ]

    useEffect(() => {
        fetch("http://localhost:8000/sysuser/list/")
            .then((res) => res.json())
            .then((data) => {
                if (data.result === "success") {
                    const temp_row = []
                    data.data.forEach((user) => {
                        temp_row.push({
                            name: <Author image={user.avatar} name={user.name}/>,
                            gender: user.gender,
                            phone: user.phone,
                            card_time: user.card_time,
                            left_time: user.card_left_time,
                            action: (
                                <MDTypography component="a" href={"/users/" + user.user_id} variant="caption"
                                              color="text"
                                              fontWeight="medium">
                                    详情
                                </MDTypography>
                            ),
                        })
                    })
                    setRows(temp_row)
                }
            })
    }, [])

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
                                <MDTypography variant="h6" color="white">
                                    用户管理
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{columns, rows}}
                                    isSorted={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer/>
        </DashboardLayout>
    );
}

export default Tables;
