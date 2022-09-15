import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { updateLedger } from '../../actions/getLedgerDetail';

class CreditModal extends Component {
    constructor() {
        super();
        this.state = {
            active: true,
            userInput: {},
            confirmDialog: false,
        }
    }

    closeModal = () => {
        this.setState({ active: true })
        this.props.hideModal();
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
        this.setState({ confirmDialog: true, active: true })
    }

    acceptUpdate = () => {
        let body = this.state.userInput;
        body.id = this.props.rowData.id;
        this.props.updateLedger(body);
        this.closeModal();
        this.props.fetchLedgerByType("");
    }

    editMode = () => {
        this.setState({ active: false })
    }

    rejectUpdate = () => {
        this.setState({ confirmDialog: false })
    }

    dialogHeader = () => (
        <>
            <div className="d-flex justify-content-between align-items-center pe-3">
                <h4 className="text-light mb-0">Credit Details</h4>
            </div>
        </>
    )

    dialogFooter = () => (
        <div>
            {this.state.active === false ?
                <Button className="p-button-success  p-button-sm me-0" onClick={this.submit} label="Save"></Button> :
                null}
        </div>
    )

    render() {
        return (
            <Dialog footer={this.dialogFooter} header={this.dialogHeader} draggable={false} visible={this.props.showModal} onHide={this.props.hideModal} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '30vw' }}>
                <div className='row'>
                    <div className='col-md-12 text-end py-3'>
                        <Button icon="pi pi-pencil" className="p-button-light p-button-outlined p-button-sm ms-2" onClick={this.editMode} />
                    </div>
                    <div className='col-md-12'>
                        <div className="p-fluid ">
                            <div className="field mb-4">
                                <span className="p-float-label">
                                    {this.state.active === false ?
                                        <Calendar disabled={this.state.active} className="p-inputtext-sm block " id="date" value={this.props.rowData.transDate} placeholder={this.props.rowData.transDate} name="transDate" onChange={this.handleChange} dateFormat="mm-dd-yy" />
                                        : <InputText readOnly className='p-inputtext-sm block' defaultValue={this.props.rowData.transDate} />}
                                    <label htmlFor="date">Date</label>
                                </span>
                            </div>
                            <div className="field mb-4">
                                <span className="p-float-label">
                                    <InputText className="p-inputtext-sm block " id="comments" readOnly={this.state.active} defaultValue={this.props.rowData.comments} name="comments" onChange={this.handleChange} />
                                    <label htmlFor="comments">Comments</label>
                                </span>
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText className="p-inputtext-sm block " id="transAmount" readOnly={this.state.active} defaultValue={this.props.rowData.transAmount} name="transAmount" onChange={this.handleChange} />
                                    <label htmlFor="amount">Amount</label>
                                </span>
                            </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(CreditModal);