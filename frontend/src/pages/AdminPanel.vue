<!-- Componente para la página panel de administración -->

<template>
  <div>

    <!-- Dialogo que muestra un mensaje o una reserva -->

    <ok-dialog :show="!!okMessage" @close="closeDialog" class="nameEmail">
      <div class="dataContainer">
        <!-- Data message -->
        <p v-if="dialogMessage">
          <strong>Nombre:</strong> {{ selectedMessage.messageName }}
        </p>
        <p v-if="dialogMessage">
          <strong>Email:</strong> {{ selectedMessage.messageEmail }}
        </p>
        <p v-if="dialogMessage"><strong>Message:</strong></p>
        <p v-if="dialogMessage" class="message">{{ okMessage }}</p>
        <!-- Data booking-->
        <p v-if="dialogBooking">
          <strong>Id de la solicitud:</strong> {{ selectedBooking.bookingId }}
        </p>
        <p v-if="dialogBooking">
          <strong>Fecha de creación:</strong>
          {{ formatDate(selectedBooking.createdAt) }}
        </p>
        <p v-if="dialogBooking">
          <strong>Nombre:</strong> {{ selectedBooking.name }}
        </p>
        <p v-if="dialogBooking">
          <strong>Email:</strong> {{ selectedBooking.email }}
        </p>
        <p v-if="dialogBooking">
          <strong>Categoria:</strong>
          {{ getCategoryName(selectedBooking.categoryId) }}
        </p>
        <p v-if="dialogBooking">
          <strong>Localidad:</strong> {{ selectedBooking.location }}
        </p>
        <p v-if="dialogBooking">
          <strong>Lugar:</strong> {{ selectedBooking.place }}
        </p>
        <p v-if="dialogBooking">
          <strong>Fecha:</strong> {{ selectedBooking.selectedDate }}
        </p>
        <p v-if="dialogBooking">
          <strong>Hora:</strong> {{ selectedBooking.selectedTime }}
        </p>
        <p v-if="dialogBooking"><strong>Message:</strong></p>
        <p v-if="dialogBooking" class="message">{{ okMessage }}</p>
      </div>
    </ok-dialog>

    <!-- Dialogo para editar una categoria -->

    <edit-category-dialog
      :show="!!openEditCategoryDialog"
      :category="selectedCategory"
      @close="closeEditCategoryDialog"
    >
      <div class="form">
        <input type="text" id="categoryName" v-model="updatedCategoryName" />
        <div v-if="!formIsValidCategoryName" class="errors">
          Por favor introduce un nombre válido.
        </div>
        <div class="buttons-container">
          <base-button @click="editCategory">Enviar</base-button>
          <base-button @click="closeEditCategoryDialog">Cancelar</base-button>
        </div>
      </div>
    </edit-category-dialog>

    <!-- Dialogo para responder un mensaje -->

    <reply-message :show="!!replyMessageEmail" @close="closeReplyMessage">
      <p><strong>De:</strong> {{ selectedMessage.messageName }}</p>
      <p><strong>Email:</strong> {{ selectedMessage.messageEmail }}</p>
      <p><strong>Mensaje:</strong> {{ okMessage }}</p>
      <div class="form">
        <p>Respuesta:</p>
        <textarea id="messageToReply" v-model="messageToReply" rows="10" />
        <div v-if="!formIsValidReplyMessage" class="errors">
          El mensaje no puede estar vacío.
        </div>
        <div class="buttons-container">
          <base-button @click="replyMessage">Enviar</base-button>
          <base-button @click="closeReplyMessage">Cancelar</base-button>
        </div>
      </div>
    </reply-message>

    <!-- Dialogo para actualizar una solicitud de reserva -->

    <edit-booking-dialog
      :show="!!openUpdateDialog"
      :booking="selectedBooking"
      @close="closeBookingUpdateDialog"
    >
      <div class="form">
        <input type="text" id="name" v-model="updatedName" placeholder="Nombre" />
        <div v-if="!formIsValidName" class="errors">
          Por favor introduce un nombre válido.
        </div>
        <input
          type="email"
          id="email"
          v-model="updatedEmail"
          placeholder="Email"
        />
        <div v-if="!formIsValidEmail" class="errors">
          Por favor introduce un email válido.
        </div>
        <select id="session" v-model="updatedCategoryId">
          <option v-if="!updatedCategoryId" value="" disabled selected>
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
          Por favor selecciona un tipo de sesión.
        </div>
        <select id="location" v-model="updatedLocation">
          <option v-if="!location" value="" disabled selected>
            Selecciona la localidad
          </option>
          <option value="Barcelona">Barcelona</option>
          <option value="Girona">Girona</option>
          <option value="Lloret">Lloret de Mar</option>
          <option value="Other">Otra (especificar en mensaje)</option>
        </select>
        <div v-if="!formIsValidLocation" class="errors">
          Por favor selecciona una localidad.
        </div>
        <div class="envoirment">
          <p class="title">Elige una localización:</p>
          <div class="radio-group">
            <label for="studio" class="radio-container">
              <div class="sideRadio">
                <input
                  type="radio"
                  id="studio"
                  v-model="updatedPlace"
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
                  v-model="updatedPlace"
                  value="En exteriores"
                />
                <span class="checkmark"></span>
                <span class="radio-desc">En exteriores</span>
              </div>
            </label>
            <label for="other" class="radio-container">
              <div class="sideRadio">
                <input
                  type="radio"
                  id="other"
                  v-model="updatedPlace"
                  value="Otro"
                />
                <span class="checkmark"></span>
                <span class="radio-desc">Otro</span>
              </div>
            </label>
          </div>
        </div>
        <div v-if="!formIsValidPlace" class="errors">
          Por favor selecciona una localización.
        </div>
        <select id="date" v-model="updatedSelectedDate">
          <option v-if="!updatedSelectedDate" value="" disabled selected>
            Selecciona la fecha
          </option>
          <option v-for="date in availableDates" :value="date" :key="date">
            {{ date }}
          </option>
          <option value="Otra">Otra (Especificar en el mensaje)</option>
        </select>
        <div v-if="!formIsValidDate" class="errors">Por favor seleccione una fecha.</div>
        <select id="time" v-model="updatedSelectedTime">
          <option v-if="!updatedSelectedTime" value="" disabled selected>
            Selecciona la hora
          </option>
          <option v-for="time in availableTimes" :value="time" :key="time">
            {{ time }}
          </option>
        </select>
        <div v-if="!formIsValidTime" class="errors">
          Por favor seleccione una hora.
        </div>
        <label for="message">Mensaje </label>
        <textarea id="message" v-model="updatedMessage" rows="10"></textarea>
        <div v-if="!formIsValidMessage" class="errors">
          Por favor introduce un mensaje.
        </div>
        <div class="buttons-container">
          <base-button @click="editBooking">Enviar</base-button>
          <base-button @click="closeBookingUpdateDialog">Cancelar</base-button>
        </div>
      </div>
    </edit-booking-dialog>

    <!--Dialogo que se muestra para dar un feedback al usuario cuando realiza una acción -->

    <transition name="feedback" appear>
      <div class="feedbackOk" v-if="feedbackOk === 1">
        <img src="../assets/Icons/ok.png" alt="ok" />
        <p>
          {{ feedbackMessage }}
        </p>
      </div>
    </transition>
    <transition name="feedback" appear>
      <div class="feedbackError" v-if="feedbackOk === 2">
        <img src="../assets/Icons/error.png" alt="Error" />
        <p>
          {{ feedbackMessage }}
        </p>
      </div>
    </transition>

    <!-- Menú de pestañas -->

    <div class="tabs">

      <!-- Pestaña 1 Imagenes -->

      <input
        type="radio"
        name="tabs"
        id="tabone"
        v-model="currentTab"
        @click="toggleTab('tabone')"
      />
      <label
        :style="{ background: currentTab === 'tabone' ? '#fff' : '' }"
        for="tabone"
        >Imagenes</label
      >
      <div class="tab" v-show="currentTab === 'tabone'">

        <!-- Dentro de la pestaña -->
        <!-- Botón para añadir imagenes -->

        <base-button class="buttonAdd" @click="addImages = !addImages"
          >Añadir imagenes</base-button
        >
        <div v-show="addImages" class="addItem">
          <div v-if="isLoading">
            <p>Subiendo imagenes...</p>
            <base-spinner />
          </div>
          <div v-else>
            <form @submit.prevent="submitForm">
              <div class="inputs-container">
                <input
                  type="file"
                  ref="fileInput"
                  class="file-select"
                  multiple
                  @change="handleFileUpload"
                  @click="resetUpload"
                />
                <div class="category-select">
                  <select v-model="categoryId" ref="categoryInput">
                    <option value="" disabled selected hidden>
                      Elige una categoría
                    </option>
                    <option
                      v-for="cat in categories"
                      :key="cat.categoryId"
                      :value="cat.categoryId"
                    >
                      {{ cat.categoryName }}
                    </option>
                  </select>
                </div>
              </div>
              <div v-show="categoryId" class="preview-container">
                <div class="preview-pic" v-for="file in files" :key="file.name">
                  <div class="img-container">
                    <img :src="file.preview" alt="Preview" />
                  </div>
                  <span>{{ file.name }}</span>
                </div>
              </div>
              <div
                v-show="categoryId && files.length > 0"
                class="buttons-container"
              >
                <base-button @click="submitForm">Enviar</base-button>
                <base-button @click="resetUpload">Cancelar</base-button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tabla con los datos de las imagenes -->

        <div>
          <table>
            <thead>
              <tr>
                <th class="th-1">Id</th>
                <th class="th-2">Vista Previa</th>
                <th class="th-3">Categoria</th>
                <th class="th-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="picture in pictures" :key="picture.pictureId">
                <td>{{ picture.pictureId }}</td>
                <td>
                  <img
                    :src="picture.picturePath"
                    alt="Thumbnail"
                    class="thumbnail"
                  />
                </td>
                <td>{{ picture.categoryName }}</td>
                <td class="actions-container">
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/view.png"
                      alt="Ver imagen"
                      title="Ver imagen"
                      @click="showModal(picture)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container view"
                    @click="showModal(picture)"
                  >
                    <img src="../assets/Icons/view.png" alt="Ver imagen" />
                    <div>VER IMAGEN</div>
                  </div>
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/delete.png"
                      alt="Borrar imagen"
                      title="Borrar imagen"
                      @click="deletePicture(picture.pictureId)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container delete"
                    @click="deletePicture(picture.pictureId)"
                  >
                    <img src="../assets/Icons/delete.png" alt="Borrar imagen" />
                    <div>ELIMINAR IMAGEN</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal para mostrar la imagen en grande -->

        <div v-if="showImageModal">
          <div class="backdrop" @click="closeModal"></div>
          <div class="modal">
            <div class="modal-content">
              <div class="backdrop2" @click="closeModal"></div>
              <img
                :src="selectedImage.picturePath"
                alt="Original Image"
                class="imagen"
              />
              <img
                src="../assets/Icons/closeB.png"
                class="close"
                @click="closeModal"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Pestaña 2 Categorias -->

      <input
        type="radio"
        name="tabs"
        id="tabtwo"
        v-model="currentTab"
        @click="toggleTab('tabtwo')"
      />
      <label
        :style="{ background: currentTab === 'tabtwo' ? '#fff' : '' }"
        for="tabtwo"
        >Categorías</label
      >
      <div class="tab" v-show="currentTab === 'tabtwo'">

        <!-- Dentro de la pestaña -->
        <!-- Botón para añadir categorias -->

        <base-button class="buttonAdd" @click="addCategory = !addCategory"
          >Añadir Categoría</base-button
        >
        <div v-show="addCategory" class="addItem">
          <div v-if="isLoading">
            <p>Añadiendo categoría...</p>
            <base-spinner />
          </div>
          <div v-else>
            <form @submit.prevent="addNewCategory">
              <div class="inputs-container-categories">
                <input
                  type="text"
                  name="cateogry"
                  id="category-input"
                  ref="categoryInput"
                  v-model="newCategoryName"
                  class="add-category-input"
                  placeholder="Introduce el nombre de la nueva categoría"
                />
                <div class="buttons-container">
                  <base-button @click="addNewCategory">Enviar</base-button>
                  <base-button @click="resetCategoryForm">Cancelar</base-button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Tabla con los datos de las categorias -->

        <div>
          <table class="categories">
            <thead>
              <tr>
                <th class="th-1">Id</th>
                <th class="th-2">Nombre</th>
                <th class="th-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categories" :key="category.categoryId">
                <td>{{ category.categoryId }}</td>
                <td>{{ category.categoryName }}</td>
                <td class="actions-container">
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/pen.png"
                      alt="Editar categoria"
                      title="Editar categoria"
                      @click="openUpdateCategoryDialog(category)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container edit"
                    @click="openUpdateCategoryDialog(category)"
                  >
                    <img src="../assets/Icons/pen.png" alt="Editar categoria" />
                    <div>EDITAR CATEGORIA</div>
                  </div>
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/delete.png"
                      alt="Eliminar categoria"
                      title="Eliminar categoria"
                      @click="deleteCategory(category.categoryId)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container delete"
                    @click="deleteCategory(category.categoryId)"
                  >
                    <img
                      src="../assets/Icons/delete.png"
                      alt="Eliminar categoria"
                    />
                    <div>ELIMINAR CATEGORIA</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pestaña 3 Mensajes -->

      <input
        type="radio"
        name="tabs"
        id="tabthree"
        v-model="currentTab"
        @click="toggleTab('tabthree')"
      />
      <label
        :style="{ background: currentTab === 'tabthree' ? '#fff' : '' }"
        for="tabthree"
        >Mensajes</label
      >
      <div class="tab" v-show="currentTab === 'tabthree'">

        <!-- Dentro de la pestaña -->
        <!-- Tabla con los datos de los mensajes -->

        <div>
          <table class="messages">
            <thead>
              <tr>
                <th class="th-1">Id</th>
                <th class="th-2">Nombre</th>
                <th class="th-3">Email</th>
                <th class="th-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="message in messages" :key="message.messageId">
                <td>{{ message.messageId }}</td>
                <td>{{ message.messageName }}</td>
                <td>{{ message.messageEmail }}</td>
                <td class="actions-container">
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/view.png"
                      alt="Ver mensaje"
                      title="Ver message"
                      @click="viewMessage(message)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container view"
                    @click="viewMessage(message)"
                  >
                    <img src="../assets/Icons/view.png" alt="view message" />
                    <div>VER MENSAJE</div>
                  </div>
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/responder.png"
                      alt="Responder mensaje"
                      title="Responder mensaje"
                      @click="replyMessageDialog(message)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container view"
                    @click="replyMessageDialog(message)"
                  >
                    <img
                      src="../assets/Icons/responder.png"
                      alt="Responder mensaje"
                    />
                    <div>RESPONDER MENSAJE</div>
                  </div>
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/delete.png"
                      alt="Eliminar mensaje"
                      title="Eliminar mensaje"
                      @click="deleteMessage(message.messageId)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container delete"
                    @click="deleteMessage(message.messageId)"
                  >
                    <img
                      src="../assets/Icons/delete.png"
                      alt="Eliminar mensaje"
                    />
                    <div>ELIMINAR MENSAJE</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pestaña 4 Solicitudes de Reservas -->

      <input
        type="radio"
        name="tabs"
        id="tabfour"
        v-model="currentTab"
        @click="toggleTab('tabfour')"
      />
      <label
        :style="{ background: currentTab === 'tabfour' ? '#fff' : '' }"
        for="tabfour"
        >Solicitudes de reserva</label
      >
      <div class="tab" v-show="currentTab === 'tabfour'">

        <!-- Dentro de la pestaña -->
        <!-- Tabla con los datos de las solicitudes de reserva -->

        <div>
          <table class="bookings">
            <thead>
              <tr>
                <th class="th-1">Id</th>
                <th class="th-2">Nombre</th>
                <th class="th-3">Categoría</th>
                <th class="th-4">Fecha</th>
                <th class="th-5">Hora</th>
                <th class="th-6">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in bookings" :key="booking.bookingId">
                <td>{{ booking.bookingId }}</td>
                <td>{{ booking.name }}</td>
                <td>{{ getCategoryName(booking.categoryId) }}</td>
                <td>{{ booking.selectedDate }}</td>
                <td>{{ booking.selectedTime }}</td>
                <td class="actions-container">
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/view.png"
                      alt="Ver detalles"
                      title="Ver detalles"
                      @click="viewDetails(booking)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container view"
                    @click="viewDetails(booking)"
                  >
                    <img src="../assets/Icons/view.png" alt="Ver detalles" />
                    <div>VER DETALLES</div>
                  </div>
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/pen.png"
                      alt="Editar reserva"
                      title="Editar reserva"
                      @click="openEditBookingDialog(booking)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container edit"
                    @click="openEditBookingDialog(booking)"
                  >
                    <img src="../assets/Icons/pen.png" alt="Editar reserva" />
                    <div>EDITAR RESERVA</div>
                  </div>
                  <div v-if="iconsActions">
                    <img
                      class="icon"
                      src="../assets/Icons/delete.png"
                      alt="Eliminar reserva"
                      title="Eliminar reserva"
                      @click="deleteBooking(booking.bookingId)"
                    />
                  </div>
                  <div
                    v-if="!iconsActions"
                    class="icon-container delete"
                    @click="deleteBooking(booking.bookingId)"
                  >
                    <img
                      src="../assets/Icons/delete.png"
                      alt="Eliminar reserva"
                    />
                    <div>ELIMINAR RESERVA</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import OkDialog from "../components/ui/OkDialog.vue";
import EditBookingDialog from "../components/ui/EditBookingDialog.vue";
import EditCategoryDialog from "../components/ui/EditCategoryDialog.vue";
import ReplyMessage from "../components/ui/ReplyMessage.vue";

/**
 * Componente para la página panel de administración.
 * @vue-data {string} currentTab - Pestaña actual.
 * @vue-data {array} files - Array con las imagenes seleccionadas.
 * @vue-data {boolean} addImages - Indica si hay que abrir el formulario para añadir imagenes o no.
 * @vue-data {boolean} addCategory - Indica si hay que abrir el formulario para añadir categorias o no.
 * @vue-data {string} categoryId - Id de la categoria seleccionada.
 * @vue-data {string} feedbackMessage - Mensaje de feedback que cambia dependiendo de la acción realizada.
 * @vue-data {number} feedbackOk - Según el valor, muestra un feedback u otro.
 * @vue-data {object} error - Error en caso de que haya uno.
 * @vue-data {boolean} isLoading - Indica si se está cargando o no.
 * @vue-data {object} selectedImage - Imagen seleccionada.
 * @vue-data {boolean} showImageModal - Indica si se muestra el modal de la imagen o no.
 * @vue-data {boolean} iconsActions - Indica si se muestran los iconos de las acciones o no.
 * @vue-data {string} newCategoryName - Nombre de la nueva categoria.
 * @vue-data {boolean} openEditCategoryDialog - Indica si se muestra el dialogo de editar categoria o no.
 * @vue-data {object} selectedCategory - Categoria seleccionada.
 * @vue-data {string} updatedCategoryName - Nombre de la categoria actualizado.
 * @vue-data {object} messageEmail - Mensaje del email.
 * @vue-data {object} selectedMessage - Mensaje seleccionado.
 * @vue-data {object} okMessage - Mensaje de feedback que cambia dependiendo de la acción realizada.
 * @vue-data {boolean} dialogMessage - Indica si se muestra el dialogo de mensaje o no.
 * @vue-data {boolean} dialogBooking - Indica si se muestra el dialogo de reserva o no.
 * @vue-data {boolean} openUpdateDialog - Indica si se muestra el dialogo de actualizar reserva o no.
 * @vue-data {object} selectedBooking - Reserva seleccionada.
 * @vue-data {string} updatedName - Nombre actualizado.
 * @vue-data {string} updatedEmail - Email actualizado.
 * @vue-data {string} updatedCategoryId - Id de la categoria actualizado.
 * @vue-data {string} updatedLocation - Localidad actualizada.
 * @vue-data {string} updatedPlace - Lugar actualizado.
 * @vue-data {string} updatedSelectedDate - Fecha actualizada.
 * @vue-data {string} updatedSelectedTime - Hora actualizada.
 * @vue-data {string} updatedMessage - Mensaje actualizado.
 * @vue-data {array} availableTimes - Array con las horas disponibles.
 * @vue-data {array} availableDates - Array con las fechas disponibles.
 * @vue-data {boolean} formIsValidCategoryName - Indica si el nombre de la categoria es válido o no.
 * @vue-data {boolean} formIsValidName - Indica si el nombre es válido o no.
 * @vue-data {boolean} formIsValidEmail - Indica si el email es válido o no.
 * @vue-data {boolean} formIsValidCategory - Indica si la categoria es válida o no.
 * @vue-data {boolean} formIsValidLocation - Indica si la localidad es válida o no.
 * @vue-data {boolean} formIsValidPlace - Indica si el lugar es válido o no.
 * @vue-data {boolean} formIsValidDate - Indica si la fecha es válida o no.
 * @vue-data {boolean} formIsValidTime - Indica si la hora es válida o no.
 * @vue-data {boolean} formIsValidMessage - Indica si el mensaje es válido o no.
 * @vue-data {boolean} formIsValid - Indica si el formulario es válido o no.
 * @vue-data {object} replyMessageEmail - Email del mensaje a responder.
 * @vue-data {string} messageToReply - Mensaje que se responderá.
 * @vue-data {boolean} formIsValidReplyMessage - Indica si el mensaje a responder es válido o no.
 * @vue-computed {array} categories - Devuelve las categorias del store.
 * @vue-computed {array} pictures - Devuelve las imagenes del store.
 * @vue-computed {array} messages - Devuelve los mensajes del store.
 * @vue-computed {array} bookings - Devuelve las solicitudes de reserva del store.
 * @vue-computed {array} sortedCategories - Devuelve las categorias ordenadas alfabeticamente.
 * @vue-methods closeDialog - Cierra el dialogo.
 * @vue-methods closeEditCategoryDialog - Cierra el dialogo de editar categoria.
 * @vue-methods closeReplyMessage - Cierra el dialogo de responder mensaje.
 * @vue-methods closeBookingUpdateDialog - Cierra el dialogo de actualizar reserva.
 * @vue-methods showIconsActions - Dependiendo del ancho de la pantalla, muestra o no los iconos de las acciones o no.
 * @vue-methods handleFileUpload - Funcion que procesa cada imagen seleccionada y le añade una vista previa a cada una y las almacena en el array files.
 * @vue-methods submitForm - Funcion asincrona que envia las imagenes al servidor para almacenarlas y registrarlas en la base de datos.
 * @vue-methods addNewCategory - Añade una nueva categoria.
 * @vue-methods resetCategoryForm - Resetea el formulario de añadir categoria.
 * @vue-methods openUpdateCategoryDialog - Abre el dialogo de editar categoria.
 * @vue-methods editCategory - Edita una categoria.
 * @vue-methods deleteCategory - Elimina una categoria.
 * @vue-methods viewMessage - Muestra un mensaje.
 * @vue-methods replyMessageDialog - Abre el dialogo de responder mensaje.
 * @vue-methods replyMessage - Responde un mensaje.
 * @vue-methods deleteMessage - Elimina un mensaje.
 * @vue-methods viewDetails - Muestra los detalles de una reserva.
 * @vue-methods openEditBookingDialog - Abre el dialogo de editar reserva.
 * @vue-methods editBooking - Edita una reserva.
 * @vue-methods deleteBooking - Elimina una reserva.
 * @vue-methods closeModal - Cierra el modal de la imagen.
 * @vue-methods showModal - Muestra el modal de la imagen.
 * @vue-methods resetUpload - Resetea el formulario de subir imagenes.
 * @vue-methods getCategoryName - Devuelve el nombre de la categoria.
 * @vue-methods formatDate - Formatea la fecha.
 * @vue-methods showIconsActions - Dependiendo del ancho de la pantalla, muestra o no los iconos de las acciones o no.
 * @vue-methods toggleTab - Alterna la pestaña.
 * @vue-methods showIconsActions - Dependiendo del ancho de la pantalla, muestra o no los iconos de las acciones o no.
 * @vue-components OkDialog - Componente para mostrar un mensaje o una reserva.
 * @vue-components EditBookingDialog - Componente de dialogo para editar una reserva.
 * @vue-components EditCategoryDialog - Componente de dialogo para editar una categoria.
 * @vue-components ReplyMessage - Componente de dialogo para responder un mensaje.
 */
export default {
  components: {
    OkDialog,
    EditBookingDialog,
    EditCategoryDialog,
    ReplyMessage,
  },
  data() {
    return {
      currentTab: "",
      files: [],
      addImages: false,
      addCategory: false,
      categoryId: "",
      feedbackMessage: "",
      feedbackOk: 3,
      error: null,
      isLoading: false,
      selectedImage: null,
      showImageModal: false,
      iconsActions: true,
      newCategoryName: "",
      openEditCategoryDialog: false,
      selectedCategory: null,
      updatedCategoryName: "",
      messageEmail: null,
      selectedMessage: null,
      okMessage: null,
      dialogMessage: false,
      dialogBooking: false,
      openUpdateDialog: false,
      selectedBooking: null,
      updatedName: "",
      updatedEmail: "",
      updatedCategoryId: "",
      updatedLocation: "",
      updatedPlace: "",
      updatedSelectedDate: "",
      updatedSelectedTime: "",
      updatedMessage: "",
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
      ],
      availableDates: [],
      formIsValidCategoryName: true,
      formIsValidName: true,
      formIsValidEmail: true,
      formIsValidCategory: true,
      formIsValidLocation: true,
      formIsValidPlace: true,
      formIsValidDate: true,
      formIsValidTime: true,
      formIsValidMessage: true,
      formIsValid: true,
      replyMessageEmail: null,
      messageToReply: "",
      formIsValidReplyMessage: true,
    };
  },
   computed: {
    categories() {
      return this.$store.getters["categories/categories"];
    },
    pictures() {
      return this.$store.getters["pictures/pictures"];
    },
    messages() {
      return this.$store.getters["messages/messages"];
    },
    bookings() {
      return this.$store.getters["bookings/bookings"];
    },
    sortedCategories() {
      // Get the categories from the store
      const categories = this.$store.getters["categories/categories"];

      // Sort the categories alphabetically by categoryName
      return categories.slice().sort((a, b) => {
        return a.categoryName.localeCompare(b.categoryName);
      });
    },
  },
  methods: {
    //METODOS GENERALES

    /**
     * Alterna la pestaña
     */
    toggleTab(tab) {
      console.log("Clicked tab:", tab);
      this.showIconsActions();
      // Toggle the value of currentTab
      this.currentTab = this.currentTab === tab ? "" : tab;
    },

    /**
     * Dependiendo del ancho de la pantalla, muestra o no los iconos de las acciones o no.
     */
    showIconsActions() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 1080) {
        this.iconsActions = true;
      } else {
        this.iconsActions = false;
      }
    },

    //METODOS DE LA SECCIÓN IMAGENES

    /**
     * Funcion que procesa cada imagen seleccionada y le añade una vista previa a cada una
     * y las almacena en el array files.
     */
    handleFileUpload(event) {
      this.files = Array.from(event.target.files).map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          file.preview = reader.result;
        };
        return file;
      });
    },

    /**
     * Funcion asincrona que envia las imagenes al servidor para almacenarlas y registrarlas en la base de datos.
     */
    async submitForm() {
      this.isLoading = true;
      const formData = new FormData();
      for (let i = 0; i < this.files.length; i++) {
        formData.append("images", this.files[i]);
      }
      formData.append("categoryId", this.categoryId);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/pictures",
          formData
        );

        if (response.status >= 200 && response.status < 300) {
          this.feedbackMessage = "Imagenes subidas correctamente";
          this.feedbackOk = 1;
          // reinicia el formulario una vez se han subido las imagenes exitosamente
          this.files = [];
          this.categoryId = "";
          // Despacha la accion para actualizar las imagenes en el store
          this.$store.dispatch("pictures/getPictures");
        } else {
          this.feedbackOk = 2;
          this.feedbackMessage = "Fallo subiendo imagenes, por favor inténtelo de nuevo";
        }
      } catch (err) {
        this.error =
          err.message || "Fallo subiendo imagenes, por favor inténtelo de nuevo";
        this.feedbackOk = 2;
        this.feedbackMessage = "Fallo subiendo imagenes, por favor inténtelo de nuevo";
      } finally {
        this.isLoading = false;
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
    },

    /**
     * Funcion que gestiona el evento de error.
     */
    handleError() {
      this.error = null;
      this.$refs.fileInput.value = "";
      this.$refs.categoryInput.value = "";
      this.files = [];
      this.categoryId = "";
    },

    /**
     * Funcion que reinicia el formulario de subir imagenes.
     */
    resetUpload() {
      this.feedbackMessage = "";
      this.feedbackOk = 3;
      this.$refs.fileInput.value = "";
      this.$refs.categoryInput.value = "";
      this.files = [];
      this.categoryId = "";
    },

    /**
     * Funcion asincrona que elimina una imagen de la base de datos y el archivo del servidor.
     */
    async deletePicture(pictureId) {
      try {
        const picture = this.pictures.find((p) => p.pictureId === pictureId);
        const url = new URL(picture.picturePath);
        const filePath = url.pathname; // extrae el path de la url
        const response = await this.$store.dispatch(
          "pictures/deletePicture",
          pictureId
        );
        if (response && response.status >= 200 && response.status < 300) {
          const fileResponse = await axios.delete(
            `http://localhost:3000/api/pictures/deleteFile`,
            {
              params: { filepath: filePath },
            }
          );

          if (fileResponse.status === 200) {
            this.feedbackMessage = "Imagen eliminada correctamente";
            this.feedbackOk = 1;
          } else {
            this.feedbackOk = 2;
            this.feedbackMessage = "Error eliminando imagen, por favor inténtelo de nuevo";
          }
        } else {
          this.feedbackOk = 2;
          this.feedbackMessage = "Error eliminando imagen, por favor inténtelo de nuevo";
        }
      } catch (error) {
        this.feedbackOk = 2;
        this.feedbackMessage = "Error eliminando imagen, por favor inténtelo de nuevo";
      }
      setTimeout(() => {
        this.feedbackMessage = "";
        this.feedbackOk = 3;
      }, 3000);
    },

    /**
     * Funcion que muestra una ventana modal con la imagen en grande.
     */
    showModal(picture) {
      this.selectedImage = picture;
      this.showImageModal = true;
      document.body.style.overflow = "hidden";
    },

    /**
     * Funcion que cierra la ventana modal.
     */
    closeModal() {
      this.showImageModal = false;
      document.body.style.overflow = "auto";
    },

    //METODOS DE LA SECCIÓN CATEGORIAS

    /**
     * Funcion que sirve para abrir el dialogo para editar una categoria.
     */
    openUpdateCategoryDialog(category) {
      this.openEditCategoryDialog = true;
      this.selectedCategory = category;
      console.log(this.selectedCategory);
      this.dialogMessage = false;
      this.dialogBooking = false;
      this.okMessage = null;
      this.errorMessage = null;
      this.openUpdateDialog = false;
      document.body.style.overflow = "hidden";
    },

    /**
     * Funcion sirve para cerrar el dialogo para editar una categoria.
     */
    closeEditCategoryDialog() {
      this.openEditCategoryDialog = false;
      this.selectedCategory = null;
      this.updatedCategoryName = "";
      this.formIsValidCategoryName = true;
      this.formIsValid = true;
      this.okMessage = null;
      this.errorMessage = null;
      document.body.style.overflow = "auto";
    },

    /**
     * Edita la categoria correspondiente en la base de datos
     * y en el store con los nuevos datos.
     */
    async editCategory() {
      this.formIsValid = true;
      // Validaciones
      this.formIsValidCategoryName = !!this.updatedCategoryName.trim();
      this.formIsValid = this.formIsValidCategoryName;
      if (this.formIsValid) {
        try {
          await this.$store.dispatch("categories/updateCategory", {
            categoryId: this.selectedCategory.categoryId,
            categoryName: this.updatedCategoryName,
          });
          this.closeEditCategoryDialog();
          this.feedbackMessage = "Categoría actualizada correctamente";
          this.feedbackOk = 1;
        } catch (error) {
          this.closeEditCategoryDialog();
          this.feedbackMessage = "Error actualizando categoría, por favor inténtelo de nuevo";
          this.feedbackOk = 2;
        }
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
    },

    /**
     * Agrega una nueva categoria a la base de datos y al store con los nuevos datos.
     */
    addNewCategory() {
      this.isLoading = true;
      const newCategoryName = this.newCategoryName;
      if (newCategoryName) {
        try {
          this.$store.dispatch("categories/addNewCategory", newCategoryName);
          this.feedbackMessage = "Categoría añadida correctamente";
          this.feedbackOk = 1;
          // Clear the ctaegoryInput input after successful upload
          this.newCategoryName = "";
        } catch (error) {
          this.feedbackMessage = "Error añadiendo categoría, por favor inténtelo de nuevo";
          this.feedbackOk = 2;
        }
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      } else {
        this.feedbackMessage = "Por favor introduce un nombre para la categoría";
        this.feedbackOk = 2;
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
      this.isLoading = false;
    },

    /**
     * Funcion que reinicia el formulario de añadir una categoria.
     */
    resetCategoryForm() {
      this.newCategoryName = "";
      this.addCategory = false;
    },

    /**
     * Funcion que elimina una categoria de la base de datos y del store.
     */
    deleteCategory(categoryId) {
      const picturesWithCategory = this.pictures.filter(
        (picture) => picture.categoryId == categoryId
      );
      if (picturesWithCategory.length > 0) {
        this.feedbackMessage =
          "Hay imagenes con esta categoría, por favor eliminalas antes de eliminar la categoría";
        this.feedbackOk = 2;
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      } else {
        try {
          this.$store.dispatch("categories/deleteCategory", categoryId);
          this.feedbackMessage = "Categoría eliminada correctamente";
          this.feedbackOk = 1;
        } catch (error) {
          this.feedbackMessage = "Error eliminando categoría, por favor inténtelo de nuevo";
          this.feedbackOk = 2;
        }
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
    },

    //METODOS DE LA SECCIÓN MENSAJES

    /**
     * Funcion para mostrar el mensaje seleccionado en un dialogo.
     */
    viewMessage(message) {
      this.dialogMessage = true;
      this.selectedMessage = message;
      this.okMessage = message.messageContent;
      document.body.style.overflow = "hidden";
    },

    /**
     * Funcion para cerrar el dialogo del mensaje.
     */
    closeDialog() {
      this.okMessage = null;
      this.selectedMessage = null;
      this.selectedBooking = null;
      this.dialogMessage = null;
      this.dialogBooking = null;
      document.body.style.overflow = "auto";
    },

    /**
     * Abre el dialogo para responder un mensaje.
     */
    replyMessageDialog(message) {
      this.replyMessageEmail = true;
      this.selectedMessage = message;
      this.okMessage = this.selectedMessage.messageContent;
      document.body.style.overflow = "hidden";
    },

    /**
     * Funcion asincrona que envia el mensaje de respuesta al servidor
     * para que lo envie al email del usuario.
     */
    async replyMessage() {
      this.formIsValid = true;
      // Validations
      this.formIsValidReplyMessage = !!this.messageToReply.trim();
      this.formIsValid = this.formIsValidReplyMessage;
      // Si el formulario es valido, se envia
      if (this.formIsValid) {
        try {
          await this.$store.dispatch("messages/replyMessage", {
            name: this.selectedMessage.messageName,
            email: this.selectedMessage.messageEmail,
            message: this.messageToReply,
            messageContent: this.selectedMessage.messageContent,
          });
          console.log("Mensaje enviado correctamente");
          this.feedbackMessage = "Mensaje enviado correctamente";
          this.feedbackOk = 1;
          this.closeReplyMessage();
        } catch (error) {
          this.feedbackMessage = "Error enviando el mensaje, por favor inténtelo de nuevo";
          this.feedbackOk = 2;
          this.closeReplyMessage();
        }
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
    },

    /**
     * Funcion que cierra el dialogo de responder un mensaje.
     */
    closeReplyMessage() {
      this.replyMessageEmail = null;
      this.okMessage = null;
      this.selectedMessage = null;
      this.messageToReply = "";
      this.formIsValidReplyMessage = true;
      this.formIsValid = true;
      document.body.style.overflow = "auto";
    },

    /**
     * Funcion que elimina un mensaje de la base de datos y del store.
     */
    deleteMessage(messageId) {
      try {
        this.$store.dispatch("messages/deleteMessage", messageId);
        this.feedbackMessage = "Mensaje eliminado correctamente";
        this.feedbackOk = 1;
      } catch (error) {
        this.feedbackMessage = "Error eliminando mensaje, por favor inténtelo de nuevo";
        this.feedbackOk = 2;
      }
      setTimeout(() => {
        this.feedbackMessage = "";
        this.feedbackOk = 3;
      }, 3000);
    },

    //METODOS DE LA SECCIÓN SOLICITUDES DE RESERVA

    /**
     * Función que devuelve el nombre de la categoria a la que pertenece la reserva.
     */
    getCategoryName(categoryId) {
      const category = this.categories.find(
        (category) => category.categoryId === categoryId
      );
      return category.categoryName;
    },

    /**
     * Función que formatea la fecha y la hora de la reserva.
     */
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${day}/${month}/${year} at ${hours}:${minutes}:${seconds}h.`;
    },

    /**
     * Función que muestra los detalles de la reserva en un dialogo.
     */
    viewDetails(booking) {
      this.dialogBooking = true;
      this.selectedBooking = booking;
      this.okMessage = booking.message;
      document.body.style.overflow = "hidden";
    },

    /**
     * Función que valida el email.
     */
    isValidEmail(email) {
      // Use a more comprehensive email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Función que abre el dialogo para editar una reserva.
     */
    openEditBookingDialog(booking) {
      this.openUpdateDialog = true;
      this.calculateAvailableDates();
      this.selectedBooking = booking;
      console.log(this.selectedBooking);
      this.dialogBooking = false;
      this.dialogMessage = false;
      document.body.style.overflow = "hidden";
    },

    /**
     * Función que cierra el dialogo para editar una reserva.
     */
    closeBookingUpdateDialog() {
      this.openUpdateDialog = false;
      this.updatedName = "";
      this.updatedEmail = "";
      this.updatedCategoryId = "";
      this.updatedLocation = "";
      this.updatedPlace = "";
      this.updatedSelectedDate = "";
      this.updatedSelectedTime = "";
      this.updatedMessage = "";
      this.formIsValidName = true;
      this.formIsValidEmail = true;
      this.formIsValidCategory = true;
      this.formIsValidLocation = true;
      this.formIsValidPlace = true;
      this.formIsValidDate = true;
      this.formIsValidTime = true;
      this.formIsValidMessage = true;
      this.formIsValid = true;
      this.selectedBooking = null;
      this.okMessage = null;
      this.errorMessage = null;
      document.body.style.overflow = "auto";
    },

    /**
     * Edita la reserva correspondiente en la base de datos
     * y en el store con los nuevos datos.
     */
    async editBooking() {
      this.formIsValid = true;
      // Validations
      this.formIsValidName = !!this.updatedName.trim();
      this.formIsValidEmail = this.isValidEmail(this.updatedEmail.trim());
      this.formIsValidCategory = !!this.updatedCategoryId;
      this.formIsValidLocation = !!this.updatedLocation.trim();
      this.formIsValidPlace = !!this.updatedPlace.trim();
      this.formIsValidDate = !!this.updatedSelectedDate.trim();
      this.formIsValidTime = !!this.updatedSelectedTime.trim();
      this.formIsValidMessage = !!this.updatedMessage.trim();
      this.formIsValid =
        this.formIsValidName &&
        this.formIsValidEmail &&
        this.formIsValidCategory &&
        this.formIsValidLocation &&
        this.formIsValidPlace &&
        this.formIsValidDate &&
        this.formIsValidTime &&
        this.formIsValidMessage;

      // Si el formulario es válido, se envia
      if (this.formIsValid) {
        try {
          await this.$store.dispatch("bookings/updateBooking", {
            bookingId: this.selectedBooking.bookingId,
            name: this.updatedName,
            email: this.updatedEmail,
            categoryId: this.updatedCategoryId,
            location: this.updatedLocation,
            place: this.updatedPlace,
            selectedDate: this.updatedSelectedDate,
            selectedTime: this.updatedSelectedTime,
            message: this.updatedMessage,
          });
          this.closeBookingUpdateDialog();
          this.feedbackMessage = "Solicitud de reserva actualizada correctamente";
          this.feedbackOk = 1;
        } catch (error) {
          this.closeBookingUpdateDialog();
          this.feedbackMessage = "Error actualizando la solicitud de reserva, por favor inténtelo de nuevo";
          this.feedbackOk = 2;
        }
        setTimeout(() => {
          this.feedbackMessage = "";
          this.feedbackOk = 3;
        }, 3000);
      }
    },

    /**
     * Funcion que elimina una reserva de la base de datos y del store.
     */
    deleteBooking(bookingId) {
      try {
        this.$store.dispatch("bookings/deleteBooking", bookingId);
        this.feedbackMessage = "Solicitud de reserva eliminada correctamente";
        this.feedbackOk = 1;
      } catch (error) {
        this.feedbackMessage =
          "Error eliminando la solicitud de reserva, por favor inténtelo de nuevo";
        this.feedbackOk = 2;
      }
      setTimeout(() => {
        this.feedbackMessage = "";
        this.feedbackOk = 3;
      }, 3000);
    },

    /**
     * Funcion que calcula las fechas disponibles para reservar.
     */
    calculateAvailableDates() {
      this.availableDates = [];
      const today = new Date();
      for (let i = 0; i < 90; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        // comprueba si es domingo (0) o jueves (4)
        if (currentDate.getDay() === 0 || currentDate.getDay() === 4) {
          const year = currentDate.getFullYear();
          let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
          let day = currentDate.getDate().toString().padStart(2, "0");
          this.availableDates.push(`${day}-${month}-${year}`);
        }
      }
    },

    /**
     * Cuando se crea el componente, se ejecuta esta funcion.
     * Que tiene otras funciones dentro.
     */
    created() {
      this.showIconsActions();
      this.okMessage = null;
      this.$nextTick(() => {
        this.calculateAvailableDates();
      });
    },
  },

  /**
   * Vigila el ancho de la pantalla para mostrar o no los iconos de las acciones.
   */
  watch: {
    "$store.getters.screenWidth"() {
      this.showIconsActions();
    },
  },
};
</script>

<style scoped>

/* Estilos para la pagina de administracion */

/* ESTILOS GENERALES */

body {
  background: #eee;
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 10vh;
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue",
    Helvetica, Arial, "Lucida Grande", sans-serif;
  font-weight: 300;
  line-height: 1.5;
  max-width: 60rem;
  margin: 0 auto;
  font-size: 112%;
}

/* Pestañas */

.tabs {
  display: flex;
  flex-wrap: wrap;
}
.tabs label {
  order: 1;
  letter-spacing: 0.02rem;
  font-size: 0.8rem;
  flex-grow: 1;
  display: block;
  padding: 1rem 2rem;
  margin-right: 0.2rem;
  cursor: pointer;
  background: #eee;
  transition: background ease 0.5s;
}
.tabs .tab {
  order: 99;
  flex-grow: 1;
  width: 100%;
  padding: 1rem;
  background: #fff;
}
.tabs input[type="radio"] {
  display: none;
}
.tabs input[type="radio"]:checked + label + .tab {
  display: block;
}

/* Dialogo Feedback */

.feedbackOk,
.feedbackError {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 1rem;
  right: 1rem;
  border-radius: 4px;
  padding: 0 1rem;
  height: 75px;
  font-size: 0.8rem;
  opacity: 0.95;
  z-index: 100;
}

.feedbackOk {
  background-color: #e2efe1;
  color: #016a3b;
}

.feedbackError {
  background-color: #ebd4d4;
  color: #ab0000;
}
.feedbackOk img,
.feedbackError img {
  opacity: 0.7;
  width: 40px;
  height: 40px;
  margin-right: 1rem;
}

.feedbackOk p,
.feedbackError p {
  margin: 0;
  display: flex;
  align-items: center;
}

.feedback-enter-active,
.feedback-leave-active {
  transition: all 0.4s ease;
}

.feedback-enter-from,
.feedback-leave-to {
  opacity: 0;
}

/* ok dialog */

.dataContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
}

.message {
  border: 1px solid #eee;
  height: 100px;
  padding: 0 0.5rem;
  overflow-y: scroll;
}

/* Imagenes */

.buttonAdd {
  margin-bottom: 1rem;
}

.addItem {
  width: 100%;
  height: auto;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1.2rem;
  max-width: 100%;
}

/* Formulario para añadir imagenes */

.addItem form {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.inputs-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
}

.inputs-container-categories {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.file-select {
  width: 300px;
  border-radius: 4px;
  font-family: Typewriter-extralight;
  font-size: 0.7rem;
  letter-spacing: 0.02rem;
  border: 1px solid #ccc;
  background-color: #f3f2f2;
}

.add-category-input {
  width: 40%;
  border-radius: 4px;
  font-family: Typewriter-extralight;
  font-size: 0.7rem;
  letter-spacing: 0.02rem;
  padding: 3rem;
  border: 1px solid #e8e8e8;
  background-color: #fff;
  margin: 0.5rem;
}

.add-category-input:focus {
  outline: none;
  border: 1px solid #f79f9f;
}

#category-input {
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0;
  padding: .7rem;
}

.file-select::file-selector-button {
  border: 1px solid #000;
  border-radius: 4px;
  padding: 8px;
  margin-right: 20px;
  font-family: Typewriter-extralight;
  font-size: 0.7rem;
  letter-spacing: 0.02rem;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.file-select::file-selector-button:hover {
  border: 1px solid #f79f9f;
}

.category-select select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 8px;
  width: 100%;
  font-family: Typewriter-extralight;
  font-size: 0.7rem;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #000;
  cursor: pointer;
  margin-left: 1rem;
  margin-top: 1.5rem;
  letter-spacing: 0.02rem;
}
.category-select {
  position: relative;
  width: 300px;
}

.category-select::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background-image: url("../assets/Icons/flecha-abajo.png");
  background-repeat: no-repeat;
  background-size: contain;
  pointer-events: none;
}

select option {
  padding-top: 4px;
  padding-bottom: 4px;
}

.preview-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: left;
}
.buttons-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.buttons-container div {
  margin: 0.5rem;
}

.addItem .preview-pic {
  display: flex;
  width: 75px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  padding: 0;
}

.preview-pic + .preview-pic {
  margin-left: 1rem;
}

.img-container {
  width: 75px;
  height: 75px;
}
.addItem .preview-pic img {
  width: 75px;
  height: 75px;
  object-fit: cover;
}

.preview-pic span {
  font-size: 0.5rem;
  margin-top: 0.3rem;
  max-width: 75px;
}

/* Tabla imagenes*/

table {
  border-collapse: collapse;
  width: 100%;
  font-family: Typewriter-extralight;
  letter-spacing: 0.02rem;
  font-size: 0.8rem;
}

.th-1,
.th-2,
.th-3 {
  width: 20%;
}
th,
td {
  text-align: center;
  padding: 0.5rem;
}

th {
  background-color: #98bb99;
  color: white;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

.thumbnail {
  width: 50px;
  height: 50px;
}

.actions-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  min-height: 70px;
}
.icon-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.6rem;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  opacity: 0.7;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem 1rem;
}

.icon-container div {
  margin-left: 0.5rem;
}

.icon-container img {
  width: 25px;
  height: 25px;
}
.view:hover {
  opacity: 1;
  background-color: #ddedfb;
}

.delete:hover {
  opacity: 1;
  background-color: #f9d0cd;
}

.icon-container + .icon-container {
  margin-left: 1rem;
}
.icon {
  width: 25px;
  height: 25px;
  opacity: 0.7;
  transition: all 0.2s ease;
  cursor: pointer;
}

.icon {
  margin: 0.5rem;
}

.icon:hover {
  opacity: 1;
}
.icon-container:hover {
  opacity: 1;
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 90;
}

.backdrop2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: transparent;
  z-index: 90;
}

.modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-height: 80vh;
  background-color: transparent;
  z-index: 94;
}

.modal-content {
  position: relative;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 96;
}

.modal-content img {
  position: relative;
  object-fit: contain;
  max-height: 80vh;
  z-index: 98;
}

.modal-content img.close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 20px;
  height: 20px;
  opacity: 0.7;
  z-index: 100;
}

.modal-content .close:hover,
.modal-content .close:focus {
  opacity: 1;
  cursor: pointer;
}

/* ESTILOS DE LAS SECCIÓN CATEGORIAS */

/*Tabla de categories*/

.categories .th-1,
.categories .th-2 {
  width: 25%;
}

.edit:hover {
  opacity: 1;
  background-color: #fdf6df;
}

/* ESTILOS DE LA SECCIÓN MENSAJES */

/*Tabla de mensajes*/

.messages .th-1 {
  width: 10%;
}

.messages .th-2,
.messages .th-3 {
  width: 20%;
}

/* ESTILOS DE LA SECCIÓN RESERVAS */

.bookings .th-1 {
  width: 5%;
}

.bookings .th-2,
.bookings .th-3 {
  width: 15%;
}

.bookings .th-4,
.bookings .th-5 {
  width: 8%;
}

/* MEDIA QUERIES */

@media (max-width: 821px) {
  .tabs .tab,
  .tabs label {
    order: initial;
  }
  .tabs label {
    width: 100%;
    margin-right: 0;
    margin-top: 0.2rem;
  }

  .th-1,
  .th-2,
  .th-3 {
    width: 25%;
  }

  .categories .th-1,
  .categories .th-2,
  .categories .th-3 {
    width: 30%;
  }

  .modal {
    max-width: 100%;
    width: 100%;
    z-index: 100;
  }

  .modal-content {
    position: relative;
    max-height: 100vh;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0;
    overflow: auto;
  }

  .modal-content img {
    max-height: 100%; /* Allow the image to scale down as needed */
    max-width: 100%; /* Allow the image to scale down as needed */
    width: auto; /* Ensure the image maintains its original aspect ratio */
    height: auto; /* Ensure the image maintains its original aspect ratio */
  }

  .add-category-input {
    width: 90%;
  }

  .actions-container {
    justify-content: space-evenly;
  }
}

@media (max-width: 500px) {
  table {
    font-size: 0.7rem;
  }

  .tabs .tab {
    padding: 1rem 0;
  }
}

/* Dialogo para editar reserva */

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 1rem;
}

textarea {
  font-family: Typewriter-light, Helvetica, Arial, sans-serif;
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

.radio-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sideRadio {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.3rem 0;
}

.radio-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
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

.buttons-container {
  padding: 1rem 0;
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

textarea + .errors {
  margin-top: 1rem;
}
</style>
