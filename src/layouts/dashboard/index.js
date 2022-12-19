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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import {useEffect, useState} from "react";

function Dashboard() {
    const {sales, tasks} = reportsLineChartData;
    const [data, setData] = useState({});
    const [balanceOrder, setBalanceOrder] = useState([]);
    const [balanceOrderL, setBalanceOrderL] = useState(5);
    const [isLoading, setIsLoading] = useState(true);

    const updateOrder = async () => {
        fetch("http://localhost:8000/data/balanceorder")
            .then((res) => res.json())
            .then((data) => {
                setBalanceOrder(data.data);
                setBalanceOrderL(data.total);
            })
    }

    const updateData = async () => {
        setIsLoading(true);
        fetch("http://localhost:8000/data/")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
            })
    }

    useEffect(() => {
        updateData();
        updateOrder();
        setIsLoading(false);

    }, []);

    return isLoading ? (<div>Loading ...</div>) : (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox py={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="dark"
                                icon="weekend"
                                title="预约人次"
                                count={data.course_order_count}
                                percentage={{
                                    color: "success",
                                    amount: data.course_order_count * 5 + "%",
                                    label: "较上周增加",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                icon="leaderboard"
                                title="会员数量"
                                count={data.sys_user_count}
                                percentage={{
                                    color: "success",
                                    amount: data.sys_user_count * 10 + "%",
                                    label: "较上月增加",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="success"
                                icon="store"
                                title="收入"
                                count={data.balance_today * 100}
                                percentage={{
                                    color: "success",
                                    amount: data.balance_yes === 0 ? "100%" : Math.trunc(data.balance_today * 100 / data.balance_yes) + "%",
                                    label: "较昨天增加",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="primary"
                                icon="person_add"
                                title="教练"
                                count={data.coach_count}
                                percentage={{
                                    color: "success",
                                    amount: "",
                                    label: "刚刚更新",
                                }}
                            />
                        </MDBox>
                    </Grid>
                </Grid>
                <MDBox mt={4.5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6}>
                            <MDBox mb={3}>
                                <ReportsBarChart
                                    color="info"
                                    title="预约人数"
                                    description="过去七天"
                                    date="刚刚更新"
                                    chart={{
                                        labels: data.course_order_x,
                                        datasets: {label: "人数", data: data.course_order_y},
                                    }}
                                />
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <MDBox mb={3}>
                                <ReportsLineChart
                                    color="success"
                                    title="课时销售"
                                    description={
                                        "过去七天"
                                    }
                                    date="刚刚更新"
                                    chart={{
                                        labels: data.course_order_x,
                                        datasets: {label: "销售课时", data: data.balance_order_y},
                                    }}
                                />
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={12}>
                            <OrdersOverview balanceOrder={balanceOrder} setBalanceOrderL={setBalanceOrderL}/>
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox>
            <Footer/>
        </DashboardLayout>
    );
}

export default Dashboard;
