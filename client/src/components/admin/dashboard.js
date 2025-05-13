import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ShowDashboard } from '../../utils/admin_stuff';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [passengers, setPassengers] = useState([]);
  const [bookings, setBookings] = useState([]);
const [totalbooked,setTotalBooked]=useState(0)
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await ShowDashboard();
      console.log(data); // Check the structure of the data
      setPassengers(new Array(data.passengerCount).fill({})); // Or just use the count if you don't need passenger details
      setBookings(data.bookings);
        setTotalBooked(data.totalBooked[0]?.booked)
    };
    
    setTimeout(fetchData, 20);  // Use setTimeout to simulate delay if needed
  }, []);

  const bookingTrendsData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Bookings',
        data: bookings.reduce((acc, booking) => {
          const month = new Date(booking.flight_date).getMonth();
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, new Array(12).fill(0)),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

// === PIE CHART: Popular Destinations ===
const uniqueDestinations = Array.from(new Set(bookings.map((b) => b.destination)));
const destinationData = {
  labels: uniqueDestinations,
  datasets: [
    {
      label: 'Popular Destinations',
      data: uniqueDestinations.map(
        (dest) => bookings.filter((b) => b.destination === dest).length
      ),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
      ],
    },
  ],
};
const uniqueOrigins = Array.from(new Set(bookings.map((b) => b.origin)));

const originData = {
  labels: uniqueOrigins,
  datasets: [
    {
      label: 'Flight Origins',
      data: uniqueOrigins.map(
        (orig) => bookings.filter((b) => b.origin === orig).length
      ),
      backgroundColor: [
        "#A6CEE3",
        "#1F78B4",
        "#B2DF8A",
        "#33A02C",
        "#FB9A99",
        "#E31A1C",
      ],
    },
  ],
};
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Passengers</h3>
          <p className="text-3xl font-bold mt-2">{passengers.length || 1}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Active Bookings</h3>
          <p className="text-3xl font-bold mt-2">
            {totalbooked}
            
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Today's Departures</h3>
          <p className="text-3xl font-bold mt-2">
          {
              bookings.filter(
                (b) =>
                  new Date(b.flight_date).toDateString() ===
                  new Date().toDateString()
              ).length
            }
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Open Inquiries</h3>
          <p className="text-3xl font-bold mt-2">{1}</p> {/* Update with actual inquiries count if available */}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
          <div style={{ height: '300px' }}>
            <Bar data={bookingTrendsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Popular Flight Destinations</h3>
          <div style={{ height: '300px' }}>
            <Pie data={destinationData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Flight Origins</h3>
            <div style={{ height: "300px" }}>
              <Pie data={originData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
