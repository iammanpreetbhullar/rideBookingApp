import React, { useEffect, useState, createRef, useRef } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { getLocationsByDistrictId } from '../../actions/locationDetails';
import { postLocationRoutes } from '../../actions/postRoutes';
import { getLocationRoutes } from '../../actions/getRoutes';
import { rickshaw } from '../../assets/Icons/rickshawPNG'
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { getDistricts } from "../../actions/getDistricts";
import * as bootstrap from 'bootstrap';
import '../App.scss'
import './RoutesMap.css'
window.bootstrap = bootstrap;

const H = window.H;
const DEFAULT_DISTRICT = { id: 10000001, lat: 30.8201556, lng: 75.1720059, page: "1", pageSize: "500" };
const API_KEY = 'p5zSgmAQ8LHG0btCQm3eErJpB2rJBXVquI8cQjZcPDE';
const icon = new H.map.Icon(rickshaw, { size: { w: 25, h: 25 } });

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
    const [disableDistrictFilter, setDisableDistrictFilter] = useState(true);

    useEffect(() => {
        getAllLocations();                                                                                                           //fetching all the locations of district
        getAllDistricts();
    }, [])

    useEffect(() => {
        setMarkerArray(props.locations.data)                                                                                      // setting response of API into markerArray
    }, [props.locations])

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
        props.getLocationsByDistrictId(DEFAULT_DISTRICT);
    }

    const getAllDistricts = () => {
        props.getDistricts();
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

    const generateMarker = (markCoords) => {
        let marker = new H.map.Marker(markCoords,
            { icon: icon },
            { volatility: true }
        );
        marker.draggable = true;
        return marker;
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

            // var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
            //     content: evt.target.getData()
            // });
            // ui.addBubble(bubble)
        }, false)
        if (markerArray != undefined) {
            if (markerArray.length > 0) {
                markerArray.map(mark => {
                    const coords = { lat: mark.locationLat, lng: mark.locationLong }
                    addMarkerToGroup(group, generateMarker(coords), mark.locationName);
                })
            }
        }
    }

    const handleOptionChange = (e) => {
        const location = e.value;
        setSelectedLocation(location)
        if (location != undefined) {
            console.log(location)
            setCenterLocation({
                id: location.id,
                lat: location.locationLat,
                lng: location.locationLong
            });
            map.setCenter({ lat: location.locationLat, lng: location.locationLong })
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

    return (
        <><div>
            {map && markerArray != undefined ?
                < div id="select_div" className='d-flex justify-content-between'>
                    <div className='row' >
                        <div className="col-6">
                            <Dropdown
                                // style={{ width: '16%' }}
                                value={selectedLocation}
                                options={markerArray}
                                onChange={handleOptionChange}
                                optionLabel="locationName"
                                filter
                                showClear
                                filterBy="locationName"
                                placeholder="Select a location"
                                className='w-100'
                            />
                        </div>
                        <div className="col-6 ">
                            <Dropdown
                                // disabled={disableDistrictFilter}
                                value={district}
                                options={props.districts != undefined ? props.districts.data : null}
                                onChange={(e) => setDistrict(e.value)}
                                optionLabel="districtName"
                                placeholder="Select a District"
                            />
                        </div>
                    </div>
                    <Button disabled={!enableSave} onClick={handleOnSave} >Save</Button>
                </div> : null
            }

            {/* Map */}
            <div className='message' id='message'>
                <div >Kindly select a location to proceed.</div>
            </div>
            <div ref={mapRef} style={{ height: "86.3vh" }} className="map" id="map" />
        </div>
            <Toast ref={toast} position="bottom-right" />
        </>
    );

}

const mapStateToProps = state => {
    return {
        locations: state.locationDetails.districtLocations,
        locationRoutes: state.getRoutesData.routesDetails,
        districts: state.getDistricts.districts,

        error: state.getDistricts.error,
        error: state.locationDetails.error
    };
};

const mapDispatchToProps = {
    postLocationRoutes,
    getLocationRoutes,
    getLocationsByDistrictId,
    getDistricts
};

export default connect(mapStateToProps, mapDispatchToProps)(RoutesMap);