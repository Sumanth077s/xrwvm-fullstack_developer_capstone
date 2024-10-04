import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";  // Ensure your styles are defined in this CSS file
import "../assets/style.css";  // Additional styles
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const { id } = useParams();
  const dealer_url = `${window.location.origin}/djangoapp/dealer/${id}`;
  const review_url = `${window.location.origin}/djangoapp/add_review`;
  const carmodels_url = `${window.location.origin}/djangoapp/get_cars`;

  const postReview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (!model || !review || !date || !year) {
      alert("All fields are mandatory");
      return;
    }

    const [make, model_chosen] = model.split(" ");
    const jsoninput = JSON.stringify({
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: make,
      car_model: model_chosen,
      car_year: year,
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = dealer_url;
    }
  };

  const getDealer = async () => {
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();
    if (retobj.status === 200) {
      setDealer(retobj.dealer[0]); // Assuming dealer is an array
    }
  };

  const getCars = async () => {
    const res = await fetch(carmodels_url, { method: "GET" });
    const retobj = await res.json();
    setCarmodels(retobj.CarModels);
  };

  useEffect(() => {
    getDealer();
    getCars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
        <textarea
          id='review'
          cols='50'
          rows='7'
          placeholder='Write your review here...'
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className='input_field'>
          <label htmlFor='purchaseDate'>Purchase Date: </label>
          <input type="date" id='purchaseDate' onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className='input_field'>
          <label htmlFor='cars'>Car Make: </label>
          <select name="cars" id="cars" onChange={(e) => setModel(e.target.value)}>
            <option value="" selected disabled hidden>Choose Car Make and Model</option>
            {carmodels.map(carmodel => (
              <option key={carmodel.id} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>
        <div className='input_field'>
          <label htmlFor='carYear'>Car Year: </label>
          <input type="number" id='carYear' onChange={(e) => setYear(e.target.value)} max={2023} min={2015} />
        </div>
        <button className='postreview' onClick={postReview}>Post Review</button>
      </div>
    </div>
  );
};

export default PostReview;
