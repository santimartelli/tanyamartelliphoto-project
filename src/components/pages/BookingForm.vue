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
          ><strong>Full Name</strong> - Please provide your full name so that I
          can address you correctly.</label
        >
        <input type="text" id="name" v-model="name" />
      </div>
      <div>
        <label for="email"
          ><strong>Email</strong> - Kindly enter your email address, and I will
          use it to communicate with you regarding your booking.</label
        >
        <input type="email" id="email" v-model="email" />
      </div>
      <div>
        <label for="session"
          ><strong>Session Type</strong> - Choose the type of session you are
          interested in, whether it be a family portrait, event shoot, fashion
          photography, or any other specific theme or occasion.</label
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
          ><strong>Location</strong> - Let me know your preferred location for
          the photosession. Whether you have a specific spot in mind or need
          suggestions, I am here to help.</label
        >
        <select id="location" v-model="location">
          <option value="Barcelona">Barcelona</option>
          <option value="Girona">Girona</option>
          <option value="Lloret">Lloret de Mar</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label for="studio"
          ><strong>In Studio or Outdoors</strong> - Choose whether you would
          like your photosession to be in the comfort of a studio or in the
          beauty of natural outdoor settings.</label
        >
        <input type="radio" id="studio" v-model="inStudio" name="place" />
      </div>
      <div>
        <label for="Outdoors">Outdoors:</label>
        <input type="radio" id="outdoors" v-model="outdoors" name="place" />
      </div>
      <div>
        <label for="date"
          ><strong>Date and Time</strong> - Select the desired date and time for
          your photosession. If you have any flexibility or alternative options,
          please mention them in the message section.</label
        >
        <input
          type="date"
          id="date"
          v-model="selectedDate"
          :disabled="isDateDisabled(selectedDate)"
        />
      </div>
      <div v-if="selectedDate">
        <label for="time">Time:</label>
        <select id="time" v-model="selectedTime">
          <option v-for="time in availableTimes" :value="time" :key="time">
            {{ time }}
          </option>
        </select>
      </div>
      <div>
        <label for="message"
          ><strong>Message</strong> - Feel free to include any additional
          information or specific requests you may have. I want to ensure that
          your photosession is tailor-made to your preferences and needs.</label
        >
        <textarea id="message" v-model="message"></textarea>
      </div>
      <div class="btn">
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
      disabledDates: ["2023-07-15", "2023-07-20"],
      availableTimes: [
        "Morning - 09:00 to 12:00",
        "Noon - 12:00 to 15:00",
        "Afternoon 15:00 to 18:00",
        "Events - especify in message",
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
    isDateDisabled() {
      return (date) => {
        const formattedDate = date.split('-').reverse().join('-');
        return this.disabledDates.includes(formattedDate);
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
input,
textarea {
  font-family: typewriter-extralight;
  letter-spacing: 0.1rem;
  border: none;
  outline: none;
  border-bottom: 1px solid #ddd;
  font-size: 0.8rem;
  padding: 5px 0;
  margin: 1rem 0;
  width: 100%;
  color: black;
}

select,
option {
  font-family: typewriter-extralight;
  letter-spacing: 0.1rem;
  border: none;
  outline: none;
  border-bottom: 1px solid #ddd;
  font-size: 0.8rem;
  padding: 5px 0;
  margin: 1rem 0;
  width: 100%;
  color: black;
}

input:focus,
textarea:focus {
  background-color: snow;
}

.btn {
  width: 100%;
  text-align: right;
}
</style>
