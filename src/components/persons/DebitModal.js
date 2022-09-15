import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { updateLedger } from '../../actions/getLedgerDetail';

class DebitModal extends Component {
    constructor() {
        super();
        this.state = {
            userInput: {},
            active: true,
            autoFocus: false,
        }
    }

    handleChange = (event) => {
        const { userInput } = this.state;
        const { name, value } = event.target;
        this.setState({
            userInput: {
                ...userInput,
                [name]: value
            }
        })
    }

    submit = () => {
        this.setState({ confirmDialog: true, active: true, autoFocus: false, userInput: this.state.userInput })
    }

    acceptUpdate = () => {
        let body = this.state.userInput;
        body.id = this.props.rowData.id;
        this.props.updateLedger(body);
        this.closeModal();
        this.props.fetchLedgerByType("")
    }

    rejectUpdate = () => {
        this.setState({ confirmDialog: false })
    }

    closeModal = () => {
        this.props.hideModal()
    }

    editMode = () => {
        let inputField = document.getElementById("amount");
        inputField.focus();
        inputField.classList.add("focus-background");
        this.setState({ active: false, autoFocus: true });
    }

    tableFooter = () => (
        <div>
            {this.state.active === false ?
                <Button className="p-button-success  p-button-sm me-0" onClick={this.submit} label="Save"></Button> :
                null}
        </div>
    )

    tableHeader = () => (
        <div className="d-flex justify-content-between align-items-center pe-3">
            <h4 className="text-light mb-0">Debit Details</h4>
        </div>
    )

    render() {
        return (
            <Dialog draggable={false} resizable={false} footer={this.tableFooter} header={this.tableHeader} visible={this.props.showModal} onHide={this.props.hideModal} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '30vw' }}>
                <div className='row'>
                    <div className='col-md-12 text-end py-3'>
                        <Button icon="pi pi-pencil" className="p-button-light p-button-outlined p-button-sm ms-2" onClick={this.editMode} />
                    </div>
                    <div className='col-md-12'>
                        <div className="p-fluid ">
                            <div className="field mb-4">
                                <span className="p-float-label">
                                    <InputText readOnly className='p-inputtext-sm block' value={this.props.rowData.transDate} ></InputText>
                                    {/* <Calendar disabled={true} value={new Date(this.props.dataRow.date)} placeholder={this.props.dataRow.date} name="date" onChange={this.handleChange} dateFormat="dd-mm-yy" /> */}
                                    <label htmlFor="date">Date</label>
                                </span>
                            </div>
                            <div className="field mb-4">
                                <span className="p-float-label">
                                    <InputText readOnly className="p-inputtext-sm block " id="comments" defaultValue={this.props.rowData.comments} name="comments" onChange={this.handleChange} />
                                    <label htmlFor="comments">Comments</label>
                                </span>
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText readOnly={this.state.active} className="p-inputtext-sm block " id="amount" defaultValue={this.props.rowData.transAmount} name="transAmount" onChange={this.handleChange} />
                                    <label htmlFor="amount">Amount</label>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-12'>
                        <h6 className='mt-1'>Details</h6>
                        <div className="card">
                            <DataTable size="small" columnResizeMode="fit" showGridlines responsiveLayout="scroll">
                                <Column header="Ride" />
                                <Column header="Source" />
                                <Column header="Destination" />
                                <Column header="Amount" />
                                <Column header="Commision" />
                            </DataTable>
                        </div>
                    </div>
                </div>
                <ConfirmDialog draggable={false} resizable={false} visible={this.state.confirmDialog} onHide={this.rejectUpdate} message="Are you sure you want to proceed?"
                    header="Confirmation" icon="pi pi-exclamation-triangle" accept={this.acceptUpdate} reject={this.rejectUpdate} />
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}
const mapDispatchToProps = {
    updateLedger
}

export default connect(mapStateToProps, mapDispatchToProps)(DebitModal);