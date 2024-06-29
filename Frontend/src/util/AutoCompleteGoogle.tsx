import React, { useEffect, useRef } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { Address } from '../config/models/address';

const libraries: ('places')[] = ['places'];

const AutocompleteInput: React.FC<{ address?: string, onChange: (place: Address) => void }> = ({ address, onChange }) => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
                types: ['geocode'],
            });

            inputRef.current.value = address ?? "";

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current!.getPlace();
                if (place.geometry) {

                    const address = place.formatted_address ?? "";
                    const latitude = place.geometry.location?.lat().toString() ?? "";
                    const longitude = place.geometry.location?.lng().toString() ?? "";
                    const userAddress = { address, latitude, longitude }
                    onChange(userAddress)
                    console.log('Address:', address);
                    console.log('Latitude:', latitude);
                    console.log('Longitude:', longitude);
                } else {
                    console.error("No details available for input: '" + place.name + "'");
                }
            });
        }
    }, []);

    return (
        <div>
            <input
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                ref={inputRef}
                type="text"
                placeholder="Enter a location"
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />
        </div>
    );
};

const AutoCompleteAddress: React.FC<{ address?: string, onChange: (place: Address) => void }> = ({ address, onChange }) => {
    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_KEY} libraries={libraries}>
            <AutocompleteInput address={address ?? ""} onChange={onChange} />
        </LoadScript>
    );
};

export default AutoCompleteAddress;
