import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataGrid from "../common/DataGrid";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { getAllUsers } from "../../actions/getUsers";
import { Badge } from "primereact/badge";
import { createSession, invalidateSession } from '../../config/appSession';
import { driverLogin, driverLogout } from '../../actions/authentication';
import loader from '../../assets/loaders/rickshawLoading.gif'

class DriversList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: 10,
            loading: true,
            globalFilterValue: '',
            timer: 0,
            loaderShow: false

        };
        this.columns = [
            { field: "firstName", header: "First Name", style: { width: '15%' }, sortable: true },
            { field: "lastName", header: "Last Name", style: { width: '15%' }, sortable: true },
            { field: "mobileNumber", header: "Mobile Number", style: { width: '8%' } },
            { field: "kycStatus", header: "KYC Status", body: this.customBodyTemplate, style: { width: '6%' }, sortable: true },
            { header: "Actions", body: this.customBodyTemplate, style: { width: '3%' }, bodyStyle: { textAlign: 'center' }, sortable: true }
        ];
    }

    componentDidMount() {
        this.setState({ loaderShow: true })
        this.initFilters();
    }

    initFilters = () => {
        this.getDrivers("");
        this.setState({ globalFilterValue: '' })
    }

    getDrivers = (filters) => {
        if (filters != "") {
            this.props.getAllUsers(filters).then(() => {
                if (this.props.users !== undefined) {
                    this.setState({ loading: false, loaderShow: false });
                }
            });
        } else {
            let driverFilter = { filtering: {} };
            driverFilter.filtering.userType = "DRIVER"
            this.props.getAllUsers(driverFilter).then(() => {
                if (this.props.users !== undefined) {
                    this.setState({ loading: false, loaderShow: false });
                }
            });
        }
    }

    customBodyTemplate = (rowData, col) => {
        return (
            col.field === "kycStatus" ? <Badge value={rowData.kycStatus} className="mr-2" severity={rowData.kycStatus === "APPROVED" ? "success" : "danger"} /> :
                <Button className="p-button-rounded p-button-info p-button-sm" type="button" onClick={() => this.handleActionClick(rowData, 'displayResponsive')}>
                    <i className="pi pi-user-edit" style={{ fontSize: "1em" }}></i>
                </Button>
        )
    };

    handleActionClick = (args) => {
        if (args == "logout") {
            localStorage.clear();
            this.props.history.push('/login')
        } else {
            if (args.id === "10000002") {
                let data = {};
                data.username = "driver1";
                data.password = "driver";
                this.props.driverLogin(data).then(() => {
                    this.initSession(args)
                });
            } else {
                localStorage.clear();
                let data = {};
                data.username = "driver2";
                data.password = "driver";
                this.props.driverLogin(data).then(() => {
                    this.initSession(args)
                });
            }
        }
    }

    initSession = (args) => {
        const { authenticated, driverDetails } = this.props;
        if (authenticated) {
            createSession(driverDetails);
            this.props.history.push('/drivers/' + args.id);
        }
    }

    onGlobalFilterChange = (e) => {
        let filters = { filtering: {} }
        const value = e.target.value;
        filters.filtering.searchText = value;

        clearTimeout(this.state.timer);

        const newTimer = setTimeout(() => {
            this.getDrivers(filters)
        }, 1000);

        this.setState({ timer: newTimer, globalFilterValue: value });
    }

    clearFilter = () => {

    }


    renderHeader = () => (
        <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-between">
                {/* <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={this.state.globalFilterValue} onChange={this.onGlobalFilterChange} placeholder="Keyword Search" className="p-inputtext-sm block global-search-input me-2" />
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined p-button-sm p-button-danger" onClick={() => this.clearFilter("")} />
                </span> */}
            </div>
            <div>
                <Button className="p-button p-button-warning p-button-sm" type="button" onClick={() => this.handleActionClick("logout")}>
                    Logout
                </Button>
            </div>
        </div>
    )

    render() {
        const { rows, loading } = this.state;
        return (
            <>
                {this.state.loaderShow ?
                    <div className='bg-transparent w-100 d-flex justify-content-center align-items-center' style={{ height: '93.5%' }}>
                        <img src={loader} width='20%' />
                    </div> :
                    <div>
                        <DataGrid
                            columns={this.columns}
                            value={this.props.users.data}
                            stripedRows={true}
                            size="small"
                            responsiveLayout="scroll"
                            paginator={true}
                            showGridlines={true}
                            rows={rows}
                            dataKey="id"
                            filtering={true}
                            loading={loading}
                            globalFilterFields={['firstName', 'lastName', 'mobileNumber', 'city']}
                            header={this.renderHeader}
                            emptyMessage="No records found."
                        />
                    </div>
                }
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        users: state.getAllUsers.users,
        driverDetails: state.authData.driverDetails,
        authenticated: state.authData.authenticated,

        error: state.getAllUsers.error,
        error: state.authData.error
    };
};

const mapDispatchToProps = {
    getAllUsers, driverLogin, driverLogout
};

export default connect(mapStateToProps, mapDispatchToProps)(DriversList);