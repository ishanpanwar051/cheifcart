import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { handleImageError } from "../../utils/imageUtils";

const Cater = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/join/get')
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setData(res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        // Fallback data
        setData([
          {
            _id: 1,
            title: "Flexible Working Hours",
            content: "Work when you want, where you want. Complete control over your schedule.",
            image: "/slider1.png"
          },
          {
            _id: 2,
            title: "Good Earnings", 
            content: "Earn competitive rates and grow your income with every satisfied customer.",
            image: "/slider2.png"
          },
          {
            _id: 3,
            title: "Training & Support",
            content: "Get professional training and ongoing support to enhance your skills.",
            image: "/slider3.png"
          }
        ]);
      });
  }, []);

  return (
    <div>
      <section className="text-gray-600 body-font bg-gray-50">
        <h1 className="text-center text-black mt-10 text-5xl font-bold">ChefKart से क्यूँ जुड़ें?</h1>
        <p className="text-center text-xl text-gray-600 mt-4 mb-12">Join India's largest at-home cooking network</p>
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap -m-4">
            {data.map((item, key) => (
              <div key={item._id} className="p-4 md:w-1/3">
                <div className="h-full bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src={item.image}
                    alt={item.title}
                    onError={(e) => handleImageError(e, "https://via.placeholder.com/400x300?text=" + item.title.replace(' ', '+'))}
                  />
                  <div className="p-6">
                    <h1 className="title-font font-bold text-gray-900 text-2xl text-center mb-3">
                      {item.title}
                    </h1>
                    <p className="leading-relaxed text-center text-gray-700">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cater;
