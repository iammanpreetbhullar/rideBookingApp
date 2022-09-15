import React from "react";
import { connect } from "react-redux";
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import Financial from "./Financials";
import { Badge } from 'primereact/badge';
import { ToggleButton } from 'primereact/togglebutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton } from 'primereact/selectbutton';
import { getUser, updateUser } from "../../actions/getUser";
import { getAllKYCRequests, getUserKYCRequest } from "../../actions/kyc";
import { getBrands, getBrandModels } from "../../actions/brands";
import { getDistricts } from "../../actions/getDistricts";
import { updateVehicle } from "../../actions/vehicle";
import img from "../../assets/images/galleria7.jpg";
import KycModal from "./KycModal";

class PersonDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: {},
            rideOptions: [{ name: "Special Ride", value: "specialRide" }, { name: "Normal Ride", value: "normalRide" }],
            activeIndex: 0,
            editMode: true,
            kycStatus: ["Approved,Rejected"],
            kycModal: false,
            brand: null,
            model: null,
            district: null,
            rideType: [],
            normalRide: false,
            specialRide: false,
            vehicleData: {},
            apiBody: {},
            personData: { kycReqId: null, kycComment: null, kycProof: null, },
            userKyc: {},
            userData: {},
            accStatusDisable: true
        }
    }

    fetchUserKycStatus = (id) => {
        this.props.getUserKYCRequest(id).then(() => {
            this.setState({ userKyc: this.props.userKycRequest })
        });
    }

    getUserById = (filters) => {
        const { apiBody } = this.state;
        if (filters != "") {
            filters.id = this.props.data.id;
            this.props.getUser(filters).then(() => {
                if (this.props.user != undefined) {
                    this.props.user.vehicles.map(data => {
                        // let rideTypeArray = [];
                        // if (data.normalRide == true) {
                        //     rideTypeArray.push(this.state.rideOptions[1].value)
                        // }
                        // if (data.specialRide == true) {
                        //     rideTypeArray.push(this.state.rideOptions[0].value)
                        // }
                        let modelData = {};
                        modelData.id = data.brandId;
                        this.fetchBrandModels(modelData);
                        this.setState({ vehicleData: data, normalRide: data.normalRide, specialRide: data.specialRide })
                    })
                }
            });
        } else {
            let data = {};
            data.id = this.props.data.id;
            this.props.getUser(data.id).then(() => {
                if (this.props.user.vehicles != undefined) {
                    this.props.user.vehicles.map(data => {
                        let rideTypeArray = [];
                        // if (data.normalRide == true) {
                        //     rideTypeArray.push(this.state.rideOptions[1].value)
                        // }
                        // if (data.specialRide == true) {
                        //     rideTypeArray.push(this.state.rideOptions[0].value)
                        // }
                        this.setState({ vehicleData: data, normalRide: data.normalRide, specialRide: data.specialRide })
                        rideTypeArray.map(e => {
                            if (e === "normalRide") {
                                this.setState({
                                    apiBody: {
                                        ...apiBody, normalRide: true
                                    }
                                })
                            }
                            if (e === "specialRide") {
                                this.setState({
                                    apiBody: {
                                        ...apiBody, specialRide: true
                                    }
                                })
                            }
                        })
                        let modelData = {};
                        modelData.id = data.brandId;
                        this.fetchAllBrands();
                        this.fetchBrandModels(modelData);
                    })
                    if (this.props.user.account != null) {
                        if (this.props.user.account.status == "ACTIVE") {
                            let newObject = {};
                            newObject.accStatus = true
                            this.setState({ userInput: newObject })
                        } else {
                            let newObject = {};
                            newObject.accStatus = false
                            this.setState({ userInput: newObject })
                        }
                    }
                }
                this.props.getDistricts().then(() => {
                    if (this.props.districts != {} && this.props.user != {}) {
                        const district = this.props.districts.data.find(i => i.id === this.props.user.districtId)
                        this.setState({ district: district.districtName })
                    }
                })
            });
        }
    }

    fetchAllBrands = () => {
        this.props.getBrands().then(() => {
            if (this.props.brands.data != undefined) {
                this.props.brands.data.map(brand => {
                    if (brand.id === this.state.vehicleData.brandId) {
                        this.setState({ brand: brand.brandName })
                    }
                })
            }
        })
    }

    fetchBrandModels = (data) => {
        this.props.getBrandModels(data).then(() => {
            if (this.props.models.data != undefined) {
                this.props.models.data.map(model => {
                    this.setState({ model: model.modelName })
                })
            }
        })
    }

    fetchAllKycRequests = () => {
        let data = {}
        this.props.getAllKYCRequests(data).then(() => {
            if (this.props.allKycRequests != undefined) {
                let personKycId = null;
                this.props.allKycRequests.map(person => {
                    if (person.personId === this.props.data.id) {
                        if (person.id != null) {
                            this.fetchUserKycStatus(person.id);
                            this.setState({ personData: { kycReqId: person.id, kycComment: person.comments, kycProof: person.mediaResource } })
                        }
                    } else {
                        this.setState({ userKyc: {} })
                    }
                })

            }
        })
    }

    componentDidMount() {
        this.getUserById("");
        this.fetchAllKycRequests();
    }

    componentDidUpdate(prevState) {
        if (this.props.user !== prevState.user) {
            this.setState({ userData: this.props.user })
        }
    }

    handleChange = (event) => {
        const { userInput, apiBody } = this.state;
        const { name, value } = event.target
        let obj = {};
        this.setState({
            userInput: { ...userInput, [name]: value },
            apiBody: { ...apiBody, [name]: value }
        })
        if (name === "ride") {
            this.setState({ rideType: value })
            let newApiBody = {};
            value.map(e => {
                if (e) {
                    if (e === "normalRide") { newApiBody.normalRide = true }
                    if (e === "specialRide") { newApiBody.specialRide = true }
                }
                else {
                    delete newApiBody.e
                }
            })
            obj = { ...this.state.apiBody, ...newApiBody };
            this.setState({
                apiBody: obj
            })
        }
        if (name === "brand") {
            const { id, brandName } = value;
            if (id) {
                this.setState({ brand: brandName, apiBody: { ...apiBody, brandId: id } });
                this.fetchBrandModels({ id });
            }
        }
    }

    handleActionClick(brandId, name, position) {
        let state = {
            [`${name}`]: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }
        if (brandId != "") {
            let data = {};
            data.id = brandId
            this.fetchBrandModels(data);
        }
        this.setState(state);
        console.log(this.state.apiBody)
    }

    onHide = (name) => {
        this.setState({
            [`${name}`]: false
        });
    }

    hideFinModal = () => {
        this.setState({ displayFinDialog: false })
    }

    changeActiveIndex = (index) => {
        this.setState({ activeIndex: index })
    }

    editMode = () => {
        // if (this.state.activeIndex === 0) {
        //     let inputField = document.getElementById("email");
        //     inputField.focus();
        //     inputField.classList.add("focus-background");
        // }
        // if (this.state.activeIndex === 1) {
        //     let inputField = document.getElementById("district");
        //     inputField.focus();
        //     inputField.classList.add("focus-background");

        // }
        this.setState({ accStatusDisable: false, apiBody: {} });
    }

    tabDisabled = (tabIndex) => {
        if (this.state.editMode) {
            return false;
        }
        else {
            if (this.state.activeIndex !== tabIndex) {
                return true;
            }
            return false;
        }
    }

    updateChanges = () => {
        const { apiBody, vehicleData } = this.state;
        if (this.state.activeIndex === 1) {
            let body = apiBody;
            body.id = vehicleData.id;
            this.props.updateVehicle(body)
        } else {
            let body = this.state.userInput
            body.id = this.props.data.id;
            this.props.updateUser(body);
        }
        this.getUserById("")
        this.closeModal()

    }

    acceptConfirmDialog = () => {
        this.setState({ editMode: true })
        this.updateChanges();
    }

    rejectConfirmDialog = () => {
        this.setState({ confirmDialog: false })
    }

    openKycPopUp = () => {
        this.setState({ kycModal: true });
    }

    hideKycPopUp = () => {
        this.setState({ kycModal: false });
    }

    dialogFooter = () => (
        <div>
            {this.state.accStatusDisable === false ?
                <Button onClick={() => this.handleActionClick("", 'displayConfirmDialog')} label="Save" className="p-button-success  p-button-sm"></Button>
                : null}
        </div>
    )

    dialogHeaders = () => (
        <div className="d-flex justify-content-between align-items-center pe-3">
            <h4 className="text-light mb-0">User Details</h4>
        </div>
    )

    closeModal = () => {
        this.props.hideModal()
        this.setState({ userInput: {} })
    }

    render() {
        const { brand, model, rideType, userData } = this.state;
        return (
            <>
                <Dialog className="main-dialog" header={this.dialogHeaders} footer={this.dialogFooter} visible={this.props.modelVisible} onHide={this.closeModal} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '70vw' }} draggable={false} resizable={false}>
                    <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.changeActiveIndex(e.index)}>
                        <TabPanel header="Person" disabled={this.tabDisabled(0)}>
                            <div className="row py-3">
                                <div className="col-md-12 text-end">
                                    <Button icon="pi pi-pencil" className="p-button-light p-button-outlined p-button-sm ms-2" onClick={this.editMode} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-sm-12">
                                    <div className="row">
                                        <div className="col-md-4 mb-4">
                                            <Image width="100%" src={img} alt="Image Text" />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="p-fluid ">
                                                <div className="field col-md-12 mb-4">
                                                    <span className="p-float-label">
                                                        <InputText className="p-inputtext-sm block" readOnly={this.state.editMode} id="userid" value={userData.id} />
                                                        <label htmlFor="userid">User Id</label>
                                                    </span>
                                                </div>
                                                <div className="field col-md-12 mb-4">
                                                    <span className="p-float-label">
                                                        <InputText className="p-inputtext-sm block" readOnly={this.state.editMode} onChange={this.handleChange} name="email" id="email" value={userData.email} />
                                                        <label htmlFor="email">Email</label>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="p-fluid ">
                                                <div className="field col-md-12 mb-4">
                                                    <span className="p-float-label">
                                                        <InputText className="p-inputtext-sm block" name="firstName" id="firstname" readOnly={this.state.editMode} onChange={this.handleChange} defaultValue={userData.firstName} />
                                                        <label htmlFor="firstname">First Name</label>
                                                    </span>
                                                </div>
                                                <div className="field col-md-12 mb-4">
                                                    <span className="p-float-label">
                                                        <InputText className="p-inputtext-sm block" id="lastname" readOnly={this.state.editMode} name="lastName" onChange={this.handleChange} defaultValue={userData.lastName} />
                                                        <label htmlFor="lastname">Last Name</label>
                                                    </span>
                                                </div>
                                                <div className="field col-md-12 mb-4">
                                                    <span className="p-float-label d-flex">

                                                        <span className="p-inputgroup-addon p-0 fs-14">
                                                            +91
                                                        </span>
                                                        <InputText className="p-inputtext-sm block rounded-0 rounded-end" id="lastname" readOnly={this.state.editMode} name="mobileNumber" onChange={this.handleChange} maxLength={10} minLength={10} defaultValue={userData.mobileNumber} onKeyPress={(event) => {
                                                            if (!/[0-9]/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }} mode="decimal" usegrouping="false" />
                                                        <label htmlFor="mobileNumber">Mobile Number</label>
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-lg-6 col-sm-12">
                                    <div className="p-fluid ">
                                        <div className="field col-md-12 mb-4">
                                            <span className="p-float-label">
                                                <InputTextarea className="p-inputtext-sm block" id="address" readOnly={this.state.editMode} name="address" onChange={this.handleChange} defaultValue={userData.address} rows={4} cols={30} />
                                                <label htmlFor="address">Address</label>
                                            </span>
                                        </div>
                                        <div className="field col-md-12 mb-4">
                                            <span className="p-float-label">
                                                <InputText className="p-inputtext-sm block" id="city" readOnly={this.state.editMode} name="city" onChange={this.handleChange} defaultValue={userData.city} />
                                                <label htmlFor="city">City</label>
                                            </span>
                                        </div>
                                        <div className="row">
                                            <div className="field col-md-6 mb-4">
                                                <span className="p-float-label">
                                                    <InputText className="p-inputtext-sm block" id="district" readOnly={this.state.editMode} name="district" onChange={this.handleChange} defaultValue={this.state.district} />
                                                    <label htmlFor="district">District</label>
                                                </span>
                                            </div>
                                            <div className="field col-md-6 mb-4">
                                                <span className="p-float-label">
                                                    <InputText className="p-inputtext-sm block" id="age" readOnly={this.state.editMode} name="age" onChange={this.handleChange} defaultValue={userData.age} />
                                                    <label htmlFor="age">Age</label>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 mb-4">
                                                <span className="field-image">
                                                    <Image src={img}
                                                        width="50"
                                                        preview
                                                        onError={(e) => (e.target.src = "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")}
                                                        alt={"ID Proof"}
                                                        className="ms-3"
                                                    />
                                                    <label className="field-label" htmlFor="age">ID Proof</label>
                                                </span>
                                            </div>
                                            <div className="col-md-4 mb-4">
                                                <span className="field-image">
                                                    {this.state.userKyc != {} ?
                                                        this.state.userKyc.status === "APPROVED" ?
                                                            <i className="pi pi-id-card p-text-secondary p-overlay-badge ms-3 icon-size" ><Badge severity="success" className="status-badge"></Badge></i> :
                                                            this.state.userKyc.status === "REJECTED" ? <i className="pi pi-id-card p-text-secondary p-overlay-badge ms-3 icon-size" onClick={this.openKycPopUp}><Badge severity="danger" className="status-badge"></Badge></i> :
                                                                this.state.userKyc.status === "PENDING" ? <i className="pi pi-id-card p-text-secondary p-overlay-badge ms-3 icon-size" onClick={this.openKycPopUp}><Badge severity="warning" className="status-badge"></Badge></i> : null : null}
                                                    <label className="field-label" htmlFor="age">Kyc Status</label>
                                                </span>
                                            </div>
                                            <div className="col-md-4 col-5 mb-4">
                                                <span className="field-image">
                                                    <ToggleButton onLabel="Active" disabled={this.state.accStatusDisable} offLabel="Disabled" className="w-full sm:w-10rem p-button-sm" aria-label="Confirmation" checked={this.state.userInput.accStatus} name="accStatus" onChange={this.handleChange} />
                                                    <label className="field-label" htmlFor="accStatus">Account Status</label>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        {this.props.data.vehiclesCount > 0 ?
                            <TabPanel header="Vehicle" disabled={this.tabDisabled(1)}>
                                {this.props.user.vehicles !== undefined ?
                                    this.props.user.vehicles.map((data, idx) => {
                                        return (
                                            <div key={idx}>
                                                <div className="row py-3">
                                                    <div className="col-md-12 text-end">
                                                        {/* <Button icon="pi pi-pencil" className="p-button-light p-button-outlined p-button-sm ms-2" onClick={this.editMode} /> */}
                                                        {/* <Button label="Financial" className="p-button-light  p-button-sm ms-2" onClick={() => this.handleActionClick(data.brandId, 'displayFinDialog')} /> */}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-12 col-sm-12">
                                                        <div className="p-fluid row">
                                                            <div className="field col-md-4 mb-4">
                                                                <span className="action-field">
                                                                    <InputText className="p-inputtext-sm block " readOnly={this.state.editMode} defaultValue={this.state.district} name="districtName" onChange={this.handleChange} />
                                                                    {/* <Dropdown id="district" disabled={this.state.editMode} className="p-inputtext-sm block" options={this.props.districts.data} placeholder={data.districtId === "10000001" ? "Moga" : null} optionLabel="districtName" name="districtName" value={this.state.userInput.districtName} onChange={this.handleChange} /> */}
                                                                    <label className="action-label" htmlFor="district">District</label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-12 col-sm-12">
                                                        <div className="p-fluid row">
                                                            <div className="field col-md-6 mb-4">
                                                                <span className="action-field">
                                                                    <InputText className="p-inputtext-sm block " readOnly={this.state.editMode} defaultValue={brand} name="brand" onChange={this.handleChange} />
                                                                    {/* <Dropdown className="p-inputtext-sm block" disabled={this.state.editMode} options={this.props.brands.data} placeholder={brand} optionLabel="brandName" name="brand" value={brand} onChange={this.handleChange} /> */}
                                                                    <label className="action-label" htmlFor="registrationNo">Brand</label>
                                                                </span>
                                                            </div>
                                                            <div className="field col-md-6 mb-4">
                                                                <span className="action-field">
                                                                    <InputText className="p-inputtext-sm block " readOnly={this.state.editMode} defaultValue={model} name="model" onChange={this.handleChange} />
                                                                    {/* <Dropdown className="p-inputtext-sm block" disabled={this.state.editMode} options={this.props.models.data} placeholder={model} optionLabel="modelName" name="model" value={model} onChange={this.handleChange} /> */}
                                                                    <label className="action-label" htmlFor="brand">Model</label>
                                                                </span>
                                                            </div>
                                                            <div className="field col-md-6 mb-4">
                                                                <span className="p-float-label">
                                                                    <InputText className="p-inputtext-sm block " id="registrationNo" readOnly={this.state.editMode} defaultValue={data.registrationNumber} name="registrationNumber" onChange={this.handleChange} />
                                                                    <label htmlFor="make">Registration No.</label>
                                                                </span>
                                                            </div>
                                                            <div className="field col-md-6 mb-4">
                                                                <span className="p-float-label">
                                                                    <InputText className="p-inputtext-sm block " id="modelyear" readOnly={this.state.editMode} defaultValue={data.modelYear} name="modelYear" onChange={this.handleChange} />
                                                                    <label htmlFor="model">Model Year</label>
                                                                </span>
                                                            </div>
                                                            <div className="field col-md-6 mb-4">
                                                                <span className="p-float-label">
                                                                    <InputText className="p-inputtext-sm block " id="modelyear" readOnly={this.state.editMode} defaultValue={data.city} name="city" onChange={this.handleChange} />
                                                                    <label htmlFor="model">City</label>
                                                                </span>
                                                            </div>
                                                            <div className="field col-md-2 mb-4">
                                                                <span className="p-float-label">
                                                                    <Button name="normalRide" className={this.state.normalRide ? "p-button-rounded p-button-success" : "p-button-rounded p-button-danger"} disabled={this.state.editMode} label="Normal Ride" icon={this.state.normalRide ? "pi pi-check" : "pi pi-times"} iconPos="right" />

                                                                    {/* <SelectButton className="" value={rideType} disabled={this.state.editMode} options={this.state.rideOptions} onChange={this.handleChange} name="ride" optionLabel="name" multiple /> */}
                                                                </span>
                                                            </div>
                                                            <div className="field col-md-2 mb-4">
                                                                <span className="p-float-label">
                                                                    <Button name="specialRide" className={this.state.specialRide ? "p-button-rounded p-button-success" : "p-button-rounded p-button-danger"} disabled={this.state.editMode} label="Special Ride" icon={this.state.specialRide ? "pi pi-check" : "pi pi-times"} iconPos="right" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    }) : null}
                            </TabPanel> : null
                        }
                    </TabView>
                    <ConfirmDialog visible={this.state.displayConfirmDialog} onHide={() => this.onHide('displayConfirmDialog')} message="Are you sure you want to proceed?"
                        header="Confirmation" icon="pi pi-exclamation-triangle" accept={this.acceptConfirmDialog} />
                </Dialog>
                <Financial
                    modal={this.state.displayFinDialog}
                    onHide={this.hideFinModal}
                />
                {this.state.kycModal === true ?
                    <KycModal
                        modal={this.state.kycStatus}
                        hideDialog={this.hideKycPopUp}
                        status={this.state.userKyc.status}
                        proofImage={this.state.personData.kycProof}
                        comment={this.state.personData.kycComment}
                    /> : null}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userDetails.user,
        userKycRequest: state.kycDetails.userKycRequest,
        allKycRequests: state.kycDetails.allKycRequests,
        districts: state.getDistricts.districts,
        brands: state.brandDetails.brands,
        models: state.brandDetails.models,

        error: state.userDetails.error,
        error: state.kycDetails.error,
        error: state.getDistricts.error,
        error: state.brandDetails.error
    }
}

const mapDispatchToProps = {
    getUser,
    getDistricts,
    updateUser,
    getUserKYCRequest,
    getBrands,
    getBrandModels,
    updateVehicle,
    getAllKYCRequests
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetails);