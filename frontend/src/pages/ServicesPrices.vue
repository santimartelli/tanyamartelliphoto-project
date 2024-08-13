<!-- Componente que muestra los servicios y los precios -->

<template>
  <div class="services-prices">
    <div
      class="service-card"
      v-for="(service, index) in services"
      :key="index"
    >
      <img :src="service.image" alt="Service Image">
      <p class="title">{{ service.title }}</p>
      <p class="price">{{ service.price }}</p>
      <p> Incluye: </p>
      <ul>
        <li v-for="(item, index) in service.includes" :key="index">
          {{ item }}
        </li>
      </ul>
      <div class="button-container">
      <router-link to="/booking">
        <base-button>Reserva ya!</base-button>
      </router-link>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /**
       * Datos de los servicios y precios que se muestran en la página.
       */
      services: [
      {
          image: require('../assets/images/services_pics/acercadeti.webp'),
          title: 'Sesión "Acerca de tí"',
          price: '250€',
          includes: ['Organización de la sesión de fotos (yo misma me encargare de todo)', 'Maquillaje y estilismo para una persona', 'Estilista presente durante la sesión', 'Vestuario de mi colección (ver sección "Outfit" de mi Instagram)', 'Duración de la sesión: 2 horas', 'Entrega de 15 fotos retocadas (archivos originales opcionales)', '3-4 cambios de look', 'Entrega de fotos en 4-8 semanas (dependiendo de la carga de trabajo)', 'Consultar método de entrga de fotos, normalmente a través de Google Drive'],
        },
        {
          image: require('../assets/images/services_pics/acercadetiplus.webp'),
          title: 'Sesión "Acerca de tí PLUS"',
          price: '450€',
          includes: ['Organización de la sesión de fotos (yo misma me encargare de todo)', 'Maquillaje y estilismo para una persona', 'Estilista presente durante la sesión', 'Vestuario de mi colección (ver sección "Outfit" de mi Instagram)', 'Duración de la sesión: 3 horas', 'Entrega de 10 fotos retocadas (archivos originales opcionales)', 'Entrega de LIBRO DE FOTOS de 10 pliegues con las mejores tomas', '4-6 cambios de look', 'Entrega de fotos en 4-8 semanas (dependiendo de la carga de trabajo)', 'Consultar método de entrga de fotos, normalmente a través de Google Drive'],
        },
        {
          image: require('../assets/images/services_pics/mamaybebe.webp'),
          title: 'Sesión "mamá y bebé"',
          price: '220€',
          includes: ['Organización de la sesión de fotos (yo misma me encargare de todo)', 'El papá también puede participar', 'Maquillaje y estilismo para una o dos personas', 'Estilista presente durante la sesión', 'Vestuario de mi colección (ver sección "Outfit" de mi Instagram)', 'Duración de la sesión: 2 horas', 'Entrega de 10 fotos retocadas (archivos originales opcionales)', '2-3 cambios de look', 'Entrega de fotos en 4-8 semanas (dependiendo de la carga de trabajo)', 'Consultar método de entrga de fotos, normalmente a través de Google Drive'],
        },
        {
          image: require('../assets/images/services_pics/individual.webp'),
          title: 'Sesión "retrato individual"',
          price: '100€',
          includes: ['Organización de la sesión de fotos (yo misma me encargare de todo)', 'Duración de la sesión: 1 hora', 'Entrega de 1 foto retocada', 'Entrega de 200/300 archivos originales', 'Entrega de fotos en 1-2 semanas (dependiendo de la carga de trabajo)', 'Consultar método de entrga de fotos, normalmente a través de Google Drive'],
        },
        {
          image: require('../assets/images/services_pics/individualplus.webp'),
          title: 'Sesión "retrato individual PLUS"',
          price: '200€',
          includes: ['Organización de la sesión de fotos (yo misma me encargare de todo)', 'Duración de la sesión: 2 horas', 'Entrega de 2 fotos retocadas', 'Entrega de 300/400 archivos originales', 'Entrega de fotos en 1-2 semanas (dependiendo de la carga de trabajo)', 'Consultar método de entrga de fotos, normalmente a través de Google Drive'],
        },
        {
          image: require('../assets/images/services_pics/embarazo.webp'),
          title: 'Sesión "Embarazo"',
          price: '250€',
          includes: ['Organización de la sesión de fotos (yo misma me encargare de todo)', 'Maquillaje y estilismo para una persona', 'Duración de la sesión: 2 horas', 'Entrega de 10 fotos retocadas (archivos originales opcionales)', '2-3 cambios de look', 'Entrega de fotos en 4-8 semanas (dependiendo de la carga de trabajo)', 'Consultar método de entrga de fotos, normalmente a través de Google Drive'],
        },
        {
          image: require('../assets/images/services_pics/familiar.webp'),
          title: 'Sesión "Familiar"',
          price: '250€',
          includes: ['Organización de la sesión de fotos (yo misma me encargare de todo)', 'Duración de la sesión: 2 horas', 'Entrega de 10 fotos retocadas (archivos originales opcionales)', '2-3 cambios de look', 'Entrega de fotos en 4-8 semanas (dependiendo de la carga de trabajo)', 'Consultar método de entrga de fotos, normalmente a través de Google Drive'],
        },
        {
          image: require('../assets/images/services_pics/reciennacido.webp'),
          title: 'Sesión "Recien Nacido"',
          price: '250€',
          includes: ['Organización de la sesión de fotos (yo misma me encargare de todo)', 'Duración de la sesión: 2 horas', 'Entrega de 10 fotos retocadas (archivos originales opcionales)', '2-3 cambios de look', 'Entrega de fotos en 4-8 semanas (dependiendo de la carga de trabajo)', 'Consultar método de entrga de fotos, normalmente a través de Google Drive'],
        },
        {
          image: require('../assets/images/services_pics/eventos.webp'),
          title: 'Sesión "Eventos"',
          price: '125€/hora',
          includes: ['Entrega de 100-150 fotos por hora de sesión', 'Entrega de fotos en 1-2 semanas (dependiendo de la carga de trabajo)', 'Consultar método de entrga de fotos, normalmente a través de Google Drive', 'Consultar otras condiciones como traslados y alojamiento si es necesario'],
        },
        {
          image: require('../assets/images/services_pics/moda.webp'),
          title: 'Sesión "E-commerce / moda"',
          price: '125€/hora',
          includes: ['Organización conjunta de la sesión para respetar el estilo de la marca', 'Entrega de 10 fotos retocadas (foto extra 5€)', 'Entrega de fotos en 4-8 semanas (dependiendo de la carga de trabajo)', 'Consultar método de entrga de fotos, normalmente a través de Google Drive'],
        },
      ]
    }
  }
}
</script>

<style scoped>

/* Estilos para el componente ServicesPrices.vue */

.services-prices {
  font-family: typewriter-light;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2.5rem auto;
  width: 90%;
}

.service-card {
  width: 350px;
  margin: 1.5rem;
  display: flex;
  flex-direction: column;
}

.service-card img {
  display: flex;
  width: 350px;
  height: 400px;
  object-fit: cover;
}

.service-card ul{
  padding-bottom: 1rem;
}

.title {
  text-align: left;
  font-size: 14px;
  margin-top: 1rem;
  text-transform: uppercase;
}

.price {
  letter-spacing: .08rem;
  font-size: 14px;
}

.service-card li {
  list-style-type: '- ';
  font-size: 13px;
  margin: .5rem;
  
}

.button-container {
  display: flex;
  justify-content: center;
  margin: 1rem;
  align-self: center;
  margin-top: auto;
}
</style>
