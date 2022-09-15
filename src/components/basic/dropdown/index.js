import React from 'react'

export const DropdownComponent = props => {
    const options = [<option defaultValue>{props.labelName}</option>];

    props.options.map(option => (
        options.push(<option key={option.id} value={option.locationLat ? `{"id":`+option.id+`, "lat":` + option.locationLat + `,"lng":` + option.locationLong + `}` : option.value}>{option.locationName ? option.locationName : option.name}</option>)
    ));

    return (
        <div className="form-group col-md-2 me-2">
            <select className="form-control" name="{props.labelName}" onChange={props.onSearchChange}>                           
                {options}
            </select>
        </div>
    );
}