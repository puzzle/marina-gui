import React from 'react';
import {Link} from 'react-router-dom';
import {translate} from 'react-translate'
import {Button, ButtonGroup} from 'react-bootstrap'

const Navigation = ({t}) => (
    <ButtonGroup vertical>
        <Button><Link to="/">{t("dashboard")}</Link></Button>
        <Button><Link to="/user-settings">{t("userSettings")}</Link></Button>
    </ButtonGroup>
);

export default translate("Navigation")(Navigation);
