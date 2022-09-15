import { Dialog } from "primereact/dialog";
import React from "react";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import DebitModal from "./DebitModal";
import CreditModal from "./CreditModal";
import { connect } from "react-redux";
import { getLedgerById, getLedgers } from "../../actions/getLedgerDetail";

class Financial extends React.Component {
    constructor() {
        super();
        this.state = {
            dateFilters: [{ name: "Yesterday" }, { name: "Last 7 Days" }, { name: "Last Month" }, { name: "This Month" }, { name: "Custom" }],
            userInput: {},
            dateCriteria: { displayStartDate: "Start Date", startDate: "", endDate: "", displayEndDate: "End Date" },
            active: true,
            tableData: [],
            selectedRow: {},
            filterActive: true,
            rowData: {}
        }
    }

    fetchLedgerByType = (filters) => {
        if (filters != "") {
            filters.id = "10000001"
            this.props.getLedgers(filters);
        } else {
            let data = {};
            data.id = "10000001";
            this.props.getLedgers(data);
        }
    }

    componentDidMount() {
       // this.fetchLedgerByType("");
    }

    formatDatePart = (partValue) => {
        return partValue < 10 ? "0" + partValue : partValue;
    }

    handleChange = (event) => {
        const { userInput, dateCriteria } = this.state;
        const { name, value } = event.target;
        if (value.name === "Custom" || name === "startDate" || name === "endDate") {
            this.setState({ active: false })
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
    }

    handleActionClick(row, name, position) {
        // if (row !== undefined) {
        //     let id = row.id
        //     this.props.getLedgerById(id).then(() => {
        //         this.setState({ rowData: this.props.ledgerById, editRowModal: true })
        //     })
        // }
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
    }

    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
    }

    searchData = () => {
        const { userInput } = this.state;
        let filters = { filterCriteria: {} };
        if (userInput.criteria.name === "Custom") {
            filters.filterCriteria.type = "CUSTOM_RANGE";
            filters.filterCriteria.startDate = userInput.startDate
            filters.filterCriteria.endDate = userInput.endDate
        }
        if (userInput.criteria.name === "Yesterday") {
            filters.filterCriteria.type = "YESTERDAY";
        }
        if (userInput.criteria.name === "Last 7 Days") {
            filters.filterCriteria.type = "LAST_7_DAYS";
        }
        if (userInput.criteria.name === "This Month") {
            filters.filterCriteria.type = "THIS_MONTH";
        }
        if (userInput.criteria.name === "Last Month") {
            filters.filterCriteria.type = "LAST_MONTH";
        }
       // this.fetchLedgerByType(filters);
        console.log(filters)
    }

    clearFilter = () => {
        const { userInput } = this.state;
        userInput.criteria = ""
        this.fetchLedgerByType("")
        this.setState({ tableData: this.state.cloneData, filterActive: true, userInput, active: true });
    }

    actionButton = (e) => (
        <Button className="p-button-light p-button-rounded  p-button-sm ms-2" onClick={() => this.handleActionClick(e, 'editRowModal')}><i className="pi pi-book"></i></Button>
    )

    hideModals = () => {
        this.setState({ editRowModal: false })
    }

    dialogHeader = () => (
        <div className="d-flex justify-content-between align-items-center pe-3">
            <h4 className="text-light mb-0">Financial Details</h4>
        </div>
    )

    customBody = (rowData, col) => {
        if (col.field === 'field_2') {
            return rowData.transType === "DEBIT" ? <span>{rowData.transAmount}</span> : null
        } else if (col.field === 'field_3') {
            return rowData.transType == "CREDIT" ? <span>{rowData.transAmount}</span> : null
        }
    }

    render() {
        return (
            <Dialog className="main-dialog" header={this.dialogHeader} draggable={false} resizable={false} visible={this.props.modal} onHide={this.props.onHide} modal breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '70vw' }}>
                <div className="row g-0">
                    <div className="col-md-12 pt-3 pb-2">
                        <Dropdown placeholder="Select a value" className="p-inputtext-sm block me-2 mt-1" value={this.state.userInput.criteria} name="criteria" options={this.state.dateFilters} optionLabel="name" onChange={this.handleChange} />
                        <div hidden={this.state.active} className="col-md-4 row">
                            <Calendar className="p-inputtext-sm block me-2 mt-1" name="startDate" value={this.state.dateCriteria.startDate} placeholder={this.state.dateCriteria.displayStartDate} onChange={this.handleChange} dateFormat="dd-mm-yy" />
                            <Calendar className="p-inputtext-sm block me-2 mt-1" name="endDate" value={this.state.dateCriteria.endDate} placeholder={this.state.dateCriteria.displayEndDate} onChange={this.handleChange} dateFormat="dd-mm-yy" />
                        </div>
                        <Button className="p-button-light p-button-sm me-2 mt-1" icon="pi pi-filter" disabled={this.state.filterActive} onClick={this.searchData} />
                        <Button icon="pi pi-filter-slash" className="p-button-light p-button-sm me-2 mt-1" disabled={this.state.filterActive} label="clear" onClick={this.clearFilter}></Button>
                    </div>
                    <div className="col-md-12 pb-2">
                        <span className="">Balance:- <label className="fw-bold" disabled={true}> {this.state.totalBalance}</label>
                            {/* <InputText className="p-inputtext-sm block " id="balance" name="balance" disabled={true} defaultValue={this.state.totalBalance} /> */}
                        </span>
                    </div>

                    <div className="card">
                        <DataTable value={this.props.ledger.data != undefined ? this.props.ledger.data : this.props.ledger} size="small" columnResizeMode="fit" showGridlines responsiveLayout="scroll">
                            <Column field="transDate" header="Date" style={{ width: '15%' }} />
                            <Column field="comments" header="Comments" style={{ width: '35%' }} />
                            <Column body={this.customBody} header="Debit" style={{ width: '10%' }} />
                            <Column body={this.customBody} header="Credit" style={{ width: '15%' }} />
                            <Column body={(e) => this.actionButton(e)} header="Action" style={{ width: '15%' }} />
                        </DataTable>
                    </div>
                </div>

                {this.props.ledgerById.transType === "DEBIT" ?
                    <DebitModal rowData={this.state.rowData}
                        fetchLedgerByType={this.fetchLedgerByType}
                        showModal={this.state.editRowModal}
                        hideModal={this.hideModals}
                    />
                    : this.props.ledgerById.transType === "CREDIT" ?
                        <CreditModal rowData={this.state.rowData}
                            fetchLedgerByType={this.fetchLedgerByType}
                            showModal={this.state.editRowModal}
                            hideModal={this.hideModals}
                        />
                        : null}
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ledgerById: state.getLedger.ledgerById,
        ledger: state.getLedger.ledger
    }
}
const mapDispatchToProps = {
    getLedgerById,
    getLedgers
}

export default connect(mapStateToProps, mapDispatchToProps)(Financial);