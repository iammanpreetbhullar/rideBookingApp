import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import DataGrid from '../common/DataGrid';
import { Toast } from 'primereact/toast';
import { currencyNumberOnly } from '../basic/util/formatter';
import { getSubscriptionPlans, updateVehiclePlan } from '../../actions/vehicle';

class SubscriptionPlans extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectedPlan: {},
            loading: false,
            displayResponsive: false
        };
        this.columns = [
            { field: 'planName', header: 'Plan' },
            { field: 'price', header: 'Price', body: this.customBodyTemplate },
            { field: 'validityDays', header: 'Validity', body: this.customBodyTemplate },
            { field: 'action', header: 'Action', body: this.customBodyTemplate, bodyStyle: { textAlign: 'center' }, style: { width: '5%' } }
        ];
        this.toast = createRef(null);
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.fetchPlans();
    }

    fetchPlans = () => {
        this.props.getSubscriptionPlans().then(() => {
            this.setState({ data: this.props.plansDetails.data, loading: false })
        })
    }

    customBodyTemplate = (rowData, col) => (
        col.field === 'price' ? currencyNumberOnly.format(rowData.price) :
            col.field === 'validityDays' ? <span>{rowData.validityDays} Days</span> :
                <Button className="p-button-rounded p-button-info p-button-sm me-2" type="button" onClick={() => this.handleActionClick(rowData, 'displayResponsive')} >
                    Choose
                </Button>
    )

    handleActionClick = (rowData, name) => {
        let state = {
            [`${name}`]: true
        };
        this.setState(state);
        this.setState({ selectedPlan: rowData })
    }

    onHide = (name) => {
        if (name) {
            this.setState({
                [`${name}`]: false
            });
        } else {
            this.props.hideDialog();
        }
    }

    acceptConfirmDelete = () => {
        let data = {};
        data.planId = this.state.selectedPlan.id;
        data.vehicleId = this.props.vehicleData.id;
        this.props.updateVehiclePlan(data).then(() => {
            const obj = this.props.updatedPlanDetails;
            for (const key in obj) {
                console.log(key)
                if (key === 'message') {
                    this.toast.current.show({ severity: 'success', summary: 'Success', detail: 'Changes have been updated successfully', life: 3000 });
                } else if (key === 'error') {
                    this.toast.current.show({ severity: 'error', summary: 'Error', detail: obj[key], life: 3000 });
                }
            }
        }).then(() => {
            this.onHide();
        })
    }
    
    render() {
        return (
            <>
                <Dialog header="Subscription Plans" visible={this.props.visible} onHide={this.onHide} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} >
                    <div className="card">
                        <DataGrid
                            columns={this.columns}
                            value={this.state.data}
                            responsiveLayout="scroll"
                            loading={this.state.loading}
                        />
                    </div>
                </Dialog>
                <ConfirmDialog
                    header="Confirmation"
                    message={<span>
                        <h5>{this.state.selectedPlan.planName}</h5>
                        <p>
                            <b>Price: </b>{currencyNumberOnly.format(this.state.selectedPlan.price)}
                            <br />
                            <b>Validity: </b>{this.state.selectedPlan.validityDays} Days
                        </p>
                        <hr />
                        <span className='d-flex align-items-center'>
                            <i className="pi pi-exclamation-triangle me-3"></i> Are you sure you want to proceed with this plan?
                        </span>
                    </span>}
                    visible={this.state.displayResponsive}
                    accept={this.acceptConfirmDelete}
                    onHide={() => this.onHide('displayResponsive')}
                />
                <Toast ref={this.toast} position="bottom-right" />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        plansDetails: state.vehicle.plansDetails,
        updatedPlanDetails: state.vehicle.updatedPlanDetails,
        error: state.vehicle.error
    };
};
const mapDispatchToProps = {
    getSubscriptionPlans, updateVehiclePlan
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionPlans);