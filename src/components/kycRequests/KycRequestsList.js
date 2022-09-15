import '../../components/App.scss';
import React from "react";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Badge } from "primereact/badge";
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import { Dialog } from 'primereact/dialog';
import { connect } from 'react-redux';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Calendar } from 'primereact/calendar';
import { getAllKYCRequests, getUserKYCRequest } from '../../actions/kyc';
import { Checkbox } from 'primereact/checkbox';
import './KycRequestsList.css';
import img from "../../assets/images/1001Id.jpg";

class KycRequestsList extends React.Component {
    constructor() {
        super();
        this.state = {
            kycStatus: [],
            globalFilterValue: "",
            loading: true,
            position: false,
            displayPosition: false,
            displayResponsive: false,
            kycEachStatus: {},
            statusOptions: [{ name: 'APPROVED', value: 'APPROVED' }, { name: 'PENDING', value: 'PENDING' }, { name: 'REJECTED', value: 'REJECTED' }],
            confirmDialog: false,
            active: true,
            displayRejectPopUp: false,
            userInput: {},
            dateFilters: [{ name: "Today" }, { name: "Yesterday" }, { name: "Custom" }],
            advFilters: [],
            dateCriteria: { displayStartDate: "Start Date", startDate: "", endDate: "", displayEndDate: "End Date" },
            disableStatusFilter: true,
            disableDateFilter: true,
            timer: null,
            btnDelete: false
        };
    }

    componentDidMount() {
        this.fetchRequests({});
    }

    componentDidUpdate(prevState) {
        if (this.props.userKYCRequest !== prevState.userKYCRequest) {
            this.setState({ kycEachStatus: this.props.userKYCRequest })
        }
    }

    fetchRequests = (data) => {
        this.props.getAllKYCRequests(data).then(() => {
            this.setState({ loading: false })
            this.setState({ kycStatus: this.props.allKycRequests })
        })
    }

    statusFormat = (rowData, col) => {
        if (col.field === "status") {
            if (rowData.status === "APPROVED") {
                return (<>
                    <Badge value={rowData.status} severity="success" />
                </>)
            } else if (rowData.status === "PENDING") {
                return (<>
                    <Badge value={rowData.status} severity="danger" />
                </>)
            } else if (rowData.status === "REJECTED") {
                return (<>
                    <Badge value={rowData.status} severity="danger" />
                </>)
            }
        }
    }

    actionTemplate = (rowData, col) => {
        return (<div className="col-md-12">
            <Button className="p-button-secondary p-button-sm" disabled={rowData.status === "APPROVED" ? true : false} icon="pi pi-pencil" onClick={() => this.handleActionClick(rowData, 'displayResponsive')} />
            <Button className="p-button-primary p-button-sm ms-2" icon="pi pi-trash" onClick={() => this.deleteEachRow(rowData, col)} />
        </div>)

    };

    deleteEachRow = (rowData) => {
        this.handleActionClick(rowData)
        this.setState({ btnDelete: true, confirmDialog: true })
    }

    handleChange = (e) => {
        const { userInput, dateCriteria } = this.state;
        const { name, value } = e.target;
        if (value.name === "Custom" || name === 'startDate' || name === 'endDate') {
            this.setState({ active: false })
            let dateElement = document.getElementById('dateFields');
            dateElement.classList.add('d-flex')
        }
        else {
            this.setState({ active: true })
        }
        name === "startDate" ?
            this.setState({ userInput: { ...userInput, [name]: this.formatDatePart(value.getFullYear()) + "-" + this.formatDatePart(value.getMonth() + 1) + "-" + this.formatDatePart(value.getDate()) } })
            : name === "endDate" ?
                this.setState({ userInput: { ...userInput, [name]: this.formatDatePart(value.getFullYear()) + "-" + this.formatDatePart(value.getMonth() + 1) + "-" + this.formatDatePart(value.getDate()) } })
                : this.setState({ userInput: { ...userInput, [name]: value } })
        this.setState({ dateCriteria, filterActive: false })
        this.setState({ userInput: { ...userInput, [name]: value } })
    }

    renderHeader = () => (
        <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-between">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={this.state.globalFilterValue} name="searchInput" onChange={(e) => this.onGlobalFilterChange(e)} placeholder="Search" className="p-inputtext-sm block global-search-input" />
                </span>
            </div>
            <div>
                <Button type="button" icon="pi pi-filter" label="Advanced Filters" className="p-button-outlined p-button-sm me-2" onClick={() => this.handleActionClick("", 'displayPosition', 'top-right')} />
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined p-button-sm p-button-danger" onClick={() => this.clearFilter("")} />
            </div>
        </div>
    )

    onGlobalFilterChange = (e) => {
        const { value } = e.target
        let filter = { filtering: {} };
        filter.filtering.searchText = value
        clearTimeout(this.state.timer)

        const newTimer = setTimeout(() => {
            this.fetchRequests(filter);
        }, 1000);

        this.setState({ timer: newTimer, globalFilterValue: value })
    }

    clearFilter = (name) => {
        this.fetchRequests({})
        this.setState({ disableDateFilter: true, disableStatusFilter: true, globalFilterValue: "", advFilters: [], userInput: { kycStatus: null, criteria: null }, active: true })
        if (name != "") {
            this.onHide(name);
        }
    }

    fetchApiUserEachRequest = (data) => {
        if (data !== null && data !== undefined) {
            this.props.getUserKYCRequest(data.id).then(() => {

            })
        }
    }

    handleActionClick = (data, name, position) => {
        let state = {
            [`${name}`]: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }
        this.setState(state);
        this.setState({ btnDelete: false })
        if (data != "") {
            this.fetchApiUserEachRequest(data);
        }

    }

    renderFooter = (name, dialog) => {
        const { userInput } = this.state;
        if (dialog === 'filters') {
            return (
                <>
                    <Button disabled={userInput.kycStatus != null || userInput.criteria != null ? false : true} label="Apply" icon="pi pi-check" onClick={() => this.applyAdvFilters(name)} className="p-button-text p-button-sm" />
                    <Button disabled={userInput.kycStatus != null || userInput.criteria != null ? false : true} label="Clear" icon="pi pi-filter-slash" onClick={() => this.clearFilter(name)} className="p-button-sm p-button-danger" autoFocus />
                </>
            )
        }
        if (name === 'displayRejectPopUp') {
            return (<>
                <Button icon="pi pi-check" className="p-button-sm p-button-text" label="Submit" name="kycStatusMessage" value="apply" onClick={(e) => this.acceptUpdateMessageUserInfo(e)} />
                <Button icon="pi pi-times" className="p-button-sm p-button-danger" label="Cancel" name="kycStatusMessage" value="clear" onClick={() => this.clearUpdateMessageUserInfo()} />
            </>)
        }
        else {
            if (this.state.kycEachStatus.status === "REJECTED") {

            } else {
                return (<>
                    <Button icon="pi pi-check" label='Approved' className="p-button-success  p-button-sm" name="kycStatus" value="approved" onClick={() => this.acceptUpdateUserInfo()} />
                    <Button icon="pi pi-times" label='Rejected' className="p-button-danger  p-button-sm" name="kycStatus" value="rejected" onClick={() => this.handleActionClick('', 'displayRejectPopUp')} />
                </>)
            }
        }
    }

    acceptUpdateMessageUserInfo = () => {
        this.setState({ userInput: { comment: this.state.userInput.comment } })
        this.onHide('displayRejectPopUp')
        this.onHide('displayResponsive')
    }

    clearUpdateMessageUserInfo = () => {
        this.setState({ userInput: { comment: this.state.kycEachStatus.comments } })
        this.onHide('displayRejectPopUp')
    }

    acceptUpdateUserInfo = () => {
        this.setState({ confirmDialog: true })
    }

    onHide = (name) => {
        let state = { [`${name}`]: false };
        this.setState({ confirmDialog: false })
        this.setState(state);
    }

    acceptUpdate = () => {
        let temp = this.state.kycStatus
        if (this.state.displayResponsive === true) {
            this.onHide('displayResponsive')
        } else if (this.state.displayRejectPopUp === true) {
            this.onHide('displayRejectPopUp')
            this.onHide('displayResponsive')
        }
        if (this.state.btnDelete) {
            let obj = this.state.kycStatus.findIndex(i => i.id === this.state.kycEachStatus.id);
            temp.splice(obj, 1);
            console.log(temp, obj);
            this.setState({ kycStatus: temp, confirmDialog: false, btnDelete: false })
        }
    }

    rejectUpdate = () => {
        this.setState({ confirmDialog: false, btnDelete: false })
    }

    changeStatusValue = (event) => {
        this.state.kycEachStatus.status = event
        this.setState(this.state.kycEachStatus)
    }

    handleAdvFiltersChange = (e) => {
        let selectedFilters = [...this.state.advFilters];

        if (e.checked) {
            selectedFilters.push(e.value);
            if (e.value === 'statusFilter') {
                this.setState({ disableStatusFilter: false })
            } else if (e.value === 'dateFilter') {
                this.setState({ disableDateFilter: false })
            }
        }
        else {
            selectedFilters.splice(selectedFilters.indexOf(e.value), 1);
            if (e.value === 'statusFilter') {
                this.setState({ disableStatusFilter: true, status: null })
            } else if (e.value === 'dateFilter') {
                this.setState({ disableDateFilter: true })
            }
        }
        this.setState({ advFilters: selectedFilters });
    }

    applyAdvFilters = (name) => {
        const { advFilters, userInput } = this.state;
        if (advFilters.length > 0) {
            let filter = { filtering: {} }
            filter.filtering.status = userInput.kycStatus
            this.fetchRequests(filter)
            clearTimeout(this.state.timer)

            const newTimer = setTimeout(() => {
                this.fetchRequests(filter);
            }, 1000);
            this.setState({ timer: newTimer })
        }
        this.onHide(name);
    }

    formatDatePart = (partValue) => {
        return partValue < 10 ? "0" + partValue : partValue;
    }

    reqDateBodyTemplate = (rowData) => (
        new Date(rowData.updateDate).toLocaleDateString()
    )

    render() {
        return (
            <div>
                <div className='p-2'>
                    <DataTable id="DataTable"
                        value={this.state.kycStatus} header={this.renderHeader} paginator={true} rows={10} dataKey="id"
                        loading={this.state.loading} responsiveLayout="scroll" showGridlines
                        size="small" emptyMessage="No records found."
                    >
                        <Column field="person.firstName" header="First Name" sortable style={{ width: '30%' }} />
                        <Column field="person.lastName" header="Last Name" sortable style={{ width: '30%' }} />
                        <Column field="updateDate" header="Req Date" sortable body={this.reqDateBodyTemplate} style={{ width: '20%' }} />
                        <Column field="status" body={this.statusFormat} style={{ width: '10%' }} sortable header="Status" />
                        <Column body={this.actionTemplate} header="Actions" style={{ width: '10%' }} />
                    </DataTable>
                </div>
                <Dialog
                    header={"Id: " + this.state.kycEachStatus.id}
                    visible={this.state.displayResponsive}
                    onHide={() => this.onHide('displayResponsive')}
                    breakpoints={{ '960px': '75vw', '640px': '100vw' }}
                    style={{ width: '50vw' }}
                    footer={this.renderFooter('displayResponsive')}
                    draggable={false}
                    resizable={false} >

                    <div className='row mt-4'>
                        <div className="col-md-12 mb-4">
                            <span className="field-kyc-image">
                                <div className='card p-2'>
                                    <Image src={img}
                                        preview
                                        width="100%" height="400"
                                        className=""
                                        alt={img}
                                    />
                                </div>
                                <label className="field-kyc-label" htmlFor="age">User ID</label>
                            </span>
                        </div>

                        {this.state.kycEachStatus.status === "REJECTED" ? (<div className='row my-3'>
                            <div className="field col-md-12">
                                <span className="p-float-label">
                                    <InputTextarea className="p-inputtext-sm block w-100" id="comment" name="comment" rows={5} cols={30} value={this.state.userInput.comment != undefined ? this.state.userInput.comment : this.state.kycEachStatus.comments} onChange={(e) => this.handleChange(e)} />
                                    <label htmlFor="comment">Comment</label>
                                </span>
                            </div>
                        </div>) : null}
                    </div>
                </Dialog>
                <Dialog
                    header="Advanced filters"
                    visible={this.state.displayPosition}
                    position={this.state.position}
                    modal
                    style={{ width: '20vw' }}
                    footer={this.renderFooter('displayPosition', 'filters')}
                    onHide={() => this.onHide('displayPosition')}
                    draggable={false}
                    resizable={false}
                >
                    <>
                        <div className="row">
                            <div className="col-md-12 d-flex align-items-center mb-3">
                                <Checkbox inputId="statusFilter" name="statusFilter" value="statusFilter" onChange={this.handleAdvFiltersChange} className="me-3" checked={this.state.advFilters.indexOf('statusFilter') !== -1} />
                                <Dropdown className="p-inputtext-sm w-100" disabled={this.state.disableStatusFilter} value={this.state.userInput.kycStatus} name='kycStatus' options={this.state.statusOptions} onChange={this.handleChange} optionLabel="name" placeholder="Select Status" />
                            </div>
                            <div className="col-md-12 d-flex align-items-center">
                                <Checkbox inputId="dateFilter" name="dateFilter" value="dateFilter" onChange={this.handleAdvFiltersChange} className="me-3" checked={this.state.advFilters.indexOf('dateFilter') !== -1} />
                                <Dropdown placeholder="Select a value" className="p-inputtext-sm block w-100" disabled={this.state.disableDateFilter} value={this.state.userInput.criteria} name="criteria" options={this.state.dateFilters} optionLabel="name" onChange={this.handleChange} />
                            </div>
                            <div hidden={this.state.active} id='dateFields' className="col-md-12 mt-3">
                                <Calendar className="p-inputtext-sm block me-2" name="startDate" disabled={this.state.active} value={this.state.dateCriteria.startDate} placeholder={this.state.dateCriteria.displayStartDate} onChange={this.handleChange} dateFormat="dd-mm-yy" />
                                <Calendar className="p-inputtext-sm block ms-2" name="endDate" disabled={this.state.active} value={this.state.dateCriteria.endDate} placeholder={this.state.dateCriteria.displayEndDate} onChange={this.handleChange} dateFormat="dd-mm-yy" />
                            </div>
                        </div>
                    </>
                </Dialog>
                <Dialog
                    header="Comments"
                    visible={this.state.displayRejectPopUp}
                    breakpoints={{ '960px': '75vw', '640px': '100vw' }}
                    modal
                    style={{ width: '30vw', height: '50vh' }}
                    footer={this.renderFooter('displayRejectPopUp')}
                    onHide={() => this.onHide('displayRejectPopUp')}
                    draggable={false}
                    resizable={false}
                >
                    <div className='row my-3'>
                        <div className="field col-md-12">
                            <span className="p-float-label">
                                <InputTextarea className="p-inputtext-sm block w-100" id="comment" name="comment" rows={5} cols={30} value={this.state.userInput.comment != undefined ? this.state.userInput.comment : this.state.kycEachStatus.comments} onChange={(e) => this.handleChange(e)} />
                                <label htmlFor="comment">Comment</label>
                            </span>
                        </div>
                    </div>
                </Dialog>
                <ConfirmDialog draggable={false} resizable={false} visible={this.state.confirmDialog} onHide={this.rejectUpdate} message={this.state.btnDelete ? "Are you sure you want to delete?" : "Are you sure you want to submit?"}
                    header="Confirmation" icon="pi pi-exclamation-triangle" accept={() => this.acceptUpdate()} reject={() => this.rejectUpdate()} />
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        allKycRequests: state.kycDetails.allKycRequests,
        userKycRequest: state.kycDetails.userKycRequest,
        error: state.kycDetails.error
    };
};
const mapDispatchToProps = {
    getAllKYCRequests,
    getUserKYCRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(KycRequestsList);