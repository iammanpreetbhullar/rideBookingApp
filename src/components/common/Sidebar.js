import React from 'react';
import { withRouter } from 'react-router-dom';
import '../../assets/Sidebar.css';
import { Sidebar } from 'primereact/sidebar';

function CommonSidebar(props) {

  return (
    <div className="sidebar bg-clr-light-grey" id="sidebar">
      <Sidebar visible={props.showSidebar} onHide={props.hideSideBar}>
        Content
      </Sidebar>
    </div>
  )
}


export default withRouter(CommonSidebar);