import React, { useEffect, useState, createRef, useRef } from 'react';
import { connect } from 'react-redux';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import * as bootstrap from 'bootstrap';
import { getLocationsByDistrictId } from '../../actions/locationDetails';
import { postLocationRoutes } from '../../actions/postRoutes';
import { getLocationRoutes } from '../../actions/getRoutes';
import { getDistricts } from "../../actions/getDistricts";
import { rickshaw } from '../../assets/Icons/rickshawPNG'
import { centerIcon } from '../../assets/Icons/centerMarkerIcon'
import loader from '../../assets/loaders/rickshawLoading.gif'
// import '../App.scss'
import './RoutesMap.css'

window.bootstrap = bootstrap;

const H = window.H;
const DEFAULT_DISTRICT = { id: 10000001, lat: 30.8201556, lng: 75.1720059, page: "1", pageSize: "500" };
const API_KEY = 'p5zSgmAQ8LHG0btCQm3eErJpB2rJBXVquI8cQjZcPDE';
const icon = new H.map.Icon(rickshaw, { size: { w: 25, h: 25 } });
const icon2 = new H.map.Icon(centerIcon, { size: { w: 45, h: 45 } });
let counter = 0;
let randomId = "";

function RoutesMap(props) {
    const mapRef = createRef();
    const toast = useRef(null);
    const [map, setMap] = useState(null);
    const [markerArray, setMarkerArray] = useState([]);
    const [enableSave, setEnableSave] = useState(false);
    const [dataObject, setDataObject] = useState({});
    const [ui, setUi] = useState();
    const [centerLocation, setCenterLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [district, setDistrict] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [disableDistrictFilter, setDisableDistrictFilter] = useState(true);
    const [loaderShow, setLoaderShow] = useState(false)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setLoaderShow(true);
        getAllLocations();                                                                                                           //fetching all the locations of district
        getAllDistricts();
    }, [])

    useEffect(() => {
        setDistricts(props.districts.data)
        setMarkerArray(props.locations.data)                                                                                      // setting response of API into markerArray
    }, [props.locations, props.districts])

    useEffect(() => {
        drawMap();
        if (props.locationRoutes.length > 0) {
            props.locationRoutes.map(route => {
                const endPointMarker = markerArray.find(o => o.id === route.toLocationId);
                let endPoint = { lat: endPointMarker.locationLat, lng: endPointMarker.locationLong };
                addPolylineToMap(endPoint, route.toLocationId);
            });
        }
    }, [props.locationRoutes, markerArray, map]);

    useEffect(() => {
        return () => {
            map.dispose()
        }
    }, [])

    const getAllLocations = () => {
        props.getLocationsByDistrictId(DEFAULT_DISTRICT).then(() => {
            if (props.locationDetailsError) {
                alert("Could not get locations due to network error")
            }
        });
    }

    const getAllDistricts = () => {
        props.getDistricts().then(() => {
            if (props.getDistrictsError) {
                alert("Could not get districts due to network error")
            }
        });
    }

    const clearMapRoutes = () => {
        let objects = map.getObjects();
        objects.map(o => {
            map.removeObject(o);
        });
    }

    const drawMap = () => {
        if (map) {
            clearMapRoutes();
            addInfoBubble(map);
        } else {
            const defaultLayers = new H.service.Platform({ apikey: API_KEY }).createDefaultLayers();
            const map = new H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    center: { lat: 30.8201556, lng: 75.1720059 },
                    zoom: 14,
                    pixelRatio: window.devicePixelRatio || 1
                }
            );
            const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
            const ui = H.ui.UI.createDefault(map, defaultLayers);

            setUi(ui)
            setMap(map);
        }
    }

    const getLocationRoutes = async (id) => {
        props.getLocationRoutes(id)
    }

    const generateMarker = (markCoords, args) => {
        if (args) {
            let marker = new H.map.Marker(markCoords,
                { icon: icon2 },
                { volatility: true }
            );
            return marker;
        } else {
            let marker = new H.map.Marker(markCoords,
                { icon: icon },
                { volatility: true }
            );
            return marker;
        }
    }

    const addPolylineToMap = (endPoint, e) => {
        let objects = map.getObjects();
        if (endPoint !== "") {
            let found = false;
            objects.map(o => {
                if (o.id === e) {
                    found = true;
                }
            })
            if (!found) {
                let lineString = new H.geo.LineString();
                lineString.pushPoint({ lat: centerLocation.lat, lng: centerLocation.lng });
                lineString.pushPoint(endPoint);
                let polyline = new H.map.Polyline(
                    lineString, { style: { lineWidth: 2 } }
                );
                polyline.id = e;
                map.addObject(polyline);
            } else {
                objects.map(o => {
                    if (o.id === e) {
                        map.removeObject(o);
                    }
                })
            }
        } else {
            objects.map(o => {
                if (o.id != undefined) {
                    let id = o.id.substring(0, 5);
                    if (id) {
                        map.removeObject(o);
                    }
                }
            })
        }
    };

    const addMarkerToGroup = (group, marker, html) => {
        marker.setData(html);
        group.addObject(marker);    // add custom data to the marker
        setLoaderShow(false);
    }

    const addInfoBubble = (map) => {
        const group = new H.map.Group();
        map.addObject(group);
        group.addEventListener('tap', function (evt) {                                                                              // added 'tap' event listener, that opens info bubble, to the group
            setEnableSave(true);
            let endPoint = evt.target.getGeometry();
            let lat = endPoint.lat;
            let lng = endPoint.lng;
            const marker = markerArray.find(itm => itm.locationLat === lat.toString() && itm.locationLong === lng.toString());
            addPolylineToMap(endPoint, marker.id);

        }, false);
        group.addEventListener('pointermove', function (e) {
            counter = counter + 1;
            generateRandomId();
            if (counter === 1 && randomId != "") {
                const xy = map.geoToScreen(e.target.getGeometry());
                var bubble = new H.ui.InfoBubble(map.screenToGeo(xy.x, xy.y - 30), {
                    content: e.target.getData()
                });
                bubble.bubbleId = randomId
                ui.addBubble(bubble)
                setTimeout(() => {
                    bubble.close()
                    counter = 0;
                }, 700);
            }
        }, false);
        if (markerArray != undefined) {
            if (markerArray.length > 0) {
                if (selectedLocation != null) {
                    let newArray = [...markerArray];
                    let indexToRemove = markerArray.findIndex(i => i.id === selectedLocation.id);
                    let objToRemove = markerArray.find(i => i.id === selectedLocation.id);
                    // console.log(objToRemove, markerArray, selectedLocation)
                    // setTimeout(() => {
                    newArray.splice(indexToRemove, 1);
                    Promise.all(newArray.map(mark => {
                        const coords = { lat: mark.locationLat, lng: mark.locationLong }
                        addMarkerToGroup(group, generateMarker(coords), mark.locationName);
                    }))
                    // }, 400);
                    const coord = { lat: objToRemove.locationLat, lng: objToRemove.locationLong }
                    addMarkerToGroup(group, generateMarker(coord, "centered"), objToRemove.locationName);
                } else {
                    markerArray.map(mark => {
                        const coords = { lat: mark.locationLat, lng: mark.locationLong }
                        addMarkerToGroup(group, generateMarker(coords), mark.locationName);
                    })
                }
            }
        }
    }

    const generateRandomId = () => {
        randomId = Math.random().toString(36).slice(2)
    }

    const showInfoBubble = (e) => {
        const xy = map.geoToScreen({ lat: e.locationLat, lng: e.locationLong });
        let bubble = new H.ui.InfoBubble(map.screenToGeo(xy.x, xy.y - 30), {
            content: e.locationName
        });
        ui.addBubble(bubble)
        setTimeout(() => {
            bubble.close()
        }, 1000);
    }

    const handleOptionChange = (e) => {
        const location = e.value;
        if (location != undefined) {
            showInfoBubble(location);
            setSelectedLocation(location)
            setCenterLocation({
                id: location.id,
                lat: location.locationLat,
                lng: location.locationLong
            });
            map.setCenter({ lat: location.locationLat, lng: location.locationLong })
            map.setZoom(15, true)
            getLocationRoutes(location.id);

            setEnableSave(false);
            let mapDiv = document.getElementById('map');
            let messageDiv = document.getElementById('message');
            messageDiv.style.display = 'none';
            mapDiv.classList.remove('map');
        }
    }

    const handleOnSave = async () => {
        if (enableSave != false) {
            let tempArray = [];
            let centerPoint = centerLocation;
            let objects = map.getObjects();
            objects.map(o => {
                if (o.id != undefined) {
                    let id = o.id.substring(0, 5);
                    if (id) {
                        tempArray.push(o)
                    }
                }
            })
            let routesArray = [];
            tempArray.map(itm => {
                const marker = markerArray.find(i => i.id === itm.id)
                let markerObj = { id: marker.id, locationCategoryId: marker.locationCategoryId }
                routesArray.push(markerObj)
            })
            setDataObject({ id: centerPoint.id, routes: routesArray });

            await props.postLocationRoutes({ id: centerPoint.id, routes: routesArray }).then(result => {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Changes have been updated successfully', life: 3000 });
            }).catch(error => {
                console.log(error);
            });
        }
        setEnableSave(false);
    }

    const handleCheck = (e) => {
        setChecked(e.checked)
    }

    return (
        <>
            {loaderShow ?
                <div className='bg-transparent w-100 d-flex justify-content-center align-items-center' style={{ height: '93%' }}>
                    <img src={loader} width='20%' />
                </div> : null
            }
            {loaderShow != true ?
                map && markerArray != undefined ?
                    <div>
                        < div className='row g-0 mx-2 mt-2 d-flex align-items-center'>
                            <div className='col-md-2 gx-2'>
                                <Dropdown
                                    // style={{ width: '16%' }}
                                    value={selectedLocation}
                                    options={markerArray}
                                    onChange={handleOptionChange}
                                    optionLabel="locationName"
                                    filter
                                    // showClear
                                    filterBy="locationName"
                                    placeholder="Select a location"
                                    className='w-100'
                                />
                            </div>
                            {districts !== undefined ?
                                districts.length > 0 ?
                                    <div className='col-md-2 gx-2'>
                                        <Dropdown
                                            // disabled={disableDistrictFilter}
                                            value={district}
                                            options={districts != undefined ? districts : null}
                                            onChange={(e) => setDistrict(e.value)}
                                            optionLabel="districtName"
                                            placeholder={districts[0].id == DEFAULT_DISTRICT.id ? districts[0].districtName : "Select a District"}
                                            className='w-100'
                                        />
                                    </div>
                                    : null : null
                            }
                            <div className="field-checkbox col-md-2 gx-2">
                                <Checkbox inputId="binary" className='me-2' checked={checked} onChange={(e) => handleCheck(e)} />
                                <label htmlFor="binary">Show Markers with no routes</label>
                            </div>
                            <div className='col-md-6 text-end'>
                                <Button disabled={!enableSave} type='button' icon="pi pi-save" label='Save' className="p-button-sm" onClick={handleOnSave}></Button>
                            </div>
                        </div>
                        <div className='message' id='message'>
                            <div >Kindly select a location to proceed.</div>
                        </div>
                    </div> : null : null
            }
            {/* <div className='row'>
                <div className='col-md-12'>
                    <div className='card'> */}
            <div ref={mapRef} style={{ height: "86.5vh" }} hidden={loaderShow ? true : false} className="map p-1 m-2 border rounded" id='map' />
            {/* </div>
                </div>
            </div> */}
            <Toast ref={toast} position="bottom-right" />
        </>
    );
}

const mapStateToProps = state => {
    console.log(state);
    return {
        locations: state.locationDetails.districtLocations,
        locationRoutes: state.getRoutesData.routesDetails,
        districts: state.getDistricts.districts,

        getDistrictsError: state.getDistricts.error,
        locationDetailsError: state.locationDetails.error
    };
};

const mapDispatchToProps = {
    postLocationRoutes,
    getLocationRoutes,
    getLocationsByDistrictId,
    getDistricts
};

export default connect(mapStateToProps, mapDispatchToProps)(RoutesMap);