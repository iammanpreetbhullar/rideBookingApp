import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { connect } from 'react-redux';
import { getAllUsers } from "../../actions/getUsers";
import { getDistricts } from '../../actions/getDistricts';
import { getLocationsByDistrictId, getLocationCategories } from '../../actions/locationDetails';
import loader from '../../assets/loaders/rickshawLoading.gif'
import logo from '../../assets/images/logo.png'

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaderShow: true,
      usersData: [],
      districtsData: [],
      locationsData: [],
      userCount: 0,
      districtsCount: 0,
      locationsCount: 0,
      pageData: { pageSize: 10, page: 1 }
    };
  }

  componentDidMount = async () => {
    // this.setState({ loaderShow: true })
    // await this.fetchUsers().then(() => {
    //   this.countUsers();
    // });
    // await this.fetchDistricts().then(() => {
    //   this.countDistricts();
    // });
    // await this.fetchLocations().then(() => {
    //   this.countLocations();
    // })
  }

  fetchDistricts = async () => {
    await this.props.getDistricts().then(() => {
      if (this.props.districts !== undefined) {
        this.props.districts.data.map(j => {
          this.state.districtsData.push(j)
        })
      }
    })
  }

  fetchUsers = async () => {
    await this.props.getAllUsers(this.state.pageData).then(async () => {
      if (this.props.users !== undefined) {
        if (this.props.users.data.length == 10) {
          this.props.users.data.map(i => {
            this.state.usersData.push(i)
          })
          this.setState({
            loaderShow: false, pageData: {
              ...this.state.pageData,
              page: this.state.pageData.page + 1
            }
          })
          await this.fetchUsers(this.state.pageData);
        } else {
          this.props.users.data.map(i => {
            this.state.usersData.push(i)
          })
          this.setState({ loaderShow: false, pageData: { page: 1, pageSize: 10 } })
        }
      }
    });
  }

  fetchLocations = async () => {
    const { pageData } = this.state;
    pageData.id = '10000001';
    await this.props.getLocationsByDistrictId(pageData).then(async () => {
      if (this.props.districtLocations !== undefined) {
        if (this.props.districtLocations.data.length == 10) {
          this.props.districtLocations.data.map(i => {
            this.state.locationsData.push(i)
          })
          this.setState({
            pageData: {
              ...this.state.pageData,
              page: this.state.pageData.page + 1
            }
          })
          await this.fetchLocations(pageData);
        } else {
          this.props.districtLocations.data.map(i => {
            this.state.locationsData.push(i)
          })
          this.setState({ pageData: { page: 1, pageSize: 10 } })
        }
      }
    });
  }

  countUsers = () => {
    const { userCount, usersData } = this.state;
    if (userCount != usersData.length) {
      setTimeout(() => {
        this.setState({ userCount: userCount + 1 })
        this.countUsers();
      }, 100);
    }
  }

  countDistricts = () => {
    const { districtsCount, districtsData } = this.state;
    if (districtsCount != districtsData.length) {
      setTimeout(() => {
        this.setState({ districtsCount: districtsCount + 1 })
        this.countDistricts();
      }, 100);
    }
  }

  countLocations = () => {
    const { locationsCount, locationsData } = this.state;
    if (locationsCount != locationsData.length) {
      setTimeout(() => {
        this.setState({ locationsCount: locationsCount + 1 })
        this.countLocations();
      }, 100);
    }
  }

  render() {
    return (
      <>
        <div className='d-flex justify-content-center align-itmes-center fw-bold fs-4' style={{marginTop:'270px'}}>
          <img src={logo}  />
        </div>
        {/* {this.state.loaderShow ?
          <div className='bg-transparent w-100 d-flex justify-content-center align-items-center' style={{ height: '93.5vh' }}>
            <img src={loader} width='20%' />
          </div> :
          <>
            <div className='row'>
              <div className='col-md-6 d-flex justify-content-center align-itmes-center bg-white' style={{ height: '90vh' }}>
                <img src={logo} style={{ width: '-webkit-fill-available', height: '80%' }} />
              </div>
              <div className='col-md-6 bg-white'>
                <div className='col-md-12 d-flex justify-content-center'>
                  <div className='col-md-6'>
                    <div><b>Total Number of Users</b> <br /><h1>{this.state.userCount}</h1></div>
                  </div>
                  <div className='col-md-6'>
                    <div><b>Total Number of Locations</b> <br /><h1>{this.state.locationsCount}</h1></div>
                  </div>
                </div>
                <div className='col-md-12 d-flex justify-content-center'>
                  <div><b>Total Number of Districts</b> <br /><h1>{this.state.districtsCount}</h1></div>
                </div>
              </div>
            </div>
          </>
        } */}
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    users: state.getAllUsers.users,
    districtLocations: state.locationDetails.districtLocations,
    districts: state.getDistricts.districts,

    error: state.getAllUsers.error,
    error: state.locationDetails.error,
    error: state.getDistricts.error
  };
};

const mapDispatchToProps = {
  getAllUsers,
  getLocationsByDistrictId,
  getDistricts
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);