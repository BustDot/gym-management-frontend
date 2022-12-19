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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview({balanceOrder, setBalanceOrderL}) {
    return (
        <Card sx={{height: "100%"}}>
            <MDBox pt={3} px={3}>
                <MDTypography variant="h6" fontWeight="medium">
                    销售概览
                </MDTypography>
            </MDBox>
            <MDBox p={2}>
                {balanceOrder.map((order) => (
                    <TimelineItem
                        color="success"
                        icon="shopping_cart"
                        title={order.sys_user_name + "充值了" + order.top_up_value + "课时。"}
                        dateTime={order.created_time}
                        key={order.id}
                    />
                ))}
            </MDBox>
        </Card>
    );
}

export default OrdersOverview;
