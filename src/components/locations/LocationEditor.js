import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { addLocationDistrictWise, updateLocation } from '../../actions/locationDetails';

class LocationEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: {},
            statuses: ["ACTIVE", "INACTIVE"],
            header: "",
            dialogConfirmation: false,
            locStatus: "",
            district: null,
            locationCategory: null,
            categoryOptions: [],
            districtOptions: [],
            locationName: "",
            locationLat: "",
            locationLong: "",
            locationId: null
        }
    }

    addLocation = (data) => {
        this.props.addLocationDistrictWise(data).then(() => {
            this.setState({ userInput: {} })
        })
    }

    updateLoc = (data) => {
        this.props.updateLocation(data).then(() => {
            console.log("updated")
        })
    }

    componentDidMount() {
        this.setStateData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.rowData != prevProps.rowData) {
            this.setStateData();
        } else if (this.props.districts != prevProps.districts) {
            this.setStateData();
        } else if (this.props.locCategories != prevProps.locCategories) {
            this.setStateData();
        }
    }

    setStateData = () => {
        if (this.props.rowData != "") {
            if (this.props.locCategories != undefined && this.props.districts != undefined) {
                const { rowData, locCategories, districts } = this.props;
                const locationCategoryData = locCategories.find(i => i.id === rowData.locationCategoryId);
                const districtsData = districts.find(i => i.id === rowData.districtId);
                this.setState({
                    locationId: rowData.id,
                    categoryOptions: locCategories,
                    districtOptions: districts,
                    district: districtsData.districtName,
                    locationCategory: locationCategoryData.categoryName,
                    locStatus: rowData.status
                })
            }
        } else {
            if (this.props.locCategories != undefined && this.props.districts != undefined) {
                const { locCategories, districts } = this.props;
                this.setState({
                    categoryOptions: locCategories,
                    districtOptions: districts,
                    locStatus: ""
                })
            }
        }
    }

    handleChange = (event) => {
        const { userInput } = this.state;
        const { name, value } = event.target;
        if (name === "status") {
            this.setState({ locStatus: event.value })
        }
        if (name === "categoryName") {
            this.setState({ locationCategory: value.categoryName })
        }
        if (name === "districtName") {
            this.setState({ district: value.districtName })
        }
        if (name === "locationName") {
            this.setState({ locationName: value })
        }
        if (name === "locationLat") {
            this.setState({ locationLat: value })
        }
        if (name === "locationLong") {
            this.setState({ locationLong: value })
        }
        this.setState({
            userInput: {
                ...userInput,
                [name === "categoryName" ? "locationCategoryId" : name === "districtName" ? "districtId" : name]: name === "categoryName" ? value.id : name === "districtName" ? value.id : value,
                locId: this.state.locationId != null ? this.state.locationId : ""
            }
        })
    }

    openDialogConfirmation = () => {
        this.setState({ dialogConfirmation: true })
    }

    acceptConfirmation = () => {
        const { userInput } = this.state;
        if (this.state.locationId != null) {
            this.updateLoc(userInput)
        } else {
            this.addLocation(userInput)
        }
        this.setState({ dialogConfirmation: false })
        this.props.closeModal();
    }

    closeModal = () => {
        this.setState({ district: null, locationCategory: null,  header: "" })
        this.props.closeModal();
    }

    tableFooter = () => (
        <>
            {this.props.rowData !== "" ?
                <Button label='Save' className="p-button-sm me-0" onClick={this.openDialogConfirmation}></Button>
                :
                <Button label='Add' className="p-button-sm me-0" onClick={this.openDialogConfirmation}></Button>}
        </>
    )

    render() {
        const { rowData, visible } = this.props;
        const { districtOptions, district, locationCategory, categoryOptions, statuses, userInput, dialogConfirmation, locStatus, locationName, locationLat, locationLong } = this.state;
        return (
            <div>
                <Dialog footer={this.tableFooter} header={rowData !== "" ? "Id: " + rowData.id : "Add new location"} draggable={false} visible={visible} onHide={this.closeModal} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }}>
                    {this.props.rowData !== "" ?
                        <>
                            <div className="p-fluid grid row pt-4">
                                <div className="field col-md-6 mb-4">
                                    <span className="p-float-label">
                                        <InputText className="p-inputtext-sm block " id="inputtext" defaultValue={rowData.locationName} name='locationName' onChange={this.handleChange} />
                                        <label htmlFor="inputtext">Location</label>
                                    </span>
                                </div>
                                <div className="field col-md-6 mb-4">
                                    <span className="p-float-label">
                                        <InputText className="p-inputtext-sm block " id="inputtext" defaultValue={rowData.locationLat} name='locationLat' onChange={this.handleChange} />
                                        <label htmlFor="inputtext">Latitude</label>
                                    </span>
                                </div>
                                <div className="field col-md-6 mb-4">
                                    <span className="p-float-label">
                                        <InputText className="p-inputtext-sm block " id="inputtext" defaultValue={rowData.locationLong} name='locationLong' onChange={this.handleChange} />
                                        <label htmlFor="inputtext">Longitude</label>
                                    </span>
                                </div>
                                <div className="field col-md-6 mb-4">
                                    <span className="action-field">
                                        <Dropdown className="p-inputtext-sm block " inputId="dropdown" options={districtOptions} value={district} optionLabel="districtName" name="districtName" placeholder={district} onChange={this.handleChange} />
                                        <label className="action-label" htmlFor="dropdown">District</label>
                                    </span>
                                </div>
                                <div className="field col-md-6 mb-4">
                                    <span className="action-field">
                                        <Dropdown className="p-inputtext-sm block " inputId="dropdown" options={categoryOptions} value={locationCategory} optionLabel="categoryName" name='categoryName' placeholder={locationCategory} onChange={this.handleChange} />
                                        <label className="action-label" htmlFor="dropdown">Category</label>
                                    </span>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <span className="action-field">
                                        <SelectButton className="selectBtn-sm" name="status" value={locStatus} options={statuses} onChange={this.handleChange} ></SelectButton>
                                        <label className="action-label" htmlFor="status">Status</label>
                                    </span>
                                </div>
                            </div>
                        </>
                        : <>
                            <div className="p-fluid grid row pt-4">
                                <div className="field col-md-6 mb-4">
                                    <span className="p-float-label">
                                        <InputText className="p-inputtext-sm block " id="inputtext" value={locationName} name='locationName' onChange={this.handleChange} />
                                        <label htmlFor="inputtext">Location</label>
                                    </span>
                                </div>
                                <div className="field col-md-6 mb-4">
                                    <span className="p-float-label">
                                        <InputText className="p-inputtext-sm block " id="inputtext" value={locationLat} name='locationLat' onChange={this.handleChange} />
                                        <label htmlFor="inputtext">Latitude</label>
                                    </span>
                                </div>
                                <div className="field col-md-6 mb-4">
                                    <span className="p-float-label">
                                        <InputText className="p-inputtext-sm block " id="inputtext" value={locationLong} name='locationLong' onChange={this.handleChange} />
                                        <label htmlFor="inputtext">Longitude</label>
                                    </span>
                                </div>
                                <div className="field col-md-6 mb-4">
                                    <span className="action-field">
                                        <Dropdown className="p-inputtext-sm block " inputId="dropdown" options={districtOptions} value={district} optionLabel="districtName" name="districtName" placeholder={district === null ? "Select a district" : district} onChange={this.handleChange} />
                                        <label className="action-label" htmlFor="dropdown">District</label>
                                    </span>
                                </div>
                                <div className="field col-md-6 mb-4">
                                    <span className="action-field">
                                        <Dropdown className="p-inputtext-sm block " inputId="dropdown" options={categoryOptions} value={locationCategory} optionLabel="categoryName" name='categoryName' placeholder={locationCategory === null ? 'Select a category' : locationCategory} onChange={this.handleChange} />
                                        <label className="action-label" htmlFor="dropdown">Category</label>
                                    </span>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <span className="action-field">
                                        <SelectButton className="selectBtn-sm" value={locStatus} name="status" options={statuses} onChange={this.handleChange}></SelectButton>
                                        <label className="action-label" htmlFor="status">Status</label>
                                    </span>
                                </div>
                            </div>
                        </>
                    }
                    <ConfirmPopup visible={dialogConfirmation} message="Are you sure you want to proceed?"
                        icon="pi pi-exclamation-triangle" accept={this.acceptConfirmation} reject={() => this.setState({ dialogConfirmation: false })} />
                </Dialog >
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        newLocationDetails: state.locationDetails.newLocationDetails,
        updatedLocationDetails: state.locationDetails.updatedLocationDetails,
        error: state.locationDetails.error,
    };
};

const mapDispatchToProps = {
    addLocationDistrictWise,
    updateLocation
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationEditor);