import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Checkbox } from 'primereact/checkbox';
import { Badge } from "primereact/badge";
import { Dialog } from 'primereact/dialog';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { getDistricts } from '../../actions/getDistricts';
import { getLocationsByDistrictId, getLocationCategories } from '../../actions/locationDetails';
import DataGrid from '../common/DataGrid';
import LocationEditor from './LocationEditor';
import loader from '../../assets/loaders/rickshawLoading.gif';
import '../App.scss'

class Locations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            filters: null,
            globalFilterValue: '',
            locCategories: [],
            districts: [],
            districtValue: "",
            showModal: false,
            locationData: {},
            confirmDialog: false,
            timer: null,
            sortField: null,
            sortOrder: null,
            displayPosition: false,
            displayResponsive: false,
            position: 'center',
            statuses: [{ name: "ACTIVE" }, { name: "INACTIVE" }],
            locationStatus: null,
            locationCategory: null,
            first: 0,
            rows: 10,
            elementHidden: true,
            params: { id: '10000001', page: '1', pageSize: '10' },
            locationList: { metaData: { totalCount: 0 } },
            advFilters: [],
            disabledLocCategoryFilter: true,
            disabledLocStatusFilter: true,
            pageParams: {},
            loaderShow: false
        };
        this.columns = [
            { field: "locationName", header: "Location", sortable: true },
            { field: "locationLat", header: "Latitude" },
            { field: "locationLong", header: "Longitude" },
            { field: "districtName", header: "District", sortable: true, bodyStyle: { textAlign: 'center' }, alignHeader: 'center' },
            { field: "locationCategoryName", header: "Location Category", bodyStyle: { textAlign: 'center' }, sortable: true, style: { width: '10%' }, alignHeader: 'center' },
            { field: "status", header: "Status", body: this.customBodyTemplate, bodyStyle: { textAlign: 'center' }, sortable: true, style: { width: '10%' }, alignHeader: 'center' },
            { field: 'action', header: "Action", body: this.customBodyTemplate, bodyStyle: { textAlign: 'center' }, style: { width: '5%' }, alignHeader: 'center' }
        ];
    }

    fetchDistricts = () => {
        this.props.getDistricts().then(() => {
            this.setState({ loading: false })
        })
    }

    fetchLocationCategories = () => {
        this.props.getLocationCategories().then(() => {
            this.setState({ loading: false, loaderShow: false })
        })
    }

    componentDidMount() {
        this.setState({ loaderShow: true })
        this.fetchDistricts();
        this.fetchLocationCategories();
    }

    fetchDistrictLocations = (filters) => {
        if (filters != "") {
            console.log(typeof (filters))
            if (typeof (filters) === 'object') {
                console.log(filters)
                filters.id = "10000001";
                this.props.getLocationsByDistrictId(filters).then(() => {
                    this.setState({ loading: false, elementHidden: false, pageParams: filters, locationList: this.props.districtLocations })
                });
            }
            else if (typeof (filters) === 'number') {
                console.log(filters)
                this.props.getLocationsByDistrictId(this.state.pageParams).then(() => {
                    this.setState({
                        locationList: this.props.districtLocations,
                        loading: false,
                        elementHidden: false,
                    })
                });
            }
        } else {
            this.props.getLocationsByDistrictId(this.state.params).then(() => {
                this.setState({
                    locationList: this.props.districtLocations,
                    loading: false,
                    elementHidden: false
                })
            });
        }

    }

    handleChange = (e) => {
        let selectedFilters = [...this.state.advFilters];
        const target = e.target;

        if (target.name === "districtFilter") {
            this.setState({ districtValue: target.value, loading: true })
            this.fetchDistrictLocations("")
        }
        if (e.checked) {
            selectedFilters.push(e.value);
            if (e.value === 'statusFilter') {
                this.setState({ disabledLocStatusFilter: false, })
            } else if (e.value === 'locCategoryFilter') {
                this.setState({ disabledLocCategoryFilter: false })
            }
        }
        else {
            selectedFilters.splice(selectedFilters.indexOf(e.value), 1);
            if (e.value === 'statusFilter') {
                this.setState({ locationStatus: null, disabledLocStatusFilter: true })
            } else if (e.value === 'locCategoryFilter') {
                this.setState({ locationCategory: null, disabledLocCategoryFilter: true })
            }
        }
        this.setState({ advFilters: selectedFilters })
    }

    onHide = (name) => {
        this.setState({
            [`${name}`]: false
        });
    }

    onGlobalFilterChange = (e) => {
        let filters = this.state.params
        filters.filtering = {}
        const value = e.target.value;
        filters.filtering.searchText = value;

        clearTimeout(this.state.timer);

        const newTimer = setTimeout(() => {
            if (value != '') {
                this.setState({ loading: true })
                this.fetchDistrictLocations(filters)
            } else {
                this.setState({ loading: true })
                this.fetchDistrictLocations("")
            }
        }, 1000);
        this.setState({ timer: newTimer, globalFilterValue: value });
    }

    handleActionClick = (rowData, name, position) => {
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
        this.setState({ showModal: true, locationData: rowData, districts: this.props.districts.data, locCategories: this.props.locationCategories.data })
    }

    acceptConfirmDelete = (col) => {
        this.state.data.splice(col.rowIndex, 1);
        this.setState(this.state.data);
    }

    confirmDeleteRow = (col) => {
        this.setState({ confirmDialog: true })
    }

    closeConfirmDeleteRow = () => {
        this.setState({ confirmDialog: false })
    }

    closeModal = () => {
        this.setState({ displayResponsive: false });
        if (this.state.first > 0) {
            this.fetchDistrictLocations(this.state.first);
        } else {
            this.fetchDistrictLocations("");
        }
    }

    clearFilter = (name) => {
        this.setState({ loading: true })
        if (name != "" && name != undefined) {
            this.onHide(name)
        }
        delete this.state.params.filtering;
        this.fetchDistrictLocations("")
        this.setState({ globalFilterValue: '', locationStatus: null, locationCategory: null, disabledLocStatusFilter: true, disabledLocCategoryFilter: true, advFilters: [] })
    }

    renderHeader = () => (
        <div className='row d-flex justify-content-between align-items-center'>
            <div className='col-lg-5 col-sm-6 d-flex'>
                <span className="p-input-icon-left" hidden={this.state.elementHidden}>
                    <i className="pi pi-search" />
                    <InputText value={this.state.globalFilterValue} onChange={(e) => this.onGlobalFilterChange(e)} placeholder="Keyword Search" className="p-inputtext-sm block global-search-input me-2" />
                </span>
                <span className="">
                    <Dropdown className="p-inputtext-sm block " placeholder='Select a district' name='districtFilter' value={this.state.districtValue} options={this.props.districts.data} optionLabel="districtName" onChange={(e) => this.handleChange(e)}></Dropdown>
                </span>
            </div>
            <div className='col-lg-7 col-sm-6 d-flex justify-content-end' >
                <span hidden={this.state.elementHidden}>
                    <Button type='button' icon="pi pi-plus" label='New' className="p-button-sm ms-2" onClick={() => this.handleActionClick("", 'displayResponsive')}></Button>
                    <Button type='button' label='Advanced Filters' className="p-button-sm ms-2" onClick={() => this.handleActionClick("", 'displayPosition', 'top-right')}></Button>
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined p-button-sm p-button-danger ms-2" onClick={this.clearFilter} />
                </span>
            </div>
        </div>
    )

    customBodyTemplate = (rowData, col) => (
        col.field === "status" ? <Badge value={rowData.status} className="mr-2" severity={rowData.status === "ACTIVE" ? "success" : "danger"} /> :
            <div>
                <Button className="p-button-rounded p-button-info p-button-sm me-2" type="button" onClick={() => this.handleActionClick(rowData, 'displayResponsive')} >
                    <i className="pi pi-pencil" style={{ fontSize: "1em" }}></i>
                </Button>
                {/* <Button className="p-button-rounded p-button-danger p-button-sm" onClick={() => this.confirmDeleteRow(col)} >
                    <i className="pi pi-trash" style={{ fontSize: "1em" }}></i>
                </Button> */}
                {/* <span className='me-3' role={'button'}><i className="pi pi-pencil" onClick={() => this.handleActionClick(rowData, 'displayResponsive')}></i> </span>
                        <span className='' role={'button'}><i className='pi pi-trash' onClick={() => this.confirmDeleteRow(col)}></i></span> */}
            </div>
    )

    onSort = (e) => {
        this.setState({ loading: true })
        const { sortOrder } = this.state;
        this.setState({ sortField: e.sortField, sortOrder: e.sortOrder })
        let sortFilters = { sorting: [] }
        if (sortOrder === null || sortOrder === 0) {
            sortFilters.sorting.push({ column: e.sortField, order: "asc" });
        } else if (sortOrder === 1) {
            sortFilters.sorting.push({ column: e.sortField, order: "desc" });
        } else {
            sortFilters = ""
        }
        this.fetchDistrictLocations(sortFilters);
    }

    onCustomPaginatorPage = (event) => {
        this.setState({ loading: true })
        let data = {};
        data.page = event.page + 1;
        data.pageSize = event.rows
        this.fetchDistrictLocations(data);
        this.setState({
            first: event.first,
            rows: event.rows,
        });
    }

    renderFooter = (name, dialog) => {
        const { locationStatus, locationCategory } = this.state;
        if (dialog === 'filters') {
            return (
                <div>
                    <Button disabled={locationStatus != null || locationCategory != null ? false : true} label="Apply" icon="pi pi-check" onClick={() => this.applyAdvFilters(name)} className="p-button-text p-button-sm" />
                    <Button disabled={locationStatus != null || locationCategory != null ? false : true} label="Clear" icon="pi pi-filter-slash" onClick={() => this.clearFilter(name)} className="p-button-sm p-button-danger" autoFocus />
                </div>
            );
        } else {
            return <Button label="Close" icon="pi pi-check" onClick={() => this.onHide(name)} className="p-button-sm" autoFocus />
        }
    }

    applyAdvFilters = (name) => {
        this.setState({ loading: true })
        const { locationStatus, locationCategory } = this.state;
        if (this.state.advFilters.length > 0) {
            let filters = {}
            this.state.advFilters.map(filter => {
                if (filter == 'statusFilter') {
                    filters.statusFilter = { name: filter, value: locationStatus.name }
                } else if (filter == 'locCategoryFilter') {
                    filters.locCategoryFilter = { name: filter, value: locationCategory.id }
                }
            })
            this.initFilters(filters)
        }
        this.onHide(name);
    }

    initFilters = (filterData) => {
        if (filterData != "") {
            let filters = { filtering: {} };
            for (const key in filterData) {
                if (filterData[key]['name'] === "statusFilter") {
                    filters.filtering.status = filterData[key]['value']
                }
                else if (filterData[key]['name'] === "locCategoryFilter") {
                    filters.filtering.locationCategoryId = filterData[key]['value']
                }
            }
            this.fetchDistrictLocations(filters)
        }
        this.setState({ globalFilterValue: '' });
    }

    render() {
        this.paginatorTemplate = {
            layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
            'RowsPerPageDropdown': (options) => {
                const dropdownOptions = [
                    { label: 10, value: 10 },
                    { label: 20, value: 20 },
                    { label: 50, value: 50 }
                ];

                return (
                    <React.Fragment>
                        <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>Items per page: </span>
                        <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />
                    </React.Fragment>
                );
            },
            'CurrentPageReport': (options) => {
                return (
                    <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                        {options.first} - {options.last} of {options.totalRecords}
                    </span>
                )
            }
        };

        return (

            <>
                <div className='row g-0'>
                    {this.state.loaderShow ?
                        <div className='bg-transparent w-100 d-flex justify-content-center align-items-center' style={{ height: '93.5%' }}>
                            <img src={loader} width='20%' />
                        </div> :
                        <>
                            <DataGrid
                                columns={this.columns}
                                value={this.props.districtLocations.data}
                                stripedRows={true}
                                size="small"
                                responsiveLayout="scroll"
                                showGridlines={true}
                                dataKey="id"
                                filters={this.state.filters}
                                filtering={true}
                                loading={this.state.loading}
                                globalFilterFields={['locationName', 'locationLat', 'locationLong', 'districtId', 'status']}
                                header={this.renderHeader}
                                emptyMessage="No records found."
                                removableSort={true}
                                onSort={this.onSort}
                                sortField={this.state.sortField}
                                sortOrder={this.state.sortOrder}
                            />
                            <Paginator
                                template={this.paginatorTemplate}
                                first={this.state.first}
                                rows={this.state.rows}
                                totalRecords={this.state.locationList.metaData.totalCount}
                                onPageChange={this.onCustomPaginatorPage}
                                className="justify-content-end"
                            />
                            {this.state.showModal != false ?
                                <LocationEditor
                                    visible={this.state.displayResponsive}
                                    rowData={this.state.locationData}
                                    closeModal={this.closeModal}
                                    districts={this.state.districts}
                                    locCategories={this.state.locCategories}
                                /> : null}
                            <Dialog
                                header="Advanced filters"
                                visible={this.state.displayPosition}
                                modal
                                position={this.state.position}
                                style={{ width: '20vw' }}
                                footer={this.renderFooter('displayPosition', 'filters')}
                                onHide={() => this.onHide('displayPosition')}
                                draggable={false}
                                resizable={false}
                            >
                                <>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-12 d-flex align-items-center">
                                            {/* <span className="p-float-label"> */}
                                            <Checkbox
                                                inputId="statusFilter"
                                                name="statusFilter"
                                                value="statusFilter"
                                                onChange={this.handleChange}
                                                className="me-2"
                                                checked={this.state.advFilters.indexOf('statusFilter') !== -1}
                                            />
                                            <Dropdown
                                                disabled={this.state.disabledLocStatusFilter}
                                                className="p-inputtext-sm block"
                                                placeholder='Select a status'
                                                value={this.state.locationStatus}
                                                options={this.state.statuses}
                                                optionLabel="name"
                                                onChange={(e) => this.setState({ locationStatus: e.value })}
                                            />
                                            {/* <label htmlFor="inputtext">Select a status</label> */}
                                            {/* </span> */}
                                        </div>
                                        <div className="col-12 d-flex align-items-center">
                                            {/* <span className="p-float-label"> */}
                                            <Checkbox
                                                inputId="locCategoryFilter"
                                                name="locCategoryFilter"
                                                value="locCategoryFilter"
                                                onChange={this.handleChange}
                                                className="me-2"
                                                checked={this.state.advFilters.indexOf('locCategoryFilter') !== -1}
                                            />
                                            <Dropdown
                                                disabled={this.state.disabledLocCategoryFilter}
                                                className="p-inputtext-sm block"
                                                placeholder='Select a category'
                                                value={this.state.locationCategory}
                                                options={this.props.locationCategories.data}
                                                optionLabel="categoryName"
                                                onChange={(e) => this.setState({ locationCategory: e.value })}
                                            />
                                            {/* <label htmlFor="inputtext">Select a category</label>
                                </span> */}
                                        </div>
                                    </div>
                                </>
                            </Dialog>
                            {this.state.districtValue == "" ? <div className='row d-flex text-center py-1'><h3>Kindly select a district first.</h3></div> : null}
                            <ConfirmPopup message="Are you sure you want to proceed?" visible={this.state.confirmDialog} accept={this.acceptConfirmDelete} onHide={this.closeConfirmDeleteRow} />
                        </>
                    }
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        districtLocations: state.locationDetails.districtLocations,
        districts: state.getDistricts.districts,
        locationCategories: state.locationDetails.locationCategories,
        error: state.locationDetails.error,
        error: state.getDistricts.error
    };
};

const mapDispatchToProps = {
    getLocationsByDistrictId,
    getDistricts,
    getLocationCategories
};

export default connect(mapStateToProps, mapDispatchToProps)(Locations);