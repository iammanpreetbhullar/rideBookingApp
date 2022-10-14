import React from 'react';
import { connect } from 'react-redux';
import DataGrid from '../common/DataGrid';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { getDistricts } from '../../actions/getDistricts';
import loader from '../../assets/loaders/rickshawLoading.gif';

class Districts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filters: null,
            globalFilterValue: '',
            loading: true,
            districts: null,
            timer: null,
            sortField: null,
            sortOrder: null,
            loaderShow: false
        }
        this.statuses = [
            { label: 'ACTIVE', value: 'ACTIVE' },
            { label: 'INACTIVE', value: 'INACTIVE' }
        ];
    }

    fetchDistricts = (filters) => {
        if (filters !== "") {
            this.props.getDistricts(filters).then(() => {
                this.setState({ loading: false, loaderShow: false })
            })
        } else {
            this.props.getDistricts().then(() => {
                this.setState({ loading: false, loaderShow: false })
            })
        }
    }

    componentDidMount() {
        this.setState({ loaderShow: true })
        this.fetchDistricts("");
        this.initFilters();
    }

    initFilters = async () => {
        let _filters = {};
        _filters['global'] = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.setState({
            filters: _filters, globalFilterValue: ''
        });
    }

    onGlobalFilterChange = (e) => {
        let filters = { filtering: {} }
        const value = e.target.value;
        filters.filtering.searchText = value.toUpperCase();

        clearTimeout(this.state.timer);

        const newTimer = setTimeout(() => {
            this.fetchDistricts(filters)
        }, 1000);

        this.setState({ timer: newTimer, globalFilterValue: value });
    }

    clearFilter = () => {
        this.initFilters();
        this.fetchDistricts("")
    }

    renderHeader = () => (
        <div className="d-flex justify-content-end">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={this.state.globalFilterValue} onChange={(e) => this.onGlobalFilterChange(e)} placeholder="Keyword Search" className="p-inputtext-sm block global-search-input me-2" />
            </span>
            <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined p-button-sm p-button-danger" onClick={() => this.clearFilter("")} />
        </div>
    )

    customBodyTemplate = (rowData, col) => (
        col.field = "status" ?
            this.getStatusLabel(rowData.status) : null
    );

    getStatusLabel = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'ACTIVE';

            case 'INACTIVE':
                return 'INACTIVE';

            default:
                return 'NA';
        }
    }

    statusEditor = (options) => {
        return (
            <Dropdown value={options.value} options={this.statuses} optionLabel="label" optionValue="value"
                onChange={(e) => options.editorCallback(e.value)} placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <span className={`product-badge status-${option.value.toLowerCase()}`}>{option.label}</span>
                }} />
        );
    }

    onRowEditComplete(e) {
        let districts = [...this.state.data];
        let { newData, index } = e;
        districts[index] = newData;
        this.setState({ data: districts });
    }

    textEditor(options) {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

    onSort = (e) => {
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
        this.fetchDistricts(sortFilters);
    }

    render() {
        const header = this.renderHeader();
        const columns = [
            { field: "districtName", header: "District", style: { width: '30%' }, editor: (options) => this.textEditor(options), sortable: true },
            { field: "status", header: "Status", style: { width: '30%' }, body: this.customBodyTemplate, editor: (options) => this.statusEditor(options), sortable: true },
            { header: "Actions", rowEditor: true, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' } }
        ];
        return (
            <>
                {this.state.loaderShow ?
                    <div className='bg-transparent w-100 d-flex justify-content-center align-items-center' style={{ height: '93.5%' }}>
                        <img src={loader} width='20%' />
                    </div> :
                    <div>
                        <DataGrid
                            columns={columns}
                            value={this.props.districts.data}
                            stripedRows={true}
                            size="small"
                            responsiveLayout="scroll"
                            paginator={true}
                            showGridlines={true}
                            rows={10}
                            dataKey="id"
                            loading={this.state.loading}
                            header={header}
                            emptyMessage="No records found."
                            editMode="row"
                            onRowEditComplete={(e) => this.onRowEditComplete(e)}
                            removableSort={true}
                            onSort={this.onSort}
                            sortField={this.state.sortField}
                            sortOrder={this.state.sortOrder}
                        />
                    </div>
                }
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        districts: state.getDistricts.districts,
        error: state.getDistricts.error
    };
};

const mapDispatchToProps = {
    getDistricts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Districts);