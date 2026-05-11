import { useEffect, useRef, useState, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const SEARCH_RADIUS = 3000; // 3 km

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }
    if (!API_KEY) {
      reject(new Error('Google Maps API key is not configured. Set VITE_GOOGLE_MAPS_API_KEY.'));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Failed to load Google Maps script.'));
    document.head.appendChild(script);
  });
}

function getStars(rating) {
  if (!rating) return 'No ratings';
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '\u2605';
  if (half) s += '\u00BD';
  return s + ` (${rating})`;
}

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function NearbyParking() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);

  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState('');
  const [results, setResults] = useState([]);
  const [userPos, setUserPos] = useState(null);

  const searchNearby = useCallback((maps, map, pos) => {
    const service = new maps.places.PlacesService(map);
    const request = {
      location: pos,
      radius: SEARCH_RADIUS,
      type: 'parking',
    };

    service.nearbySearch(request, (places, searchStatus) => {
      if (searchStatus === maps.places.PlacesServiceStatus.OK && places.length > 0) {
        // Clear old markers
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        const infoWindow = infoWindowRef.current || new maps.InfoWindow();
        infoWindowRef.current = infoWindow;

        const items = places.map((place) => {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const dist = getDistance(pos.lat(), pos.lng(), lat, lng);

          const marker = new maps.Marker({
            position: place.geometry.location,
            map,
            title: place.name,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            },
          });

          marker.addListener('click', () => {
            infoWindow.setContent(
              `<div style="font-family:sans-serif;max-width:220px">` +
                `<strong>${place.name}</strong><br/>` +
                `<span style="font-size:.85em;color:#555">${place.vicinity || ''}</span><br/>` +
                `<span style="font-size:.85em">${getStars(place.rating)}</span><br/>` +
                `<a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" ` +
                `target="_blank" rel="noopener" style="font-size:.85em">Get Directions</a>` +
                `</div>`
            );
            infoWindow.open(map, marker);
          });

          markersRef.current.push(marker);

          return {
            id: place.place_id,
            name: place.name,
            address: place.vicinity || 'Address not available',
            rating: place.rating,
            openNow: place.opening_hours?.open_now,
            distance: dist,
            lat,
            lng,
          };
        });

        items.sort((a, b) => a.distance - b.distance);
        setResults(items);
        setStatus('ready');
      } else {
        setResults([]);
        setStatus('ready');
      }
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Step 1: Get user location
      if (!navigator.geolocation) {
        setErrorMsg('Geolocation is not supported by your browser.');
        setStatus('error');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (cancelled) return;
          const { latitude, longitude } = position.coords;
          setUserPos({ lat: latitude, lng: longitude });

          try {
            const maps = await loadGoogleMaps();
            if (cancelled) return;

            const center = new maps.LatLng(latitude, longitude);
            const map = new maps.Map(mapRef.current, {
              center,
              zoom: 14,
              mapTypeControl: false,
              streetViewControl: false,
            });
            mapInstance.current = map;

            // User location marker
            new maps.Marker({
              position: center,
              map,
              title: 'Your Location',
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              },
            });

            searchNearby(maps, map, center);
          } catch (err) {
            if (!cancelled) {
              setErrorMsg(err.message);
              setStatus('error');
            }
          }
        },
        (err) => {
          if (cancelled) return;
          let msg = 'Unable to get your location.';
          if (err.code === 1) msg = 'Location access denied. Please enable GPS and allow location access.';
          else if (err.code === 2) msg = 'Location unavailable. Please try again.';
          else if (err.code === 3) msg = 'Location request timed out. Please try again.';
          setErrorMsg(msg);
          setStatus('error');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [searchNearby]);

  function handlePanTo(lat, lng) {
    if (mapInstance.current) {
      mapInstance.current.panTo({ lat, lng });
      mapInstance.current.setZoom(16);
    }
  }

  return (
    <>
      <h1>Find Nearby Parking</h1>

      {status === 'loading' && (
        <div className="nearby-status-box">
          <div className="spinner" />
          <p>Getting your location...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="error">{errorMsg}</div>
      )}

      <div
        ref={mapRef}
        className="nearby-map"
        style={{ display: status === 'error' && !userPos ? 'none' : 'block' }}
      />

      {status === 'ready' && results.length === 0 && (
        <div className="nearby-status-box">
          <p>No parking lots found within {SEARCH_RADIUS / 1000} km of your location.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="nearby-results">
          <h2>Parking Lots Near You ({results.length} found)</h2>
          <div className="nearby-list">
            {results.map((r) => (
              <div
                key={r.id}
                className="nearby-item"
                onClick={() => handlePanTo(r.lat, r.lng)}
              >
                <div className="nearby-item-info">
                  <h3>{r.name}</h3>
                  <p className="nearby-address">{r.address}</p>
                  <div className="nearby-meta">
                    <span className="nearby-rating">{getStars(r.rating)}</span>
                    <span className="nearby-distance">{r.distance.toFixed(1)} km away</span>
                    {r.openNow !== undefined && (
                      <span className={`nearby-open ${r.openNow ? 'open' : 'closed'}`}>
                        {r.openNow ? 'Open now' : 'Closed'}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  className="nearby-directions"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Directions
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
