<!-- Componente que contiene el formulario de solicitud de reserva de sesiones -->

<template>
  <div>
    <!-- Dialogo feedback despues de enviar el formulario -->

    <ok-dialog :show="!!errorMessage" @close="closeDialog">
      <h2>Error!</h2>
      <p>{{ errorMessage }}</p>
    </ok-dialog>
    <ok-dialog :show="!!okMessage" @close="closeDialog">
      <h2>Solicitud de reserva enviada correctamente!</h2>
      <p>{{ okMessage }}</p>
    </ok-dialog>

    <!-- Texto 'reserva tu sesión' -->

    <div class="container">
      <h2><span class="highlight">Reserva tu sesión!</span></h2>
      <p>
        ¡Gracias por tu interés en reservar una sesión de fotos conmigo! Por
        favor, rellena el formulario con tus datos y
        preferencias y me pondré en contacto contigo lo antes posible para
        profundizar en los detalles.
      </p>
      <p>
        No dudes en incluir cualquier información adicional o solicitudes
        específicas que puedas tener. Quiero asegurarme de que tu sesión sea
        perfecta y se adapte a tus preferencias y necesidades.
      </p>
      <p>
        Una vez que reciba tu solicitud de reserva, revisaré el formulario y te
        contactaré para confirmar la disponibilidad y discutir más detalles.
        Estoy totalmente comprometida con proporcionarte una experiencia excepcional
        para poder crear recuerdos inolvidables.
      </p>

      <!-- Formulario de reserva de sesión -->

      <form @submit.prevent="submitForm">
        <input type="text" id="name" v-model="name" placeholder="Nombre" />
        <div v-if="!formIsValidName" class="errors">
          Por favor, introduce un nombre válido.
        </div>
        <input type="email" id="email" v-model="email" placeholder="Email" />
        <div v-if="!formIsValidEmail" class="errors">
          Por favor, introduce un email válido.
        </div>
        <select id="session" v-model="categoryId">
          <option v-if="!categoryId" value="" disabled selected>
            Selecciona el tipo de sesión
          </option>
          <option
            v-for="cat in sortedCategories"
            :key="cat.categoryId"
            :value="cat.categoryId"
          >
            {{ cat.categoryName }}
          </option>
        </select>
        <div v-if="!formIsValidCategory" class="errors">
          Por favor, selecciona un tipo de sesión.
        </div>
        <select id="location" v-model="location">
          <option v-if="!location" value="" disabled selected>
            Selecciona una localidad
          </option>
          <option value="Barcelona">Barcelona</option>
          <option value="Girona">Girona</option>
          <option value="Lloret">Lloret de Mar</option>
          <option value="Other">Otra (especifica en el mensaje)</option>
        </select>
        <div v-if="!formIsValidLocation" class="errors">
          Por favor, selecciona una localidad.
        </div>
        <div class="envoirment">
          <p class="title">Eliga la localización:</p>
          <div class="radio-group">
            <label for="studio" class="radio-container">
              <div class="sideRadio">
                <input
                  type="radio"
                  id="studio"
                  v-model="place"
                  value="Estudio"
                />
                <span class="checkmark"></span>
                <span class="radio-desc">En estudio</span>
              </div>
            </label>
            <label for="outdoors" class="radio-container">
              <div class="sideRadio">
                <input
                  type="radio"
                  id="outdoors"
                  v-model="place"
                  value="Exteriores"
                />
                <span class="checkmark"></span>
                <span class="radio-desc">En exteriores</span>
              </div>
            </label>
            <label for="other" class="radio-container">
              <div class="sideRadio">
                <input type="radio" id="other" v-model="place" value="Otro" />
                <span class="checkmark"></span>
                <span class="radio-desc">Otra</span>
              </div>
            </label>
          </div>
        </div>
        <div v-if="!formIsValidPlace" class="errors">
          Por favor selecciona una localización.
        </div>
        <select id="date" v-model="selectedDate">
          <option v-if="!selectedDate" value="" disabled selected>
            Selecciona la fecha
          </option>
          <option v-for="date in availableDates" :value="date" :key="date">
            {{ date }}
          </option>
          <option value="Other">Otra (Especificala in el mensaje)</option>
        </select>
        <div v-if="!formIsValidDate" class="errors">Por favor selecciona una fecha.</div>
        <select id="time" v-model="selectedTime">
          <option v-if="!selectedTime" value="" disabled selected>
            Selecciona una hora
          </option>
          <option v-for="time in availableTimes" :value="time" :key="time">
            {{ time }}
          </option>
        </select>
        <div v-if="!formIsValidTime" class="errors">
          Por favor selecciona una hora.
        </div>
        <label for="message">Mensaje </label>
        <textarea id="message" v-model="message" rows="10"></textarea>
        <div v-if="!formIsValidMessage" class="errors">
          Por favor introduce el mensaje.
        </div>
        <div class="btn-container">
          <base-button @click="submitForm">Enviar</base-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import OkDialog from "../components/ui/OkDialog.vue";

/**
 * Componente que contiene el formulario de solicitud de reserva de sesiones.
 * @vue-data {string} name - Nombre del cliente.
 * @vue-data {string} email - Email del cliente.
 * @vue-data {string} categoryId - Id de la categoría de la sesión.
 * @vue-data {string} location - Localidad de la sesión.
 * @vue-data {string} place - Lugar de la sesión.
 * @vue-data {string} selectedDate - Fecha de la sesión.
 * @vue-data {string} selectedTime - Hora de la sesión.
 * @vue-data {string} message - Mensaje del cliente.
 * @vue-data {string[]} availableTimes - Horas disponibles para la sesión.
 * @vue-data {string[]} availableDates - Fechas disponibles para la sesión.
 * @vue-data {boolean} formIsValidName - Indica si el nombre es válido.
 * @vue-data {boolean} formIsValidEmail - Indica si el email es válido.
 * @vue-data {boolean} formIsValidCategory - Indica si la categoría es válida.
 * @vue-data {boolean} formIsValidLocation - Indica si la localidad es válida.
 * @vue-data {boolean} formIsValidPlace - Indica si el lugar es válido.
 * @vue-data {boolean} formIsValidDate - Indica si la fecha es válida.
 * @vue-data {boolean} formIsValidTime - Indica si la hora es válida.
 * @vue-data {boolean} formIsValidMessage - Indica si el mensaje es válido.
 * @vue-data {boolean} formIsValid - Indica si el formulario es válido.
 * @vue-data {string} okMessage - Mensaje de éxito.
 * @vue-data {string} errorMessage - Mensaje de error.
 * @vue-computed {object[]} sortedCategories - Categorías ordenadas alfabéticamente.
 * @vue-methods calculateAvailableDates - Calcula las fechas disponibles para reservar una sesión.
 * @vue-methods isValidEmail - Comprueba si el email es válido.
 * @vue-methods closeDialog - Cierra el dialogo y resetea el formulario.
 * @vue-methods submitForm - Intenta enviar el formulario de solicitud de reserva de sesión.
 * @vue-created calculateAvailableDates - Calcula las fechas disponibles para reservar una sesión cuando se crea el componente.
 */
export default {
  components: {
    OkDialog,
  },
  data() {
    return {
      name: "",
      email: "",
      categoryId: "",
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
        "Otra (especifícala en el mensaje)",
      ],
      availableDates: [],
      formIsValidName: true,
      formIsValidEmail: true,
      formIsValidCategory: true,
      formIsValidLocation: true,
      formIsValidPlace: true,
      formIsValidDate: true,
      formIsValidTime: true,
      formIsValidMessage: true,
      formIsValid: true,
      okMessage: null,
      errorMessage: null,
    };
  },

  computed: {
    /**
     * Devuelve las categorías ordenadas alfabéticamente por nombre.
     */
    sortedCategories() {
      // Obtiene las categorías del store
      const categories = this.$store.getters["categories/categories"];

      // Ordena las categorías alfabetícamente por nombre
      return categories.slice().sort((a, b) => {
        return a.categoryName.localeCompare(b.categoryName);
      });
    },
  },

  methods: {
    /**
     * Calcula las fechas disponibles para reservar una sesión, jueves y domingos durante los proximos 90 días.
     */
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

    /**
     * Comprueba si el email es válido con una expresión regular.
     */
    isValidEmail(email) {
      // Use a more comprehensive email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Cierra el dialogo y resetea el formulario.
     */
    closeDialog() {
      this.name = "";
      this.email = "";
      this.categoryId = "";
      this.location = "";
      this.place = "";
      this.selectedDate = "";
      this.selectedTime = "";
      this.message = "";
      this.availableTimes = [
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
      ];
      this.availableDates = [];
      this.formIsValidName = true;
      this.formIsValidEmail = true;
      this.formIsValidCategory = true;
      this.formIsValidLocation = true;
      this.formIsValidPlace = true;
      this.formIsValidDate = true;
      this.formIsValidTime = true;
      this.formIsValidMessage = true;
      this.formIsValid = true;
      this.okMessage = null;
      this.errorMessage = null;
    },

    /**
     * Intenta enviar el formulario de solicitud de reserva de sesión y muestra
     * un mensaje de error o de éxito en función del resultado.
     * Si el formulario se envía correctamente, se añade la nueva reserva al
     * store y a la base de datos.
     */
    async submitForm() {
      this.formIsValid = true;
      // Validaciones
      this.formIsValidName = !!this.name.trim();
      this.formIsValidEmail = this.isValidEmail(this.email.trim());
      this.formIsValidCategory = !!this.categoryId;
      this.formIsValidLocation = !!this.location.trim();
      this.formIsValidPlace = !!this.place.trim();
      this.formIsValidDate = !!this.selectedDate.trim();
      this.formIsValidTime = !!this.selectedTime.trim();
      this.formIsValidMessage = !!this.message.trim();
      this.formIsValid =
        this.formIsValidName &&
        this.formIsValidEmail &&
        this.formIsValidCategory &&
        this.formIsValidLocation &&
        this.formIsValidPlace &&
        this.formIsValidDate &&
        this.formIsValidTime &&
        this.formIsValidMessage;
      // Si el formulario es valido, se envia
      if (this.formIsValid) {
        try {
          console.log("Dispatching addNewBooking");
          await this.$store.dispatch("bookings/addNewBooking", {
            name: this.name,
            email: this.email,
            categoryId: this.categoryId,
            location: this.location,
            place: this.place,
            selectedDate: this.selectedDate,
            selectedTime: this.selectedTime,
            message: this.message,
          });
          console.log("Dispatch completed");
          this.okMessage =
            "Gracias por tu interés en reservar una sesión de fotos conmigo! Me pondré en contacto contigo lo antes posible para profundizar en los detalles. ¡Espero verte pronto!";
          console.log("Formulario enviado:", this.okMessage);
        } catch (error) {
          console.error("Error enviando el formulario:", error);
          this.errorMessage =
            "Ha ocurrido un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.";
        }
      }
    },
  },

  /**
   * Calcula las fechas disponibles para reservar una sesión cuando se crea el
   * componente.
   */
  created() {
    this.$nextTick(() => {
      this.calculateAvailableDates();
    });
  },
};
</script>

<style scoped>
/* Estilos para el componente BookingForm.vue */

.container {
  width: 60%;
  margin: 0 auto;
  padding: 20px;
}

.container > h2 {
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
  text-align: center;
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

.errors {
  color: red;
  font-size: 14px;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}

/* MEDIA QUERIES */

@media (max-width: 855px) {
  .container {
    width: 98%;
  }
  .radio-group {
    flex-direction: column;
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
