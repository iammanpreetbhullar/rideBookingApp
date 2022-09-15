import React, { createRef, useRef } from 'react';
import { connect } from 'react-redux';
import '../App.scss'
// import Toast from '../common/Toast';
import { Toast } from 'primereact/toast';
import { getAllVehicleLocations } from '../../actions/getAllVehicleLocs';
import { updateVehicleLocations } from '../../actions/postVehicleLocs';
import { rickshaw } from '../../assets/Icons/rickshawPNG';
import { Button } from 'react-bootstrap';

let mapRef = createRef();
const H = window.H;
const API_KEY = 'p5zSgmAQ8LHG0btCQm3eErJpB2rJBXVquI8cQjZcPDE';
const DEFAULT_DISTRICT = { id: 10000001, lat: 30.8201556, lng: 75.1720059 };
const RICKSHAW_ICON = new H.map.Icon(rickshaw, { size: { w: 30, h: 30 } });

class VehicleLocMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            map: null,
            hasChanges: false,
            relocatedLocs: []
        }
    }

    prepareGlobalMap() {
        const defaultLayers = new H.service.Platform({ apikey: API_KEY }).createDefaultLayers();
        return new H.Map(
            mapRef.current,
            defaultLayers.vector.normal.map,
            {
                center: DEFAULT_DISTRICT,
                zoom: 14,
                pixelRatio: window.devicePixelRatio || 1
            }
        );
    }

    componentDidMount() {
        let vehicleId = "";
        let latitude = "";
        let longitude = "";
        this.getAllVehicleLocations().then(result => {
            const { map } = this.state;
            if (!map) {
                const newMap = this.prepareGlobalMap();
                const markerArray = this.props.vehicleLocDetails;

                markerArray.map(mark => {
                    const marker = this.createMarker({
                        id: mark.vehicle.id,
                        lat: mark.latitude,
                        lng: mark.longitude
                    });
                    this.addMarkersToMap(newMap, marker);
                });

                this.setState({ map: newMap });

                const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));

                // drag location start
                newMap.addEventListener('dragstart', function (ev) {
                    var target = ev.target,
                        pointer = ev.currentPointer;
                    if (target instanceof H.map.Marker) {
                        var targetPosition = newMap.geoToScreen(target.getGeometry());
                        target['offset'] = new H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y);
                        behavior.disable();

                        vehicleId = target.id;
                    }
                }, false);

                // drag location end
                newMap.addEventListener('dragend', (ev) => {
                    var target = ev.target;
                    if (target instanceof H.map.Marker) {

                        behavior.enable();
                        let locCoords = target.a;
                        latitude = (locCoords.lat).toString().substring(0, 10);
                        longitude = (locCoords.lng).toString().substring(0, 10);

                        const { relocatedLocs } = this.state;

                        relocatedLocs.push({ vehicleId, latitude, longitude });

                        this.setState({ hasChanges: true, relocatedLocs: relocatedLocs });
                    }
                }, false);

                // drag location
                newMap.addEventListener('drag', (ev) => {
                    var target = ev.target,
                        pointer = ev.currentPointer;
                    if (target instanceof H.map.Marker) {
                        target.setGeometry(newMap.screenToGeo(pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y));
                    }
                }, false);
            } else {
                map.setCenter(DEFAULT_DISTRICT);
            }
        });

    }

    componentWillUnmount() {
        this.state.map.dispose()
    }

    getAllVehicleLocations = async () => {
        await this.props.getAllVehicleLocations();
    }

    createMarker = (markerPoint) => {
        let marker = new H.map.Marker(markerPoint, { icon: RICKSHAW_ICON }, { volatility: true });
        marker.id = markerPoint.id;
        marker.draggable = true;
        return marker;
    }

    addMarkersToMap = (map, marker) => {
        map && map.addObject(marker);
    }

    onSave = async () => {
        const { relocatedLocs } = this.state;
        const effectiveLocs = Object.values(relocatedLocs.reduce((a, item) => {
            a[item.vehicleId] = item;
            return a;
        }, {}));

        await this.props.updateVehicleLocations(effectiveLocs).then(result => {
            this.setState({ hasChanges: false, relocatedLocs: [] });
            this.toast.show({severity: 'success', summary: 'Success', detail: 'Changes have been updated successfully', life: 3000});
            // new window.bootstrap.Toast(document.querySelectorAll('.toast')[0]).show();
        });
    }

    render() {
        return (
            <>
                <div>
                    <div id="select_div">
                        <Button disabled={!this.state.hasChanges} onClick={this.onSave} >Save</Button>
                    </div>
                    <div ref={mapRef} style={{ height: "94.5vh" }} />
                </div>
                {/* <Toast content={{title:'Vehicle Locations',message:'Changes have been updated successfully'}}/> */}
                <Toast ref={(el) => this.toast = el} position="bottom-right" />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        vehicleLocDetails: state.getVehicleLocs.vehicleLocDetails,
        error: state.getVehicleLocs.error
    };
};

const mapDispatchToProps = {
    getAllVehicleLocations,
    updateVehicleLocations
};

export default connect(mapStateToProps, mapDispatchToProps)(VehicleLocMap);