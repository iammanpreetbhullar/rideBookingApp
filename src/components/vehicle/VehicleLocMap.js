import React, { createRef, useRef } from 'react';
import { connect } from 'react-redux';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { getAllVehicleLocations } from '../../actions/getAllVehicleLocs';
import { updateVehicleLocations } from '../../actions/postVehicleLocs';
import { rickshaw } from '../../assets/Icons/rickshawPNG';
import loader from '../../assets/loaders/rickshawLoading.gif'
import '../App.scss'

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
            relocatedLocs: [],
            loaderShow: false,
            ui: {},
            checked: false,
            bubbles: []
        }
    }

    prepareGlobalMap() {
        const defaultLayers = new H.service.Platform({ apikey: API_KEY }).createDefaultLayers();
        const map = new H.Map(
            mapRef.current,
            defaultLayers.vector.normal.map,
            {
                center: DEFAULT_DISTRICT,
                zoom: 14,
                pixelRatio: window.devicePixelRatio || 1
            }
        );
        const ui = H.ui.UI.createDefault(map, defaultLayers);
        this.setState({ map: map, ui: ui })
        return map;
    }

    componentDidMount() {
        this.setState({ loaderShow: true })
        let vehicleId = "";
        let latitude = "";
        let longitude = "";
        this.getAllVehicleLocations().then(result => {
            if (this.props.error) {
                alert(this.props.error)
            }
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
                    //this.showInfoBubble(mark)
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

    showInfoBubble = () => {
        const { map, ui } = this.state;
        const markerArray = this.props.vehicleLocDetails;
        if (this.state.checked === true) {
            markerArray.map(mark => {
                const xy = map.geoToScreen({ lat: mark.latitude, lng: mark.longitude });
                this.state.bubbles.push(new H.ui.InfoBubble(map.screenToGeo(xy.x, xy.y - 30), {
                    content: mark.vehicle.person.mobileNumber
                }))
            });
            this.state.bubbles.map(bubble => {
                ui.addBubble(bubble)
            })
        } else {
            this.state.bubbles.map(bubble => {
                bubble.close()
            })
        }
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
        this.setState({ loaderShow: false })
    }

    onSave = async () => {
        const { relocatedLocs } = this.state;
        const effectiveLocs = Object.values(relocatedLocs.reduce((a, item) => {
            a[item.vehicleId] = item;
            return a;
        }, {}));

        await this.props.updateVehicleLocations(effectiveLocs).then(result => {
            this.setState({ hasChanges: false, relocatedLocs: [] });
            this.toast.show({ severity: 'success', summary: 'Success', detail: 'Changes have been updated successfully', life: 3000 });
            // new window.bootstrap.Toast(document.querySelectorAll('.toast')[0]).show();
        });
    }

    handleCheck = (e) => {
        this.setState({ checked: e.checked })
        setTimeout(() => {
            this.showInfoBubble();
        }, 200);
    }

    render() {
        return (
            <>
                {this.state.loaderShow ?
                    <div className='bg-transparent w-100 d-flex justify-content-center align-items-center' style={{ height: '93%' }}>
                        <img src={loader} width='20%' />
                    </div> :
                    <div className='m-2 d-flex justify-content-between'>
                        <div className="field-checkbox">
                            <Checkbox inputId="binary" className='me-2' checked={this.state.checked} onChange={(e) => this.handleCheck(e)} />
                            <label htmlFor="binary">Show Info Bubbles</label>
                        </div>
                        <Button disabled={!this.state.hasChanges} type='button' icon="pi pi-save" label='Save' className="p-button-sm" onClick={this.onSave}></Button>
                        {/* <Button disabled={!this.state.hasChanges} onClick={this.onSave} >Save</Button> */}
                    </div>
                }
                <div ref={mapRef} style={{ height: "88.1vh" }} className="map p-1 m-2 border rounded" />
                {/* <Toast content={{title:'Vehicle Locations',message:'Changes have been updated successfully'}}/> */}
                <Toast ref={(el) => this.toast = el} position="bottom-right" />
            </>
        );
    }
}

const mapStateToProps = state => {
    console.log(state.getVehicleLocs.vehicleLocDetails)
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