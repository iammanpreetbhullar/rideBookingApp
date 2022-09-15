import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Paginator } from 'primereact/paginator';
import { getAllUsers } from "../../actions/getUsers";
import { getDistricts } from "../../actions/getDistricts";
import DataGrid from "../common/DataGrid";
import PersonDetails from "./PersonDetails";
import "../App.scss";

function PersonsList(props) {
  const [personData, setPersonData] = useState({})
  const [personModalVisible, setPersonModalVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [displayPosition, setDisplayPosition] = useState(false);
  const [position, setPosition] = useState('center');
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [district, setDistrict] = useState(null);
  const [advFilters, setAdvFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(null)
  const [user, setUser] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [disableUserFilter, setDisableUserFilter] = useState(true);
  const [disableKycFilter, setDisableKycFilter] = useState(true);
  const [disableDistrictFilter, setDisableDistrictFilter] = useState(true);
  const [timer, setTimer] = useState(null)
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [pageData, setPageData] = useState({ first: 0, pageSize: 10, page: 1 })
  const [usersList, setUsersList] = useState({})

  useEffect(() => {
    initFilters("");
  }, []);

  const getUsers = (filters) => {
    if (filters != "") {
      props.getAllUsers(filters).then(() => {
        if (props.users !== undefined) {
          setLoading(false);
        }
      });
    } else {
      props.getAllUsers(pageData).then(() => {
        if (props.users !== undefined) {
          setLoading(false);
        }
      });
    }
  }

  useEffect(() => {
    setUsersList(props.users)
  }, [props.users])

  const initFilters = (filterData) => {
    if (filterData != "") {
      let filters = { filtering: {} };
      for (const key in filterData) {
        if (filterData[key]['name'] === "districtFilter") {
          filters.filtering.districtId = filterData[key]['value']
        }
        else if (filterData[key]['name'] === "kycFilter") {
          filters.filtering.kycStatus = filterData[key]['value']
        } else if (filterData[key]['name'] === "userTypeFilter") {
          filters.filtering.userType = filterData[key]['value']
        }
      }
      getUsers(filters)
      setSelectedFilters(filters)
    } else {
      getUsers("");
    }
    setGlobalFilterValue('');
  }

  const onGlobalFilterChange = (e) => {
    let filters = { filtering: {} }
    const value = e.target.value;
    filters.filtering.searchText = value;

    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      getUsers(filters)
    }, 1000);

    setTimer(newTimer);
    setGlobalFilterValue(value);
  }

  const clearFilter = (name) => {
    if (name != "" && name != undefined) {
      onHide(name)
    }
    setDisableKycFilter(true);
    setDisableUserFilter(true);
    setDisableDistrictFilter(true)
    setKycStatus(null);
    setUser(null);
    setDistrict(null)
    initFilters("");
    setAdvFilters([])
    getUsers("");
    setSelectedFilters({})
    setPersonData({})
  }

  const customBodyTemplate = (rowData, col) => {
    return (
      col.field === "vehiclesCount" ? <Badge value={rowData.vehiclesCount > 0 ? "Driver" : "Customer"} className="mr-2" severity={rowData.vehiclesCount > 0 ? "warning" : "info"} /> :
        col.field === "kycStatus" ? <Badge value={rowData.kycStatus} className="mr-2" severity={rowData.kycStatus === "APPROVED" ? "success" : "danger"} /> :
          col.field === "field_0" ? <Image src={`data/` + rowData.image}
            width="25"
            preview
            onError={(e) => (e.target.src = "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")}
            alt={rowData.image}
            className="user-image"
          /> :
            <Button className="p-button-rounded p-button-info p-button-sm" type="button" onClick={() => handleActionClick(rowData, 'displayResponsive')}>
              <i className="pi pi-user-edit" style={{ fontSize: "1em" }}></i>
            </Button>
    )
  };

  const dialogFuncMap = {
    'displayPosition': setDisplayPosition,
    'displayResponsive': setDisplayResponsive
  }

  const handleActionClick = (data, name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
    if (data !== "") {
      setPersonData(data)
      setPersonModalVisible(true)
    }
    props.getDistricts();
  }

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  }

  const applyAdvFilters = (name) => {
    if (advFilters.length > 0) {
      let filters = {}
      advFilters.map(filter => {
        if (filter == 'districtFilter') {
          filters.districtFilter = { name: filter, value: district.id }
        } else if (filter == 'userTypeFilter') {
          filters.userTypeFilter = { name: filter, value: user.toUpperCase() }
        } else {
          filters.kycFilter = { name: filter, value: kycStatus.toUpperCase() }
        }
      })
      initFilters(filters)
    }
    onHide(name);
  }

  const handleAdvFiltersChange = (e) => {
    let selectedFilters = [...advFilters];

    if (e.checked) {
      selectedFilters.push(e.value);
      if (e.value === 'userTypeFilter') {
        setDisableUserFilter(false)
      } else if (e.value === 'kycFilter') {
        setDisableKycFilter(false)
      } else if (e.value === "districtFilter") {
        setDisableDistrictFilter(false)
      }
    }
    else {
      selectedFilters.splice(selectedFilters.indexOf(e.value), 1);
      if (e.value === 'userTypeFilter') {
        setUser(null);
        setDisableUserFilter(true)
      } else if (e.value === 'kycFilter') {
        setKycStatus(null)
        setDisableKycFilter(true)
      } else if (e.value === "districtFilter") {
        setDistrict(null)
        setDisableDistrictFilter(true)
      }
    }
    setAdvFilters(selectedFilters);
  }

  const options = {
    user: ['Customer', 'Driver'],
    kycStatus: ['Approved', 'Pending'],
    districts: [
      { id: "10000001", name: 'Moga' }
    ]
  }

  const renderHeader = () => (
    <div className="d-flex justify-content-between">
      <div className="d-flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" className="p-inputtext-sm block global-search-input" />
        </span>
      </div>
      <div>
        <Button type="button" icon="pi pi-filter" label="Advanced Filters" className="p-button-outlined p-button-sm me-2" onClick={() => handleActionClick("", 'displayPosition', 'top-right')} />
        <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined p-button-sm p-button-danger" onClick={() => clearFilter("")} />
      </div>
    </div>
  )

  const renderFooter = (name, dialog) => {
    if (dialog === 'filters') {
      return (
        <div>
          <Button disabled={user != null || kycStatus != null || district != null ? false : true} label="Apply" icon="pi pi-check" onClick={() => applyAdvFilters(name)} className="p-button-text p-button-sm" />
          <Button disabled={user != null || kycStatus != null || district != null ? false : true} label="Clear" icon="pi pi-filter-slash" onClick={() => clearFilter(name)} className="p-button-sm p-button-danger" autoFocus />
        </div>
      );
    } else {
      return <Button label="Close" icon="pi pi-check" onClick={() => onHide(name)} className="p-button-sm" autoFocus />
    }
  }

  const onSort = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
    let sortFilters = { sorting: [] }
    if (sortOrder === null || sortOrder === 0) {
      sortFilters.sorting.push({ column: e.sortField, order: "asc" });
    } else if (sortOrder === 1) {
      sortFilters.sorting.push({ column: e.sortField, order: "desc" });
    } else {
      sortFilters = ""
    }
    getUsers(sortFilters);
  }

  const header = renderHeader();

  const columns = [
    { header: "Photo", body: customBodyTemplate, style: { width: '3%' } },
    { field: "firstName", header: "First Name", style: { width: '15%' }, sortable: true },
    { field: "lastName", header: "Last Name", style: { width: '15%' }, sortable: true },
    { field: "mobileNumber", header: "Mobile Number", style: { width: '8%' } },
    { field: "city", header: "City", style: { width: '10%' }, sortable: true },
    { field: "districtName", header: "District", style: { width: '10%' } },
    { field: "kycStatus", header: "KYC Status", body: customBodyTemplate, style: { width: '6%' }, sortable: true },
    { field: "vehiclesCount", header: "Type", body: customBodyTemplate, style: { width: '6%' }, sortable: true },
    { header: "Actions", body: customBodyTemplate, style: { width: '3%' } }
  ];

  const paginatorTemplate = {
    layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
    'RowsPerPageDropdown': (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
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

  const onCustomPaginatorPage = (event) => {
    let data = {};
    data.page = event.page + 1;
    data.pageSize = event.rows
    getUsers(data);
    setPageData({ first: event.first, pageSize: event.rows, page: event.page + 1 })
  }

  const hidePersonModal = () => {
    setPersonModalVisible(false)
    if (selectedFilters != null) {
      getUsers(selectedFilters)
    } else {
      getUsers("")
    }
  }

  return (
    <div className="datatable-templating-demo">
      <div className="card">
        <DataGrid
          columns={columns}
          value={props.users.data}
          stripedRows={true}
          size="small"
          responsiveLayout="scroll"
          paginator={true}
          showGridlines={true}
          rows={pageData.pageSize}
          dataKey="id"
          filtering={true}
          loading={loading}
          globalFilterFields={['firstName', 'lastName', 'mobileNumber', 'city']}
          header={header}
          emptyMessage="No records found."
          removableSort={true}
          onSort={onSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />
        {usersList.metaData != undefined ?
          <Paginator
            template={paginatorTemplate}
            first={pageData.first}
            rows={pageData.pageSize}
            totalRecords={usersList.metaData.totalCount}
            onPageChange={onCustomPaginatorPage}
            className="justify-content-end my-3"
          /> : null
        }
      </div>
      <div>
        {personModalVisible === true ?
          <PersonDetails
            data={personData}
            modelVisible={personModalVisible}
            hideModal={() => hidePersonModal()}
          /> : null}
        <Dialog
          header="Advanced filters"
          visible={displayPosition}
          position={position}
          modal
          style={{ width: '20vw' }}
          footer={renderFooter('displayPosition', 'filters')}
          onHide={() => onHide('displayPosition')}
          draggable={false}
          resizable={false}
        >
          <div>
            <div className="row g-3 align-items-center">
              <div className="col-12 d-flex align-items-center">
                <Checkbox inputId="districtFilter" name="districtFilter" value="districtFilter" onChange={handleAdvFiltersChange} className="me-2" checked={advFilters.indexOf('districtFilter') !== -1} />
                <Dropdown disabled={disableDistrictFilter} value={district} options={props.districts != undefined ? props.districts.data : null} onChange={(e) => setDistrict(e.value)} optionLabel="districtName" placeholder="Select a District" />
              </div>
              <div className="col-12 d-flex align-items-center">
                <Checkbox inputId="userTypeFilter" name="userTypeFilter" value="userTypeFilter" onChange={handleAdvFiltersChange} className="me-2" checked={advFilters.indexOf('userTypeFilter') !== -1} />
                <SelectButton disabled={disableUserFilter} value={user} options={options.user} onChange={(e) => setUser(e.value)} />
              </div>
              <div className="col-12 d-flex align-items-center">
                <Checkbox inputId="kycFilter" name="kycFilter" value="kycFilter" onChange={handleAdvFiltersChange} className="me-2" checked={advFilters.indexOf('kycFilter') !== -1} />
                <SelectButton disabled={disableKycFilter} value={kycStatus} options={options.kycStatus} onChange={(e) => setKycStatus(e.value)} />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    users: state.getAllUsers.users,
    districts: state.getDistricts.districts,

    error: state.getDistricts.error,
    error: state.getAllUsers.error
  };
};

const mapDispatchToProps = {
  getAllUsers, getDistricts
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonsList);