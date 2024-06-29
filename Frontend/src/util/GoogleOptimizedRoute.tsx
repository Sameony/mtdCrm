import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { MapProps } from '../config/models/googleMapProps';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: 0,
    lng: 0,
};

const Map: React.FC<MapProps> = ({ start, end, waypoints }) => {
    const [response, setResponse] = useState<google.maps.DirectionsResult | null>(null);

    const directionsCallback = useCallback((result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        if (status === 'OK' && result) {
            setResponse(result);
        } else {
            console.error(`Error fetching directions: ${status}`);
        }
    }, []);

    useEffect(() => {
        console.log(import.meta.env.VITE_GOOGLE_KEY);
    }, []);

    const handleLoad = () => {
        if (!window.google) {
            console.error('Google Maps API is not loaded.');
            return;
        }

        if (!start || !end || waypoints.length === 0) {
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: start,
                destination: end,
                waypoints: waypoints.map((waypoint) => ({ location: waypoint, stopover: true })),
                travelMode: window.google.maps.TravelMode.BICYCLING,
                optimizeWaypoints: true,
            },
            directionsCallback
        );
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_KEY} libraries={['places']}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onLoad={handleLoad}>
                {response && <DirectionsRenderer directions={response} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
