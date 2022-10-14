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
import { getAllKYCRequests, getUserKYCRequest, updateUserKYC } from '../../actions/kyc';
import { Checkbox } from 'primereact/checkbox';
import './KycRequestsList.css';
import img from "../../assets/images/1001Id.jpg";
import DataGrid from '../common/DataGrid';
import loader from '../../assets/loaders/rickshawLoading.gif';
import '../App.scss'

class KycRequestsList extends React.Component {
    constructor() {
        super();
        this.state = {
            allKYCData: [],
            globalFilterValue: "",
            loading: true,
            position: false,
            displayPosition: false,
            displayResponsive: false,
            kycData: {},
            statusOptions: [{ name: 'APPROVED', value: 'APPROVED' }, { name: 'PENDING', value: 'PENDING' }, { name: 'REJECTED', value: 'REJECTED' }],
            confirmDialog: false,
            idDatePickerHidden: true,
            displayRejectPopUp: false,
            userInput: {},
            dateFilters: [{ name: "Today" }, { name: "Yesterday" }, { name: "Custom" }],
            advFilters: [],
            dateCriteria: { displayStartDate: "Start Date", startDate: "", endDate: "", displayEndDate: "End Date" },
            disableStatusFilter: true,
            disableDateFilter: true,
            timer: null,
            dialog: '',
            loaderShow: false
        };
        this.columns = [
            { field: "person.firstName", header: "First Name", style: { width: '30%' } },
            { field: 'person.lastName', header: 'Last Name', style: { width: '30%' } },
            { field: 'updateDate', header: 'Req Date', body: this.customBodyTemplate, style: { width: '20%' } },
            { field: 'status', header: 'Status', body: this.customBodyTemplate, bodyStyle: { textAlign: 'center' }, style: { width: '10%' } },
            { field: 'actions', header: 'Actions', body: this.customBodyTemplate, bodyStyle: { textAlign: 'center' }, style: { width: '10%' } }
        ];
    }

    componentDidMount() {
        this.setState({ loaderShow: true })
        this.fetchAllKYCRequests("");
    }

    componentDidUpdate(prevState) {
        if (this.props.userKYCRequest !== prevState.userKYCRequest) {
            this.setState({ kycData: this.props.userKYCRequest })
        }
    }

    fetchAllKYCRequests = (data) => {
        if (data !== "") {
            this.props.getAllKYCRequests(data).then(() => {
                this.setState({ loading: false, allKYCData: this.props.allKycRequests, loaderShow: false })
            })
        } else {
            this.props.getAllKYCRequests().then(() => {
                this.setState({ loading: false, allKYCData: this.props.allKycRequests, loaderShow: false })
            })
        }
    }

    updateKYCStatus = (args) => {
        if (args.action === 'approve') {
            this.props.updateUserKYC(args).then(() => {
                this.onHide('displayResponsive')
            }).then(() => {
                this.fetchAllKYCRequests("");
            });
        } else {
            this.props.updateUserKYC(args).then(() => {
                this.onHide('displayRejectPopUp')
            }).then(() => {
                this.fetchAllKYCRequests("");
            });
        }
    }

    customBodyTemplate = (rowData, col) => (
        col.field === 'updateDate' ? <span>{new Date(rowData.updateDate).toLocaleDateString()}</span> :
            col.field === 'status' ? rowData.status === 'APPROVED' ? <Badge value={rowData.status} severity="success" /> :
                rowData.status === 'PENDING' ? <Badge value={rowData.status} severity="warning" /> :
                    <Badge value={rowData.status} severity="danger" /> :
                <div className="col-md-12">
                    <Button className="p-button-rounded p-button-info p-button-sm" disabled={rowData.status === "APPROVED" ? true : false} onClick={() => this.handleActionClick(rowData, 'displayResponsive')} >
                        <i className="pi pi-pencil" style={{ fontSize: "1em" }}></i>
                    </Button>
                </div>
    )

    handleChange = (e) => {
        const { userInput, dateCriteria } = this.state;
        const { name, value } = e.target;
        if (value.name === "Custom" || name === 'startDate' || name === 'endDate') {
            this.setState({ idDatePickerHidden: false })
            let dateElement = document.getElementById('dateFields');
            dateElement.classList.add('d-flex')
        }
        else {
            this.setState({ idDatePickerHidden: true })
        }
        name === "startDate" ?
            this.setState({ userInput: { ...userInput, [name]: this.formatDatePart(value.getFullYear()) + "-" + this.formatDatePart(value.getMonth() + 1) + "-" + this.formatDatePart(value.getDate()) } })
            : name === "endDate" ?
                this.setState({ userInput: { ...userInput, [name]: this.formatDatePart(value.getFullYear()) + "-" + this.formatDatePart(value.getMonth() + 1) + "-" + this.formatDatePart(value.getDate()) } })
                : this.setState({ userInput: { ...userInput, [name]: value } })
        this.setState({ dateCriteria, filterActive: false, userInput: { ...userInput, [name]: value } })
    }

    renderHeader = () => (
        <div className="d-flex justify-content-end">
            {/* <div className="d-flex justify-content-between">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={this.state.globalFilterValue} name="searchInput" onChange={(e) => this.onGlobalFilterChange(e)} placeholder="Search" className="p-inputtext-sm block global-search-input" />
                </span>
            </div> */}
            <div>
                <Button type="button" icon="pi pi-filter" label="Advanced Filters" className="p-button-outlined p-button-sm me-2" onClick={() => this.handleActionClick("filterDialog", 'displayPosition', 'top-right')} />
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined p-button-sm p-button-danger" onClick={() => this.clearFilter("")} />
            </div>
        </div>
    )

    // onGlobalFilterChange = (e) => {
    //     const { value } = e.target
    //     let filter = { filtering: {} };
    //     filter.filtering.searchText = value
    //     clearTimeout(this.state.timer)

    //     const newTimer = setTimeout(() => {
    //         this.fetchAllKYCRequests(filter);
    //     }, 1000);

    //     this.setState({ timer: newTimer, globalFilterValue: value })
    // }

    clearFilter = (name) => {
        this.fetchAllKYCRequests("")
        this.setState({ disableDateFilter: true, disableStatusFilter: true, globalFilterValue: "", advFilters: [], userInput: { allKYCData: null, criteria: null }, idDatePickerHidden: true })
        if (name != "") {
            this.onHide(name);
        }
    }

    fetchKYCDetailsById = (data) => {
        if (data !== null && data !== undefined) {
            this.props.getUserKYCRequest(data.id).then(() => {
                this.setState({ kycData: this.props.userKycRequest })
            })
        }
    }

    handleActionClick = (data, name, position) => {
        this.setState({ dialog: '' })
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
        if (typeof (data) != 'string') {
            this.setState({ dialog: 'editDialog' })
            this.fetchKYCDetailsById(data);
        } else if (data === "filterDialog") {
            this.setState({ dialog: 'filterDialog' })
        } else {
            this.setState({ dialog: 'rejectionDialog' })
        }
    }


    renderFooter = (name) => {
        const { userInput, kycData } = this.state;
        return name === 'displayPosition' ?
            <>
                <Button disabled={userInput.kycStatus != null || userInput.criteria != null ? false : true} label="Apply" icon="pi pi-check" onClick={() => this.applyAdvFilters(name)} className="p-button-text p-button-sm" />
                <Button disabled={userInput.kycStatus != null || userInput.criteria != null ? false : true} label="Clear" icon="pi pi-filter-slash" onClick={() => this.clearFilter(name)} className="p-button-sm p-button-danger" autoFocus />
            </> :
            name === 'displayRejectPopUp' ?
                <>
                    <Button icon="pi pi-check" className="p-button-sm p-button-text" label="Submit" onClick={this.submitKYCRejection} />
                    <Button icon="pi pi-times" className="p-button-sm p-button-danger" label="Cancel" onClick={() => this.setState({ displayRejectPopUp: false, dialog: 'editDialog' })} />
                </> :
                name === 'displayResponsive' ?
                    kycData.status !== 'REJECTED' ?
                        <>
                            <Button icon="pi pi-check" label='Approve' className="p-button-success  p-button-sm" name="kycStatus" value="approved" onClick={() => this.setState({ confirmDialog: true })} />
                            <Button icon="pi pi-times" label='Reject' className="p-button-danger  p-button-sm" name="kycStatus" value="rejected" onClick={() => this.handleActionClick('rejectionDialog', 'displayRejectPopUp')} />
                        </> :
                        null
                    : null
    }

    submitKYCRejection = () => {
        let requestData = {};
        requestData.id = this.state.kycData.id;
        requestData.action = 'reject';
        requestData.comments = this.state.userInput.comment;
        this.updateKYCStatus(requestData);
    }

    onHide = (name) => {
        let state = { [`${name}`]: false };
        this.setState(state);
    }

    acceptUpdate = () => {
        if (this.state.kycDataStatus != {}) {
            let data = {};
            data.id = this.state.kycData.id;
            data.action = 'approve';
            data.comments = 'Approved'
            this.updateKYCStatus(data);
        }
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
            this.fetchAllKYCRequests(filter)
            clearTimeout(this.state.timer)

            const newTimer = setTimeout(() => {
                this.fetchAllKYCRequests(filter);
            }, 1000);
            this.setState({ timer: newTimer })
        }
        this.onHide(name);
    }

    formatDatePart = (partValue) => {
        return partValue < 10 ? "0" + partValue : partValue;
    }

    render() {
        const { dialog, kycData, displayPosition, displayRejectPopUp, displayResponsive, position, disableStatusFilter,
            userInput, statusOptions, advFilters, idDatePickerHidden, dateCriteria, confirmDialog, allKYCData, loading } = this.state;
        return (
            <>
                {this.state.loaderShow ?
                    <div className='bg-transparent w-100 h-100 d-flex justify-content-center align-items-center'>
                        <img src={loader} width='20%' />
                    </div> :
                    <div>
                        <div className='p-2'>
                            <DataGrid
                                columns={this.columns}
                                value={allKYCData}
                                responsiveLayout="scroll"
                                emptyMessage="No records found."
                                rows={10}
                                dataKey="id"
                                loading={loading}
                                showGridlines={true}
                                size="small"
                                header={this.renderHeader}
                            />
                        </div>
                        {dialog !== '' ?
                            <Dialog
                                header={dialog === 'filterDialog' ? "Advanced filters" : dialog === 'rejectionDialog' ? 'Comments' : "Id: " + kycData.id}
                                visible={dialog === 'filterDialog' ? displayPosition : dialog === 'rejectionDialog' ? displayRejectPopUp : displayResponsive}
                                onHide={() => this.onHide(dialog === 'filterDialog' ? 'displayPosition' : dialog === 'rejectionDialog' ? 'displayRejectPopUp' : 'displayResponsive')}
                                position={dialog === 'filterDialog' ? position : null}
                                breakpoints={{ '960px': '75vw', '640px': '100vw' }}
                                style={dialog === 'filterDialog' ? { width: '20vw' } : dialog === 'rejectionDialog' ? { width: '30vw', height: '50vh' } : { width: '50vw' }}
                                footer={this.renderFooter(dialog === 'filterDialog' ? 'displayPosition' : dialog === 'rejectionDialog' ? 'displayRejectPopUp' : 'displayResponsive')}
                                draggable={false}
                                resizable={false}
                            >
                                {dialog === 'filterDialog' ?
                                    <div className="row">
                                        <div className="col-md-12 d-flex align-items-center mb-3">
                                            <Checkbox inputId="statusFilter" name="statusFilter" value="statusFilter" onChange={this.handleAdvFiltersChange} className="me-3" checked={advFilters.indexOf('statusFilter') !== -1} />
                                            <Dropdown className="p-inputtext-sm w-100" disabled={disableStatusFilter} value={userInput.kycStatus} name='kycStatus' options={statusOptions} onChange={this.handleChange} optionLabel="name" placeholder="Select Status" />
                                        </div>
                                        {/* <div className="col-md-12 d-flex align-items-center">
                                    <Checkbox inputId="dateFilter" name="dateFilter" value="dateFilter" onChange={this.handleAdvFiltersChange} className="me-3" checked={this.state.advFilters.indexOf('dateFilter') !== -1} />
                                    <Dropdown placeholder="Select a value" className="p-inputtext-sm block w-100" disabled={this.state.disableDateFilter} value={this.state.userInput.criteria} name="criteria" options={this.state.dateFilters} optionLabel="name" onChange={this.handleChange} />
                                </div> */}
                                        <div hidden={idDatePickerHidden} id='dateFields' className="col-md-12 mt-3">
                                            <Calendar className="p-inputtext-sm block me-2" name="startDate" disabled={idDatePickerHidden} value={dateCriteria.startDate} placeholder={dateCriteria.displayStartDate} onChange={this.handleChange} dateFormat="dd-mm-yy" />
                                            <Calendar className="p-inputtext-sm block ms-2" name="endDate" disabled={idDatePickerHidden} value={dateCriteria.endDate} placeholder={dateCriteria.displayEndDate} onChange={this.handleChange} dateFormat="dd-mm-yy" />
                                        </div>
                                    </div> :
                                    dialog === 'rejectionDialog' ?
                                        <div className='row my-3'>
                                            <div className="field col-md-12">
                                                <span className="p-float-label">
                                                    <InputTextarea className="p-inputtext-sm block w-100" id="comment" name="comment" rows={5} cols={30} value={userInput.comment != undefined ? userInput.comment : kycData.comments} onChange={(e) => this.handleChange(e)} />
                                                    <label htmlFor="comment">Comment</label>
                                                </span>
                                            </div>
                                        </div> :
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
                                            {kycData.status === "REJECTED" ?
                                                <div className="field col-md-12 my-3">
                                                    <span className="p-float-label">
                                                        <InputTextarea className="p-inputtext-sm block w-100" id="comment" name="comment" rows={3} value={userInput.comment != undefined ? userInput.comment : kycData.comments} onChange={(e) => this.handleChange(e)} />
                                                        <label htmlFor="comment">Comment</label>
                                                    </span>
                                                </div>
                                                : null}
                                        </div>
                                }
                            </Dialog> : null
                        }
                        <ConfirmDialog draggable={false} resizable={false} visible={confirmDialog} onHide={() => this.onHide('confirmDialog')} message="Are you sure you want to submit?"
                            header="Confirmation" icon="pi pi-exclamation-triangle" accept={() => this.acceptUpdate()} />
                    </div>
                }
            </>
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
    getUserKYCRequest,
    updateUserKYC
};

export default connect(mapStateToProps, mapDispatchToProps)(KycRequestsList);