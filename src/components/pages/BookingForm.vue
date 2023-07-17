<template>
  <div class="container">
    <h2>Book Your Photosession!</h2>
    <p>
      Thank you for your interest in booking a photosession with me! Please fill
      out the form below with your details and preferences, and I will get back
      to you as soon as possible to finalize the details.
    </p>
    <p>
      Once I receive your booking request, I will review the form and contact
      you to confirm the availability and discuss further details. I am
      dedicated to providing you with an exceptional experience and capturing
      beautiful moments that will be cherished for a lifetime.
    </p>
    <base-card>
      <div>
        <label for="name"
          ><strong>Full Name</strong>
          <p>
            Please provide your full name so that I can address you correctly.
          </p></label
        >

        <input type="text" id="name" v-model="name" />
      </div>
      <div>
        <label for="email"
          ><strong>Email</strong>
          <p>
            Kindly enter your email address, and I will use it to communicate
            with you regarding your booking.
          </p></label
        >
        <input type="email" id="email" v-model="email" />
      </div>
      <div>
        <label for="session"
          ><strong>Session Type</strong>
          <p>
            Choose the type of session you are interested in, whether it be a
            family portrait, event shoot, fashion photography, or any other
            specific theme or occasion.
          </p></label
        >
        <select id="session" v-model="sessionType">
          <option value="option1">Pregnancy</option>
          <option value="option2">Newborn</option>
          <option value="option2">Family</option>
          <option value="option2">Personal Book</option>
          <option value="option2">Event</option>
          <option value="option2">Fashion</option>
          <option value="option2">E-commerce (product)</option>
          <!-- Add more options here -->
        </select>
      </div>
      <div>
        <label for="location"
          ><strong>Location</strong>
          <p>
            Let me know your preferred location for the photosession. Whether
            you have a specific spot in mind or need suggestions, I am here to
            help.
          </p></label
        >
        <select id="location" v-model="location">
          <option value="Barcelona">Barcelona</option>
          <option value="Girona">Girona</option>
          <option value="Lloret">Lloret de Mar</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="envoirment">
        <p>
          <strong>Environment</strong>
        </p>
        <p>
          Choose whether you would like your photosession to be in the comfort
          of a studio or in the beauty of natural outdoor settings.
        </p>
        <div class="radio-group">
          <label for="studio" class="radio-container">
            <input type="radio" id="studio" v-model="inStudio" name="place" />
            <span class="checkmark"></span>
            <span class="radio-desc">In Studio</span>
          </label>
        </div>
        <div>
          <label for="outdoors" class="radio-container">
            <input type="radio" id="outdoors" v-model="inStudio" name="place" />
            <span class="checkmark"></span>
            <span class="radio-desc">Outdoors</span>
          </label>
        </div>
      </div>
      <div>
        <p>
          <strong>Date and Time</strong>
        </p>
        <p>
          Select the desired date and time for your photosession. If you have
          any flexibility or alternative options, please mention them in the
          message section.
        </p>

        <label for="date">Date: <br /> </label>
        <input
          type="date"
          id="date"
          v-model="selectedDate"
          :min="minDate"
          :disabled="isDateDisabled(selectedDate)"
        />
      </div>
      <div class="time-label-imput">
        <label for="time">Time:</label>
        <select id="time" v-model="selectedTime">
          <option v-for="time in availableTimes" :value="time" :key="time">
            {{ time }}
          </option>
        </select>
      </div>
      <div>
        <label for="message"
          ><strong>Message</strong>
          <p>
            Feel free to include any additional information or specific requests
            you may have. I want to ensure that your photosession is tailor-made
            to your preferences and needs.
          </p></label
        >
        <textarea id="message" v-model="message" rows="10"></textarea>
      </div>
      <div class="btn-container">
        <base-button @click="submitForm">Enviar</base-button>
      </div>
    </base-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      sessionType: "",
      location: "",
      inStudio: false,
      selectedDate: "",
      selectedTime: "",
      message: "",
      disabledDates: [],
      availableTimes: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "Other (especify in message)",
        // Add more available times here
      ],
    };
  },
  methods: {
    submitForm() {
      // Perform form submission logic here
      // Access the form data through the component's data properties
      console.log("Form submitted!");
    },
  },
  computed: {
    minDate() {
      const today = new Date();
      today.setDate(today.getDate() + 2); // Set minimum date to the day after tomorrow
      const year = today.getFullYear();
      let month = (today.getMonth() + 1).toString().padStart(2, "0");
      let day = today.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    isDateDisabled() {
      return (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set current date to the start of the day
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date
        return selectedDate < tomorrow;
      };
    },
  },
};
</script>

<style scoped>
label {
  letter-spacing: 0.1rem;
  font-size: 0.8rem;
  color: black;
}

input[type="text"],
input[type="email"],
textarea {
  font-family: typewriter-extralight;
  letter-spacing: 0.1rem;
  border: none;
  outline: none;
  background-color: white;
  border: 0.5px solid rgb(235, 228, 228);
  font-size: 0.8rem;
  padding: 5px 0;
  margin-bottom: 2rem;
  width: 100%;
  color: black;
}

select,
option {
  font-family: typewriter-extralight;
  letter-spacing: 0.1rem;
  border: none;
  outline: none;
  background-color: white;
  border: 0.5px solid rgb(235, 228, 228);
  font-size: 0.8rem;
  padding: 5px 0;
  margin-bottom: 2rem;
  width: 30%;
  color: black;
  display: block;
}

input:focus,
textarea:focus {
  border: 0.5px solid slategray;
}

.btn-container {
  display: flex;
  justify-content: center;
  margin-top: -1rem;
}

.envoirment {
  margin-bottom: 2rem;
}

.radio-group {
  margin-top: 1rem;
}

.radio-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.radio-container input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.radio-desc {
  padding-left: 0.8rem;
}
.radio-container .checkmark {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.radio-container input[type="radio"]:checked + .checkmark::after {
  content: "";
  position: absolute;
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: slategray;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Date and time */

input[type="date"]{
  width: 30%;
  font-family: typewriter-extralight;
  letter-spacing: 0.1rem;
  border: none;
  outline: none;
  background-color: white;
  border: 0.5px solid rgb(235, 228, 228);
  font-size: 0.8rem;
  padding: 5px 0;
  color: black;}

input[type="time"] {
  width: 30%;
  font-family: typewriter-extralight;
  letter-spacing: 0.1rem;
  border: none;
  outline: none;
  background-color: white;
  border: 0.5px solid rgb(235, 228, 228);
  font-size: 0.8rem;
  padding: 5px 0;
  color: black;}

.time-label-imput {
  margin-top: 1rem;
}

/* Media queries */

@media (max-width: 768px) {
  select {
    width: 50%;
  }

  input[type="date"],
  .radio-container input[type="time"] {
    width: 50%;
  }
}

@media (max-width: 425px) {
  select {
    width: 100%;
  }

  input[type="date"],
  .radio-container input[type="time"] {
    width: 100%;
  }
}
</style>
