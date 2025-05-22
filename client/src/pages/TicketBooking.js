import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useApp } from "../context/parvaaz";
import { bookFlight } from "../utils/flightService";
import { calculateTotalPrice, getCityFromIATA } from "../utils/aviationstack";
import { toast } from "react-toastify";
function TicketBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const {user,selectedFlight,  cabinClass, returnDate, passengers, toCity, fromCity, tripType, setbookedAnchor, startFlightD ,selectedBaggage } = useApp();
  const baggageOptions = {
    checked: [
      { weight: "10kg", price: 270 },
      { weight: "20kg", price: 540 },
      { weight: "30kg", price: 810 },
    ],
    cabin: { weight: "7kg", price: 189 }
  };
  
  // Calculate extra baggage cost:
  const extraCheckedCost =
    selectedBaggage.checked > 0
      ? baggageOptions.checked[selectedBaggage.checked - 1].price
      : 0;
  
  const extraCabinCost = selectedBaggage.cabin ? baggageOptions.cabin.price : 0;
  
  const totalExtraBaggageCost = extraCheckedCost + extraCabinCost;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const [bookingReference, setBookingReference] = useState();
  const flightData = location.state?.flight || selectedFlight;
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [seatsbooked, setseatBooked] = useState([]);
  const [roundD,setroundD]=useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef2,setBookingRef2]=useState(null)
  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };
  const handleConfirmBooking = () => {
    setIsLoading(true);
    if (!user) {
      navigate("/login", { replace: true });
      setIsBooked(false);
      toast.warn("You must be an active user first");
    } else {
      const bookit = async () => {
        try {
          const data = await bookFlight( flightData.schedule_id, flightData.flight_id,tripType, returnDate,fromCity, toCity, cabinClass, passengers,selectedBaggage);
          console.log(data)
          // Handle failed booking
          if (data.error?.startsWith( `No return flight on`)||data.message === "Failed to book flight") {
            toast.warn(data.error||data.message);
            setIsBooked(false); // Don't show booking page if booking fails
            setIsLoading(false); // stop loading
            return; // Stop further execution
          }
          //handle round flight booking
          if(data.inbound || data.outbound){
            toast.info(data.message);
            setroundD(data); //for seats {oubound,inbound}
            setBookingReference(data.outbound?.bookingIds?.map((id) => "PV" + id));//flight 1
            setBookingRef2(data.inbound?.bookingIds.map((id)=>"PV"+id))//flight2
            setIsBooked(true); // Only set to true if the booking succeeds
            return
          }
          // If booking is successful, update state
          toast.success(data.message || data.error);
          setseatBooked(data.seats);
          setIsBooked(true); // Only set to true if the booking succeeds
          setBookingReference(data.bookingIds?.map((id) => "PV" + id));
        } catch (error) {
          console.error("Booking failed: ", error);
          toast.warn("An error occurred during booking.");
          setIsBooked(false); // Make sure isBooked is false on error
        } finally {
          setIsLoading(false); // Always reset loading state
        }
      };
      bookit();
    }
  };
  const handleViewTicket = () => {
    setbookedAnchor(true);
    navigate("/user-profile");
  };
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar />
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isBooked ? "Booking Confirmed!" : "Complete Your Booking"}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 mb-5">
        {isBooked ? (
          <div className="bg-white p-8 rounded-lg shadow-md mb-20 mt-20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Booking Successful!
              </h2>
              <p className="text-gray-600">
                Your ticket has been booked successfully. You will receive a
                confirmation email shortly.
              </p>
            </div>

            <div className="border-t border-b py-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Booking Reference:</span>
                {bookingReference?.map((ref) => (
                  <span key={ref} className="font-semibold">
                    {ref}
                  </span>
                ))}
              </div>
              {bookingRef2 && ( <div className="flex justify-between mb-2">
                <span className="text-gray-600">Booking Reference:</span>
                {bookingRef2?.map((ref) => (
                  <span key={ref} className="font-semibold">
                    {ref}
                  </span>
                ))}
              </div>)}
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Seats Allocated{tripType==="roundtrip"?" (Flight-1":null}</span>
                {(roundD?.outbound?.seats ? roundD.outbound.seats: seatsbooked)?.map((seat, idx) => (
                  <span key={idx} className="font-semibold">
                    Seat-{seat}
                  </span>
                ))}
              </div>
              {tripType==="roundtrip" && (
                <div className="flex justify-between mb-2">
                <span className="text-gray-600">Seats Allocated{tripType==="roundtrip"?" (Flight-2":null}</span>
                {(roundD?.inbound?.seats ? roundD.inbound.seats: seatsbooked)?.map((seat, idx) => (
                  <span key={idx} className="font-semibold">
                    Seat-{seat}
                  </span>
                ))}
                </div>
              )}
      
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Passenger:</span>
                <span className="font-semibold">{`${user.fname} ${user.lname}`}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Flight Code{tripType==="roundtrip"?"  (Flight-1):":":"}</span>
                <span className="font-semibold">{`${flightData.flight_code}`}</span>
              </div>
              {tripType==="roundtrip" && startFlightD &&(
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Flight Code{tripType==="roundtrip"?" (Flight-2):":":"}</span>
                <span className="font-semibold">{`${startFlightD.flight_code}`}</span>
              </div>)}
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Route:</span>
                <span className="font-semibold">{`${flightData.origin} ${tripType==="roundtrip"?"<-->":"-->"} ${flightData.destination}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time{tripType==="roundtrip"?" (Flight-1):":":"}</span>
                <span className="font-semibold">{`${flightData.flight_date.slice(0,10)} | ${flightData.departure_time.slice(0,5)}`}</span>
              </div>
              {tripType==="roundtrip" && startFlightD &&(
                <div className="flex justify-between">
                <span className="text-gray-600">Date & Time{tripType==="roundtrip"?" (Flight-2):":":"}</span>
                <span className="font-semibold">{`${startFlightD.flight_date.slice(0,10)} | ${startFlightD.departure_time.slice(0,5)}`}</span>
              </div>
              )}
            </div>

            <div className="flex justify-center mb-10">
              <button
                onClick={handleViewTicket}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:shadow-lg transition duration-300"
              >
                View E-Ticket
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Booking Summary */}
              <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                    Booking Summary
                  </h2>
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">Flight</p>
                    <p className="font-medium">{flightData.flight_code}</p>
                  </div>


                  <div className="flex items-center border-t pt-3 mb-3">
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm">From</p>
                      <p className="font-medium capitalize">
                        {getCityFromIATA(flightData.origin)}
                      </p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-gray-600 text-sm">To</p>
                      <p className="font-medium capitalize">
                        {getCityFromIATA(flightData.destination)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm">Date</p>
                      <p className="font-medium">
                        {flightData.flight_date.slice(0, 10)}
                      </p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-gray-600 text-sm">Time</p>
                      <p className="font-medium">{flightData.departure_time.slice(0,5)}</p>
                    </div>
                  </div>

                  {tripType==="roundtrip"? (
                      <>
                        <div className="flex items-center border-t pt-2">
                          <div className="flex-1">
                            <p className="text-gray-600 text-sm">From</p>
                            <p className="font-medium capitalize">
                              {getCityFromIATA(flightData.destination)}
                            </p>
                          </div>
                          <div className="flex-1 text-right">
                            <p className="text-gray-600 text-sm">To</p>
                            <p className="font-medium capitalize">
                              {getCityFromIATA(flightData.origin)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center mb-4 border-b py-3 ">
                          <div className="flex-1">
                            <p className="text-gray-600 text-sm">Date</p>
                            <p className="font-medium">
                              {startFlightD.flight_date.slice(0, 10)}
                            </p>
                          </div>
                          <div className="flex items-center ">
                            <div className="flex-1 text-right">
                                 <p className="text-gray-600 text-sm">Time</p>
                                 <p className="font-medium">{startFlightD.departure_time.slice(0,5)}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ):<div className="border t"></div>}

                  <div className=" mt-2">
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">Passenger</p>
                    <p className="font-medium">{`${user?.fname} ${user?.lname}`}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Ticket Type</span>
                      <span className="font-medium capitalize">{tripType}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-600">Cabin baggage (7kg)</p>
                    <p className={`${selectedBaggage.cabin ? "text-green-600" : "text-gray-400"} ml-4`}>
                      {selectedBaggage.cabin ? `(+$${baggageOptions.cabin.price})` : "Not selected"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-gray-600">
                    <span>
                      Checked baggage ({selectedBaggage.checked > 0 ? baggageOptions.checked[selectedBaggage.checked - 1].weight : "None"})
                    </span>
                    <span className={`${selectedBaggage.checked > 0 ? "text-green-600" : "text-gray-400"} ml-4`}>
                      {selectedBaggage.checked > 0 ? `(+$${extraCheckedCost})` : "Not selected"}
                    </span>
                  </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 mr-1">Ticket Price{startFlightD ?"s (2-Flights)":null }</span>
                      <span className="font-medium">
                        $
                        {
                          cabinClass === "economy"
                            ? `${tripType === "roundtrip" ? flightData.cost_eco * 2 : flightData.cost_eco}`
                            : cabinClass === "business"
                            ? `${tripType === "roundtrip" ? flightData.cost_buis * 2 : flightData.cost_buis}`
                            : cabinClass === "first"
                            ? `${tripType === "roundtrip" ? flightData.cost_first_class * 2 : flightData.cost_first_class}`
                            : cabinClass === "premium_economy"
                            ? `${tripType === "roundtrip" ? flightData.cost_pre_eco * 2 : flightData.cost_pre_eco}`
                            : "N/A"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-medium">
                          {cabinClass === "economy"
                            ? 75 * (tripType === "roundtrip" ? 2 : 1)
                            : cabinClass === "business"
                            ? 150 * (tripType === "roundtrip" ? 2 : 1)
                            : cabinClass === "first"
                            ? 120 * (tripType === "roundtrip" ? 2 : 1)
                            : cabinClass === "premium_economy"
                            ? 100 * (tripType === "roundtrip" ? 2 : 1)
                            : 0}
                        </span>
                      </div>
                    <div className="flex justify-between pt-2 border-t mt-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-xl">
                        ${calculateTotalPrice({ cabinClass, tripType, flightData, totalExtraBaggageCost }) ?? "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                  <h2 className="text-xl font-semibold mb-6 border-b pb-2">
                    Payment Method
                  </h2>

                  <div className="flex flex-wrap mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                      className={`flex-1 py-2 text-center rounded-md ${
                        paymentMethod === "creditCard"
                          ? "bg-blue-500 text-white"
                          : "text-gray-600"
                      }`}
                      onClick={() => setPaymentMethod("creditCard")}
                    >
                      Credit Card
                    </button>
                    <button
                      className={`flex-1 py-2 text-center rounded-md ${
                        paymentMethod === "paypal"
                          ? "bg-blue-500 text-white"
                          : "text-gray-600"
                      }`}
                      onClick={() => setPaymentMethod("paypal")}
                    >
                      PayPal
                    </button>
                    <button
                      className={`flex-1 py-2 text-center rounded-md ${
                        paymentMethod === "googlePay"
                          ? "bg-blue-500 text-white"
                          : "text-gray-600"
                      }`}
                      onClick={() => setPaymentMethod("googlePay")}
                    >
                      Google Pay
                    </button>
                  </div>

                  {paymentMethod === "creditCard" && (
                    <form className="space-y-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="number"
                          placeholder="XXXX XXXX XXXX XXXX"
                          value={cardDetails.number}
                          onChange={handleCardDetailsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter name as it appears on card"
                          value={cardDetails.name}
                          onChange={handleCardDetailsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleCardDetailsChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="XXX"
                            value={cardDetails.cvv}
                            onChange={handleCardDetailsChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </form>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="py-6 text-center">
                      <p className="mb-4 text-gray-600">
                        You will be redirected to PayPal to complete your
                        payment.
                      </p>
                      <img
                        src="/images/paypal-logo.png"
                        alt="PayPal"
                        className="h-10 mx-auto"
                      />
                    </div>
                  )}

                  {paymentMethod === "googlePay" && (
                    <div className="py-6 text-center">
                      <p className="mb-4 text-gray-600">
                        You will be redirected to Google Pay to complete your
                        payment.
                      </p>
                      <img
                        src="/images/googlepay-logo.png"
                        alt="Google Pay"
                        className="h-10 mx-auto"
                      />
                    </div>
                  )}

                  <div className="mt-8">
                    <button
                      onClick={handleConfirmBooking}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition duration-300 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        `Pay ${"$"+ calculateTotalPrice({ cabinClass, tripType, flightData, totalExtraBaggageCost }) ?? "N/A"}` )}
                    </button>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>
                      By confirming, you agree to our Terms & Conditions and
                      Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
        <Footer />
    </div>
  );
}

export default TicketBooking;
