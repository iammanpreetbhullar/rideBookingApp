import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataGrid from "../common/DataGrid";
import { Button } from "primereact/button";
import { getRecentRidesData, getPastRidesData, acceptRide, cancelRide } from '../../actions/drivers';
import { ConfirmPopup } from 'primereact/confirmpopup';

class DriverDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: 30,
            loading: true,
            globalFilterValue: '',
            timer: 0,
            data: [],
            displayResponsive: false,
            confirmDialog: false,
            rideData: {}
        };
        this.columns = [
            { field: "rideId", header: "Id", body: this.customBodyTemplate, style: { width: '2%' }, sortable: true },
            { field: "firstName", header: "First Name", body: this.customBodyTemplate, style: { width: '15%' }, sortable: true },
            { field: "lastName", header: "Last Name", body: this.customBodyTemplate, style: { width: '15%' }, sortable: true },
            { field: "mobileNumber", header: "Mobile Number", body: this.customBodyTemplate, style: { width: '8%' } },
            { field: "bookingDate", header: "Booking Date", body: this.customBodyTemplate, style: { width: '10%' }, sortable: true },
            { field: "rideStatus", header: "Status", body: this.customBodyTemplate, style: { width: '10%' }, sortable: true },
            { field: "action", header: "Action", body: this.customBodyTemplate, style: { width: '6%' }, sortable: true }
        ];
    }

    componentDidMount() {
        this.getRides("recentRides");
    }

    componentDidUpdate(prevStat) {
        if (this.props.recentRides != prevStat.recentRides) {
            this.setState({ data: this.props.recentRides })
        }
    }

    getRides = (args) => {
        if (args === "recentRides") {
            this.props.getRecentRidesData();
            this.setState({ loading: false, data: this.props.recentRides })
        } else {
            this.props.getPastRidesData();
            this.setState({ loading: false, data: this.props.pastRides })
        }
    }

    rideAcceptance = (data) => {
        this.props.acceptRide(data);
    }

    rideCancellation = (data) => {
        this.props.cancelRide(data);
    }

    customBodyTemplate = (rowData, col) => {
        return (
            col.field === "rideId" ? <span>{rowData.ride.id}</span> :
                col.field === "firstName" ? <span>{rowData.ride.person.firstName}</span> :
                    col.field === "lastName" ? <span>{rowData.ride.person.lastName}</span> :
                        col.field === "mobileNumber" ? <span>{rowData.ride.person.mobileNumber}</span> :
                            col.field === "bookingDate" ? <span>{new Date(rowData.ride.bookingDate).toLocaleDateString()}</span> :
                                col.field === "rideStatus" ? <span>{rowData.ride.status}</span> :
                                    col.field === "action" ?
                                        rowData.ride.status === "REQUESTED" ?
                                            <Button className="p-button-rounded p-button-success p-button-sm" type="button" onClick={() => this.handleActionClick(rowData, "accept")}>
                                                Accept Ride
                                            </Button> :
                                            rowData.ride.status === "ACCEPTED" ?
                                                <Button className="p-button-rounded p-button-danger p-button-sm" type="button" onClick={() => this.handleActionClick(rowData, "cancel")}>
                                                    Cancel Ride
                                                </Button> : <span>No action needed</span> : null
        )
    }

    handleActionClick = (data, args) => {
        if (args === "cancel") {
            this.rideCancellation(data.ride)
            this.getRides("recentRides");
        } else {
            this.setState({ confirmDialog: true })
            this.setState({ rideData: data.ride })
        }
    }

    handleRecords = (args) => {
        if (args != "backToList") {
            this.getRides(args)
        } else {
            this.props.history.push('/drivers')
        }
    }

    acceptConfirmDelete = () => {
        this.rideAcceptance(this.state.rideData);
        this.getRides("recentRides");
    }

    closeConfirmDeleteRow = () => {
        this.setState({ confirmDialog: false })
    }

    renderHeader = () => (
        <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-start">
                <Button type="button" className="p-button p-button-info p-button-sm me-2" onClick={() => this.handleRecords("recentRides")} >Recent records</Button>
                <Button className="p-button p-button-warning p-button-sm" type="button" onClick={() => this.handleRecords("pastRides")}>Past records</Button>
            </div>
            <div>
                <Button className="p-button p-button-danger p-button-sm" type="button" onClick={() => this.handleRecords("backToList")}>Back to list</Button>
            </div>
        </div>
    )

    render() {
        const { rows, loading } = this.state;
        return (
            <div>
                <DataGrid
                    columns={this.columns}
                    value={this.state.data}
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
                    scrollable={true}
                    scrollHeight="800px"
                />
                <ConfirmPopup message="Are you sure you want to proceed?" visible={this.state.confirmDialog} accept={this.acceptConfirmDelete} onHide={this.closeConfirmDeleteRow} />
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        recentRides: state.rideDetails.recentRides,
        pastRides: state.rideDetails.pastRides,
        acceptedRide: state.rideDetails.acceptedRide,
        canceledRide: state.rideDetails.canceledRide,
        error: state.rideDetails.error
    };
};

const mapDispatchToProps = {
    getRecentRidesData,
    getPastRidesData,
    acceptRide,
    cancelRide
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverDetails);