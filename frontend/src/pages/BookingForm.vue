<template>
  <div class="container">
    <h2><span class="highlight">Book Your PhotoShoot!</span></h2>
    <p>
      Thank you for your interest in booking a photoshoot with me! Please fill
      out the form below with your details and preferences, and I will get back
      to you as soon as possible to finalize the details.
    </p>
    <p>
      Feel free to include any additional information or specific requests you
      may have. I want to ensure that your photosession is tailor-made to your
      preferences and needs.
    </p>
    <p>
      Once I receive your booking request, I will review the form and contact
      you to confirm the availability and discuss further details. I am
      dedicated to providing you with an exceptional experience and capturing
      beautiful moments that will be cherished for a lifetime.
    </p>
    <form>
      <input type="text" id="name" v-model="name" placeholder="Name" />
      <input type="email" id="email" v-model="email" placeholder="Email" />
      <select id="session" v-model="sessionType">
        <option v-if="!sessionType" value="" disabled selected>
          Select the photoshoot type
        </option>
        <option value="Couple">Couple</option>
        <option value="Event">Event</option>
        <option value="Family">Family</option>
        <option value="Fashion">Fashion</option>
        <option value="Female Portrait">Female Portrait</option>
        <option value="Male Portrait">Male Portrait</option>
        <option value="Newborn">Newborn</option>
        <option value="Pregnancy">Pregnancy</option>
        <option value="Product">Product</option>
        <option value="Real State">Real State</option>
        <!-- Add more options here -->
      </select>
      <select id="location" v-model="location">
        <option v-if="!location" value="" disabled selected>
          Select the preferred location
        </option>
        <option value="Barcelona">Barcelona</option>
        <option value="Girona">Girona</option>
        <option value="Lloret">Lloret de Mar</option>
        <option value="Other">Other (especify in message)</option>
      </select>
      <div class="envoirment">
        <p class="title">Choose a place:</p>
        <div class="radio-group">
          <label for="studio" class="radio-container">
            <div class="sideRadio">
              <input type="radio" id="studio" v-model="place" value="Studio" />
              <span class="checkmark"></span>
              <span class="radio-desc">In Studio</span>
            </div>
          </label>
          <label for="outdoors" class="radio-container">
            <div class="sideRadio">
              <input
                type="radio"
                id="outdoors"
                v-model="place"
                value="Outdoors"
              />
              <span class="checkmark"></span>
              <span class="radio-desc">Outdoors</span>
            </div>
          </label>
          <label for="other" class="radio-container">
            <div class="sideRadio">
              <input type="radio" id="other" v-model="place" value="Other" />
              <span class="checkmark"></span>
              <span class="radio-desc">Other</span>
            </div>
          </label>
        </div>
      </div>
      <select id="date" v-model="selectedDate">
        <option v-if="!selectedDate" value="" disabled selected>
          Select the Date
        </option>
        <option v-for="date in availableDates" :value="date" :key="date">
          {{ date }}
        </option>
        <option value="Other">Other (specify in the message)</option>
      </select>
      <select id="time" v-model="selectedTime">
        <option v-if="!selectedTime" value="" disabled selected>
          Select the Time
        </option>
        <option v-for="time in availableTimes" :value="time" :key="time">
          {{ time }}
        </option>
      </select>
      <label for="message">Message </label>
      <textarea id="message" v-model="message" rows="10"></textarea>
      <div class="btn-container">
        <base-button @click="submitForm">Enviar</base-button>
      </div>
    </form>
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
      place: "",
      selectedDate: "",
      selectedTime: "",
      message: "",
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
      availableDates: [],
    };
  },
  methods: {
    calculateAvailableDates() {
      this.availableDates = [];
      const today = new Date();

      for (let i = 0; i < 90; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        // Check if the day is either Sunday (0) or Thursday (4)
        if (currentDate.getDay() === 0 || currentDate.getDay() === 4) {
          const year = currentDate.getFullYear();
          let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
          let day = currentDate.getDate().toString().padStart(2, "0");
          this.availableDates.push(`${day}-${month}-${year}`);
        }
      }
    },
    submitForm() {
      // Perform form submission logic here
      // Access the form data through the component's data properties
      console.log("Form submitted!");
    },
  },
  created() {
    this.$nextTick(() => {
      this.calculateAvailableDates();
    });
  },
};
</script>

<style scoped>
.container {
  width: 60%;
  margin: 0 auto; /* Center the container */
  padding: 20px; /* Add some padding for spacing */
}

h2 {
  text-align: center;
  padding-bottom: 1rem;
}

form {
  width: 80%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 3rem;
}

textarea {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  margin-bottom: 1.5rem;
  padding: 5px;
  border: 1px solid #ccc;
}

label {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  font-size: 14px;
  opacity: 0.65;
  padding: 0 0 0.3rem 0.3rem;
}

.title {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  font-size: 14px;
  opacity: 0.65;
  padding-left: 0.3rem;
  letter-spacing: 0;
}

select,
option {
  font-family: typewriter-extralight;
  border: none;
  outline: none;
  background-color: white;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  padding: 5px 0;
  margin-bottom: 1.5rem;
  color: black;
  display: block;
}

input[type="text"],
input[type="email"] {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  margin-bottom: 1.5rem;
  padding: 5px;
  border: none;
  border-bottom: 1px solid #ccc;
}

/* Radio buttons */
.radio-group {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.radio-container {
  flex: 1;
  max-width: 33%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center; /* Center the text within the container */
}

.radio-container input[type="radio"] {
  position: absolute;
  opacity: 0;
}
.radio-desc {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  font-size: 14px;
  opacity: 0.65;
  padding-left: 0.3rem;
  letter-spacing: 0;
  margin-top: 5px; /* Add margin to separate radio button and text */
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
  background-color: #f79f9f;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Date and time */

input[type="date"] {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  font-size: 14px;
  opacity: 0.65;
  border: none;
  outline: none;
  background-color: white;
  border-bottom: 1px solid #ccc;
  color: black;
}

#time {
  width: 100%;
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
  font-size: 14px;
  opacity: 0.65;
  border: none;
  outline: none;
  background-color: white;
  border-bottom: 1px solid #ccc;
  color: black;
}

.btn-container {
  display: flex;
  justify-content: center;
}

textarea:focus {
  outline: none;
  border: 1px solid #f79f9f;
}

input:focus,
#session:focus,
#location:focus,
#date:focus,
#time:focus {
  outline: none;
  border-bottom: 1px solid #f79f9f;
}

/* Media queries */
@media (max-width: 855px) {
  .container {
    width: 98%;
  }
  .radio-group {
    flex-direction: column; /* Stack radio buttons vertically on smaller screens */
  }

  .radio-container {
    align-items: flex-start;
    text-align: left;
    max-width: 100%;
  }

  .radio-container:nth-child(2) {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}

@media (max-width: 1235px) {
  form {
    width: 100%;
  }
}
</style>
