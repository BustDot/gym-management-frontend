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
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import {useEffect, useState} from "react";
import {getToken, hasToken} from "../../../../utils/localtoken";
import MDInput from "../../../../components/MDInput";
import MDButton from "../../../../components/MDButton";

// Material Dashboard 2 React base styles

function ProfileInfoCard({title, description, user_id, action, shadow}) {
    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
    const [phone, setPhone] = useState("");
    const [editName, setEditName] = useState("");
    const [editAge, setEditAge] = useState(0);
    const [editPhone, setEditPhone] = useState("");
    const [edit, setEdit] = useState(false);
    const openEdit = () => setEdit(!edit);
    useEffect(() => {
        if (hasToken()) {
            const jwt_token = getToken();
            fetch("http://localhost:8000/sysuser/" + user_id + "/", {
                headers: {
                    'Authorization': "Bearer " + jwt_token,
                }
            }).then(res => res.json())
                .then(data => {
                    setName(data.data.name);
                    setAge(data.data.age);
                    setPhone(data.data.phone);
                })
        }
    }, [])

    const handlePutInfo = () => {
        if (hasToken()) {
            const jwt_token = getToken();
            const data = {
                name: editName,
                age: editAge,
                phone: editPhone
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
                    setName(data.data.name);
                    setAge(data.data.age);
                    setPhone(data.data.phone);
                })
        }
        openEdit();
    }
    return (
        <Card sx={{height: "100%", boxShadow: !shadow && "none"}}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    {title}
                </MDTypography>
                <MDTypography onClick={openEdit} variant="body2" color="secondary">
                    <Tooltip title={action.tooltip} placement="top">
                        <Icon>edit</Icon>
                    </Tooltip>
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
                {!edit && <MDBox p={0}>
                    <MDBox display="flex" py={1} pr={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            姓名: &nbsp;
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;{name}
                        </MDTypography>
                    </MDBox>
                    <MDBox display="flex" py={1} pr={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            年龄: &nbsp;
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;{age}
                        </MDTypography>
                    </MDBox>
                    <MDBox display="flex" py={1} pr={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            手机: &nbsp;
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;{phone}
                        </MDTypography>
                    </MDBox>
                </MDBox>}
                {edit && <MDBox p={0}>
                    <MDBox display="flex" alignItems="center" py={1} pr={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            姓名: &nbsp;
                        </MDTypography>
                        <MDInput onChange={e => setEditName(e.target.value)} type="text" label="姓名" value={name}/>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" py={1} pr={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            年龄: &nbsp;
                        </MDTypography>
                        <MDInput onChange={e => setEditAge(e.target.value)} type="number" label="年龄" value={age}/>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" py={1} pr={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            手机: &nbsp;
                        </MDTypography>
                        <MDInput onChange={e => setEditPhone(e.target.value)} type="tel" label="手机" value={phone}/>
                    </MDBox>
                </MDBox>
                }
            </MDBox>
            {edit && <MDBox display="flex">
                <MDButton variant="gradient" color="success" onClick={handlePutInfo}>
                    <Icon sx={{fontWeight: "bold"}}>check</Icon>
                    &nbsp;更新信息
                </MDButton>
                <MDButton variant="gradient" color="error" onClick={openEdit}>
                    <Icon sx={{fontWeight: "bold"}}>close</Icon>
                    &nbsp;取消更新
                </MDButton>
            </MDBox>}
        </Card>
    );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
    shadow: true,
};

export default ProfileInfoCard;
