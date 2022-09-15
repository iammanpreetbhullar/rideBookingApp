import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import { Image } from 'primereact/image';
import React, { Component } from 'react'
import img from "../../assets/images/galleria7.jpg";
import { InputTextarea } from 'primereact/inputtextarea';

class KycModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: {},
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
        this.props.status === "PENDING" ?
            <>
                <Button icon="pi pi-check" label='Approved' className="p-button-success  p-button-sm" name="kycStatus" value="approved" />
                <Button icon="pi pi-times" label='Rejected' className="p-button-danger  p-button-sm" name="kycStatus" value="rejected" />
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
                ...this.state.userInput, comment: this.props.comment
            }
        })
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
                        {this.props.status === "PENDING" ?
                            <div className="field col-md-12 ">
                                <span className="p-float-label">
                                    <InputTextarea className="p-inputtext-sm block w-100" id="comment" name="comment" value={this.state.userInput.comment} onChange={this.handleChange} rows={3} cols={30} />
                                    <label htmlFor="comment">Comment</label>
                                </span>
                            </div>
                            : this.props.status === "REJECTED" ?
                                <div className="field col-md-12 ">
                                    <span className="p-float-label">
                                        <InputTextarea className="p-inputtext-sm block w-100" id="comment" readOnly name="comment" value={this.state.userInput.comment} onChange={this.handleChange} rows={3} cols={30} />
                                        <label htmlFor="comment">Comment</label>
                                    </span>
                                </div>
                                : null}
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default KycModal;