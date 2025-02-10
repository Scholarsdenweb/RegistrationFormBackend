import axios from "../api/axios";


const checkoutHandler = async () => {
    const {
      data: { key },
    } = await axios.get("/payment/getKey");
    console.log("key", key);

    const response = await axios.post("/payment/checkout");
    console.log("response", response);
    console.log("response.data.order.amount", response.data.order.amount);
    console.log("response.data.order.currency", response.data.order.currency);
    console.log("response.data.currency", response.data.currency);

    const options = {
      key,
      amount: response.data.order.amount,
      currency: response.data.order.currency,
      name: "Acme Corp",
      description: "Test Payment",
      order_id: response.data.order.id,
      callback_url: `${import.meta.env.VITE_APP_API_URL}/api/payment/paymentverification`,
      prefill: {
        name: "jatin gupta",
        email: "5Yt0d@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#c61d23",
      },
      handler: async function (response) {
        console.log("Payment successful", response);

        // Optionally, verify the payment on your backend
        
          // Redirect to the success page
          window.location.href = `/payment/success/${response.razorpay_order_id}`;
       
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

    console.log("razorpay", razorpay);
    // await axios("/payment/paymentverification", {});
  };


  export default checkoutHandler;