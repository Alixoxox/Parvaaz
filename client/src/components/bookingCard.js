import { useNavigate } from "react-router-dom";
const BookingCard = ({ booking }) => {
  const navigate=useNavigate()
    const ticketInfo = () => {
      navigate(`/ticket/${booking.booking_id}`, { state: booking });
    };
    return (
        <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 font-medium">PV{booking.booking_id}</td>
        <td className="px-6 py-4">
          {booking.origin.toUpperCase()} → {booking.destination.toUpperCase()}
        </td>
        <td className="px-6 py-4">{booking.date}</td>
        <td className="px-6 py-4">{booking.airline_code}</td>
        <td className="px-6 py-4">
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              booking.status === "completed"
                ? "bg-green-100 text-green-600"
                : booking.status === "Upcoming"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {booking.status}
          </span>
        </td>
        <td className="px-6 py-4 font-medium">${booking.cabin_class_cost}</td>
        <td className="px-6 py-4">
          {/* add further details or a plain ticket or smthng */}
          <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={ticketInfo}>
            View Details
          </button>
        </td>
      </tr>
    );
  };
  export default BookingCard;
  