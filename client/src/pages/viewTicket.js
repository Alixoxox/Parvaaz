import React from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock, Calendar, Plane, MapPin, CreditCard, Users, AlertCircle,  HandCoins } from 'lucide-react';
import L from 'leaflet';
import cityData from '../utils/cityCoordinates.json'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { calculateDuration, generateGreatCirclePath } from '../utils/aviationstack';
// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Get city name from airport code
const getCityName = (code, cityData) => {
  if (cityData[code] && cityData[code].city) {
    return cityData[code].city.charAt(0).toUpperCase() + cityData[code].city.slice(1);
  }
  return code;
};

const ViewTicket = () => {
  const location = useLocation();
  const booking = location.state 

  const originCoords = cityData[booking.origin];
  const destinationCoords = cityData[booking.destination];

  if (!originCoords || !destinationCoords) {
    return <div className="text-red-500 p-4">Coordinates not found for origin or destination.</div>;
  }

  const flightDetails = calculateDuration(booking.departure_time, booking.arrival_time );
  const originCity = getCityName(booking.origin, cityData);
  const destinationCity = getCityName(booking.destination, cityData);

  // Calculate map bounds to fit both markers
  const bounds = [
    [originCoords.lat, originCoords.lon],
    [destinationCoords.lat, destinationCoords.lon]
  ];

  const flightPath = generateGreatCirclePath(originCoords, destinationCoords);

  // Status color coding
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
        <Navbar/>
        <div id="ticket-pdf-content" className="max-w-4xl mx-auto p-4 bg-gray-50 mb-5">
      {/* Ticket Header */}
      <div className="bg-white rounded-t-lg shadow-md p-6 border-t-4 border-blue-500 mt-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Boarding Pass</h1>
            <p className="text-gray-500">{booking.airline_code} • {booking.flight_code}</p>
          </div>
          <div className={`px-4 py-1 rounded-full ${getStatusColor(booking.status)}`}>
            {booking.status || 'Scheduled'}
          </div>
        </div>
      </div>

      {/* Flight Route Visualization */}
      <div className="bg-white p-6 shadow-md">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <p className="text-3xl font-bold">{booking.origin}</p>
            <p className="text-gray-600">{originCity}</p>
            <p className="text-sm mt-1">{booking.departure_time}</p>
          </div>
          
          <div className="flex-1 px-6">
            <div className="relative">
              <div className=" absolute w-full top-4"></div>
              <div className="flex justify-center  ">
                <Plane className="text-blue-500 text-5xl relative z-2" />
              </div>
              <div className="border-t-2 border-gray-300 text-center mt-1">
                <p className="text-sm text-gray-600 mt-2">
                {flightDetails}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold">{booking.destination}</p>
            <p className="text-gray-600">{destinationCity}</p>
            <p className="text-sm mt-1">{booking.arrival_time}</p>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="h-64 rounded-lg overflow-hidden shadow-inner  relative z-10">
          <MapContainer 
            bounds={bounds} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker 
              position={[originCoords.lat, originCoords.lon]}
              icon={createCustomIcon('blue')}
            >
              <Popup>
                <div className="font-medium">{booking.origin} - {originCity}</div>
                <div className="text-sm">Departure: {booking.departure_time}</div>
                <div className="text-xs mt-1">Terminal: {booking.terminal || 'N/A'}, Gate: {booking.gate || 'TBA'}</div>
              </Popup>
            </Marker>
            <Marker 
              position={[destinationCoords.lat, destinationCoords.lon]}
              icon={createCustomIcon('red')}
            >
              <Popup>
                <div className="font-medium">{booking.destination} - {destinationCity}</div>
                <div className="text-sm">Arrival: {booking.arrival_time}</div>
              </Popup>
            </Marker>
            <Polyline 
              positions={flightPath} 
              color="blue" 
              weight={3} 
              opacity={0.7} 
              dashArray="5, 10"
            />
          </MapContainer>
        </div>
      </div>

      {/* Flight Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Flight Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">Flight Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{booking.flight_date.slice(0,10)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Flight Duration</p>
                <p className="font-medium">{flightDetails}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Passenger</p>
                <p className="font-medium">{booking.user_name || 'John Doe'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Terminal & Gate</p>
                <p className="font-medium">
                  {booking.terminal || 'Terminal: TBA'} • {booking.gate || 'Gate: TBA'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Booking Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">Booking Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Booking Reference</p>
                <p className="font-medium">PV{booking.booking_id}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Plane className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Flight</p>
                <p className="font-medium capitalize">{booking.airline_name} {booking.flight_code}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Class & Seat</p>
                <p className="font-medium capitalize">{booking.cabin_class  || 'Economy'} • Seat {booking.seat_no || '-'}</p>
              </div>
            </div>
            <div className="flex items-center">
            <HandCoins  className="w-6 h-6 text-gray-500 mr-3"/>
              <div>
                <p className="text-sm text-gray-500">Total Cost</p>
                <p className="font-medium">${booking.cabin_class_cost}</p>
              </div>
              </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Travel Advisory */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md text-sm text-blue-700">
        <p className="font-medium">Travel Advisory:</p>
        <p>Please arrive at the airport at least 2 hours before departure. Don't forget to bring your ID and check the latest COVID-19 travel restrictions.</p>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ViewTicket;