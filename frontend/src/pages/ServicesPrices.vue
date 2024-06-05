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
          image: require('../assets/images/services_pics/embarazo.jpg'),
          title: 'Sesión de Embarazo',
          price: '250€',
          includes: ['2 horas', '50 fotos', '10 fotos editadas']
        },
        {
          image: require('../assets/images/services_pics/familiar.jpg'),
          title: 'Sesión Familiar',
          price: '250€',
          includes: ['2 horas', '50 fotos', '10 fotos editadas', 'Foto extra editada 5€', 'Precio del studio no incluido']
        },
        {
          image: require('../assets/images/services_pics/individual.jpg'),
          title: 'Retrato Individual',
          price: '250€',
          includes: ['2 horas', '50 fotos', '10 fotos editadas', 'Foto extra editada 5€', 'Precio del studio no incluido']
        },
        {
          image: require('../assets/images/services_pics/reciennacido.jpg'),
          title: 'Recien Nacido',
          price: '250€',
          includes: ['2 horas', '50 fotos', '10 fotos editadas', 'Foto extra editada 5€', 'Precio del studio no incluido']
        },
        {
          image: require('../assets/images/services_pics/eventos.jpg'),
          title: 'Reportaje Eventos',
          price: '250€',
          includes: ['2 horas', '50 fotos', '10 fotos editadas', 'Foto extra editada 5€']
        },
        {
          image: require('../assets/images/services_pics/moda.jpg'),
          title: 'E-commerce y moda',
          price: '250€',
          includes: ['2 horas', '50 fotos', '10 fotos editadas', 'Foto extra editada 5€']
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
