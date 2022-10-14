import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Image } from 'primereact/image';
import { InputTextarea } from 'primereact/inputtextarea';
import { updateUserKYC } from '../../actions/kyc';
import img from "../../assets/images/galleria7.jpg";

class KycModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: {},
            displayResponsive: false
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            userInput: {
                ...this.state.userInput, [name]: value
            }
        })
    }

    closePopup = () => {
        this.props.hideDialog();
    }

    tableFooter = () => (
        this.props.kycRequestData.status === "PENDING" ?
            <>
                <Button icon="pi pi-check" label='Approve' className="p-button-success  p-button-sm" name="kycStatus" value="approved" onClick={() => this.updateKYCStatus('approve')} />
                <Button icon="pi pi-times" label='Reject' className="p-button-danger  p-button-sm" name="kycStatus" value="rejected" onClick={() => this.updateKYCStatus('reject')} />
            </> : null
    )

    tableHeader = () => (
        <div className="d-flex justify-content-between align-items-center pe-3">
            <h4 className="text-light mb-0">KYC Status</h4>
        </div>
    )

    componentDidMount() {
        this.setState({
            userInput: {
                ...this.state.userInput, comment: this.props.kycRequestData.comments
            }
        })
    }

    updateKYCStatus = (args) => {
        if (args === 'reject') {
            this.setState({ displayResponsive: true })
        } else {
            let data = {};
            data.id = this.props.kycRequestData.id;
            data.action = args;
            data.comments = 'Approved'
            this.props.updateUserKYC(data).then(() => {
                this.closePopup();
            });
        }
    }

    acceptConfirmDelete = () => {
        let data = {};
        data.id = this.props.kycRequestData.id;
        data.action = 'reject'
        data.comments = this.state.userInput.comment
        this.props.updateUserKYC(data).then(() => {
            this.closePopup();
        });
    }

    onHide = (name) => {
        this.setState({
            [`${name}`]: false
        });
    }

    render() {
        return (
            <div>
                <Dialog header={this.tableHeader} footer={this.tableFooter} visible={this.props.modal} draggable={false} onHide={this.closePopup} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }}>
                    <div className='row mt-4'>
                        <div className="col-md-12 mb-4">
                            <span className="field-kyc-image">
                                <div className='card p-2'>
                                    <Image src={img}
                                        preview
                                        width="100%" height="400"
                                        alt={"User ID"}
                                        className=""
                                    />
                                </div>
                                <label className="field-kyc-label" htmlFor="age">User ID</label>
                            </span>
                        </div>
                        {this.props.kycRequestData.status === "REJECTED" ?
                            <div className="field col-md-12 my-3 ">
                                <span className="p-float-label">
                                    <InputTextarea className="p-inputtext-sm block w-100" id="comment" readOnly name="comment" value={this.state.userInput.comment} onChange={this.handleChange} rows={3} cols={30} />
                                    <label htmlFor="comment">Comment</label>
                                </span>
                            </div>
                            : null}
                    </div>
                </Dialog>
                <ConfirmDialog
                    header="Rejection confirmation"
                    message={
                        <div>
                            <br />
                            <div className="field col-md-12 ">
                                <span className="p-float-label">
                                    <InputTextarea className="p-inputtext-sm block w-100" id="comment" name="comment" value={this.state.userInput.comment} onChange={this.handleChange} rows={3} cols={30} />
                                    <label htmlFor="comment">Reason for rejection</label>
                                </span>
                            </div>
                            <hr />
                            <span className='d-flex align-items-center'>
                                <i className="pi pi-exclamation-triangle me-3"></i> Are you sure you want to proceed?
                            </span>
                        </div>

                    }
                    visible={this.state.displayResponsive}
                    accept={this.acceptConfirmDelete}
                    onHide={() => this.onHide('displayResponsive')}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userKycRequest: state.kycDetails.userKycRequest,
        error: state.kycDetails.error
    };
};
const mapDispatchToProps = {
    updateUserKYC
};

export default connect(mapStateToProps, mapDispatchToProps)(KycModal);