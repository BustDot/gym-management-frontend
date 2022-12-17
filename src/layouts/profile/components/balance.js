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

// react-routers components

// prop-types is library for typechecking of props

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MDButton from "../../../components/MDButton";
import {useEffect, useState} from "react";
import MDInput from "../../../components/MDInput";
import {getToken, hasToken} from "../../../utils/localtoken";


function BalanceCard({title, description, user_id, shadow}) {
    const [cardTime, setCardTime] = useState(0);
    const [cardLeftTime, setCardLeftTime] = useState(0);
    const [topUp, setTopUp] = useState(false);
    const [topUpValue, setTopUpValue] = useState(0);
    const openTopUp = () => setTopUp(true);
    const closeTopUp = () => setTopUp(false);
    useEffect(() => {
        if (hasToken()) {
            const jwt_token = getToken();
            fetch("http://localhost:8000/sysuser/" + user_id + "/", {
                headers: {
                    'Authorization': "Bearer " + jwt_token,
                }
            }).then(res => res.json())
                .then(data => {
                    setCardTime(data.data.card_time);
                    setCardLeftTime(data.data.card_left_time);
                })
        }
    }, [])

    const handlePutCardTime = () => {
        if (hasToken()) {
            const jwt_token = getToken();
            const data = {
                top_up_value: topUpValue
            }
            fetch("http://localhost:8000/sysuser/" + user_id + "/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + jwt_token,
                },
                method: "PUT",
                body: JSON.stringify(data)
            }).then(res => res.json())
                .then(data => {
                    setCardTime(data.data.card_time.toString());
                    setCardLeftTime(data.data.card_left_time.toString());
                })
        }
        setTopUp(false);
    }


    return (
        <Card sx={{height: "100%", boxShadow: !shadow && "none"}}>
            <MDBox pt={2} px={2}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    {title}
                </MDTypography>
            </MDBox>
            <MDBox p={2}>
                <MDBox mb={2} lineHeight={1}>
                    <MDTypography variant="button" color="text" fontWeight="light">
                        {description}
                    </MDTypography>
                </MDBox>
                <MDBox opacity={0.3}>
                    <Divider/>
                </MDBox>
                <MDBox p={0}>
                    <MDBox display="flex" py={1} pr={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            购买课时: &nbsp;
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;{cardTime}
                        </MDTypography>
                    </MDBox>
                    <MDBox display="flex" py={1} pr={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            剩余课时: &nbsp;
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;{cardLeftTime}
                        </MDTypography>
                    </MDBox>
                    {topUp && <MDBox display="flex" alignItems="center" py={1} pr={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            充值课时: &nbsp;
                        </MDTypography>
                        <MDInput onChange={e => setTopUpValue(e.target.value)} type="number" label="充值课时"/>
                    </MDBox>}
                </MDBox>
            </MDBox>
            {!topUp && <MDBox>
                <MDButton variant="gradient" color="dark" onClick={openTopUp}>
                    <Icon sx={{fontWeight: "bold"}}>add</Icon>
                    &nbsp;充值
                </MDButton>
            </MDBox>}
            {topUp && <MDBox display="flex">
                <MDButton variant="gradient" color="success" onClick={handlePutCardTime}>
                    <Icon sx={{fontWeight: "bold"}}>check</Icon>
                    &nbsp;确认充值
                </MDButton>
                <MDButton variant="gradient" color="error" onClick={closeTopUp}>
                    <Icon sx={{fontWeight: "bold"}}>close</Icon>
                    &nbsp;取消充值
                </MDButton>
            </MDBox>}
        </Card>
    );
}

export default BalanceCard;
