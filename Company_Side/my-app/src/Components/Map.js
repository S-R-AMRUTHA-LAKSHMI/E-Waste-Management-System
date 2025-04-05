import React, { useState } from "react";
import axios from "axios";
import Map, { Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";
import './Map.css';

const MapComponent = () => {
  const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYWtzaGF5YXJtazUiLCJhIjoiY201NWc2dTltMzh1YjJuczczeXFhdmRrdSJ9.8RzmHfbYQU27iVJLSink1A"

  const [sourcePlace, setSourcePlace] = useState("");
  const [destinationPlace, setDestinationPlace] = useState("");
  const [route, setRoute] = useState(null);
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const navigate = useNavigate();

  const geocodePlace = async (query) => {
    const geocodeUrl = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&access_token=${MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await axios.get(geocodeUrl);
      if (response.data?.features?.length > 0) {
        return response.data.features[0].geometry.coordinates;
      } else {
        alert(`No results found for: ${query}`);
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const fetchRoute = async () => {
    if (!sourceCoords || !destinationCoords) return;
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${sourceCoords[0]},${sourceCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await axios.get(directionsUrl);
      if (response.data?.routes?.length > 0) {
        setRoute(response.data.routes[0]);
      } else {
        alert("No route found");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sourceCoordinates = await geocodePlace(sourcePlace);
    const destinationCoordinates = await geocodePlace(destinationPlace);
    if (sourceCoordinates && destinationCoordinates) {
      setSourceCoords(sourceCoordinates);
      setDestinationCoords(destinationCoordinates);
      fetchRoute();
    } else {
      alert("Invalid place names. Please try again.");
    }
  };

  const handleBookingConfirmation = () => navigate("/payment");

  const routeLayer = {
    id: "route",
    type: "line",
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": "#ff0000", "line-width": 4 },
  };

  return (
    <div>
      <h1>Route Finder</h1>
      <form onSubmit={handleSubmit}>
        <label> Source: <input type="text" value={sourcePlace} onChange={(e) => setSourcePlace(e.target.value)} required /> </label>
        <br />
        <label> Destination: <input type="text" value={destinationPlace} onChange={(e) => setDestinationPlace(e.target.value)} required /> </label>
        <br />
        <button type="submit">Get Route</button>
      </form>

      {route && (
        <div className="route-info">
          <h2>Route Information</h2>
          <p>Distance: {(route.distance / 1000).toFixed(2)} km</p>
          <p>Duration: {(route.duration / 60).toFixed(2)} minutes</p>
          <button onClick={handleBookingConfirmation}>Confirm Booking</button>
        </div>
      )}

      <div style={{ height: "500px", marginTop: "20px" }}>
        <Map
          initialViewState={{ longitude: 80.22, latitude: 12.97, zoom: 12 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        >
          {sourceCoords && <Marker longitude={sourceCoords[0]} latitude={sourceCoords[1]} color="green" />}
          {destinationCoords && <Marker longitude={destinationCoords[0]} latitude={destinationCoords[1]} color="red" />}
          {route && <Source id="route" type="geojson" data={route.geometry}><Layer {...routeLayer} /></Source>}
        </Map>
      </div>
    </div>
  );
};

export default MapComponent;
