import React, { useEffect, useContext, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import path from '../../router/path';
import styles from './styles.module.scss';

import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';

import {
  setPosition,
  setLocation,
  setSelectStopIndex,
} from '../../store/actions';
import { StoreContext } from '../../store/reducer';

function LocationMarker() {
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const {
    state: { position, location, nearbyStops, selectStopIndex },
    dispatch,
  } = useContext(StoreContext);

  const redIcon = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: styles.currentIcon,
  });

  const largeBlueIcon = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [37, 61],
    iconAnchor: [19, 61],
    popupAnchor: [1, -34],
    shadowSize: [61, 61],
    className: styles.selectIcon,
  });

  const blueIcon = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const initMap = useMap();

  useEffect(() => {
    initMap.locate().on('locationfound', function (e) {
      // console.log(e.latlng);
      // console.log(e.bounds._northEast);
      setPosition(dispatch, { position: e.latlng });
      setSelectStopIndex(dispatch, { index: 0 });
      // setPosition(dispatch, { position: e.bounds._northEast });
      initMap.flyTo(e.latlng, initMap.getZoom());
    });
  }, [initMap]);

  const clickMap = useMapEvents({
    click(e) {
      setPosition(dispatch, { position: e.latlng });
      setSelectStopIndex(dispatch, { index: 0 });
      clickMap.flyTo(e.latlng, clickMap.getZoom());
    },
  });

  useEffect(() => {
    if (position) {
      setLocation(dispatch, { lng: position.lng, lat: position.lat });
      setMarkers([]);
    }
  }, [position]);

  useEffect(() => {
    if (nearbyStops) {
      var stopsArray = [];
      nearbyStops.map((nearbyStop) => {
        stopsArray.push({
          position: {
            lat: nearbyStop.stationLat,
            lng: nearbyStop.stationLon,
          },
          stationName: nearbyStop.stationName,
        });
      });
      setMarkers(stopsArray);
    }
  }, [nearbyStops]);

  return location === null ? null : (
    <Fragment>
      <Marker position={position} icon={redIcon}>
        <Tooltip className={styles.tooltip} direction="top" offset={[0, -41]}>
          <b>縣市</b>: {location.city} <br />
          <b>鄉鎮</b>: {location.town}
        </Tooltip>
      </Marker>
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          icon={index === selectStopIndex ? largeBlueIcon : blueIcon}
          className={styles.allIcon}
          eventHandlers={{
            click: () => {
              setSelectStopIndex(dispatch, { index: index });
              navigate(path.certainStop, {
                state: { clickStopIndex: index },
              });
            },
          }}
        >
          <Tooltip className={styles.tooltip} direction="top" offset={[0, -40]}>
            <b>站牌名稱</b>: {marker.stationName} <br />
          </Tooltip>
        </Marker>
      ))}
    </Fragment>
  );
}

function Map() {
  return (
    <Fragment>
      <MapContainer
        center={[25.022729, 121.545103]}
        zoom={17}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </Fragment>
  );
}

export default Map;
