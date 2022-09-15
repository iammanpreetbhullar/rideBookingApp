import React from 'react';

const NavBar = (props) => {
    return (
        <div className='newToast'>
            <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <strong className="me-auto">{props.content.title}</strong>
                    <small className="text-muted">just now</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    {props.content.message}
                    <div className="mt-2 pt-2 border-top">
                        <button type="button" className="btn btn-secondary btn-sm me-2" data-bs-dismiss="toast">Ok</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NavBar; 
