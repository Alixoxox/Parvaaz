import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const Help = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });  }, []);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send this data to your backend
    setSubmitted(true);
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Reset submitted state after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const faqs = [
    {
      question: "How do I book a flight?",
      answer: "You can book a flight by navigating to the 'Book' section of our website, entering your departure and arrival locations, preferred dates, and passenger information. After selecting your flights, you'll be directed to payment options."
    },
    {
      question: "What is the baggage allowance?",
      answer: "Baggage allowance varies by airline and fare class. Generally, economy passengers are allowed one checked bag up to 23kg and one carry-on bag. Premium and business class passengers typically have higher allowances."
    },
    {
      question: "How can I change or cancel my booking?",
      answer: "To change or cancel your booking, log into your account, navigate to 'My Trips', select the booking you wish to modify, and follow the instructions for changes or cancellations. Please note that fees may apply depending on your fare conditions."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Some routes may offer additional local payment options."
    }
  ];

  return (<>
    <div className="min-h-screen bg-gray-50 py-16">
      <Navbar/>
      <div className="container mx-auto px-4 mt-20">
        <h1 className="text-4xl font-bold text-center text-primary mb-16">How Can We Help You?</h1>
        
        {/* FAQs Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-primary mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
          
          {submitted ? (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg mb-6">
              Thank you for your message! We'll get back to you soon.
            </div>
          ) : null}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject of your inquiry" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="5"
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Submit Inquiry
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <h3 className="text-lg font-semibold mb-2">Other Ways to Reach Us</h3>
            <p className="text-gray-700 mb-1">Email: support@parvaaz.com</p>
            <p className="text-gray-700 mb-1">Phone: +1 (555) 123-4567</p>
            <p className="text-gray-700">Hours: 24/7 Customer Support</p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Help;