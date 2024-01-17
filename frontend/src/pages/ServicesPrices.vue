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
        <base-button>Book Now !</base-button>
      </router-link>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      services: [
        {
          image: require('../assets/images/pregnancy/preg1.jpg'),
          title: 'Pregnancy Photoshoot',
          price: '250€',
          includes: ['2 hours', '50 pictures', '10 edited pictures']
        },
        {
          image: require('../assets/images/family/fam1.png'),
          title: 'Family Photoshoot',
          price: '250€',
          includes: ['2 hours', '50 pictures', '10 edited pictures', 'Extra edited picture 5€', 'Price of studio not included']
        },
        {
          image: require('../assets/images/fashion/fash1.jpg'),
          title: 'Individual Photoshoot',
          price: '250€',
          includes: ['2 hours', '50 pictures', '10 edited pictures', 'Extra edited picture 5€', 'Price of studio not included']
        },
        {
          image: require('../assets/images/newborn/newborn3.jpg'),
          title: 'Newborn Photoshoot',
          price: '250€',
          includes: ['2 hours', '50 pictures', '10 edited pictures', 'Extra edited picture 5€', 'Price of studio not included']
        },
        {
          image: require('../assets/images/nordic-garden.webp'),
          title: 'Event Photoshoot',
          price: '250€',
          includes: ['2 hours', '50 pictures', '10 edited pictures', 'Extra edited picture 5€', 'Price of studio not included']
        },
        {
          image: require('../assets/images/product/prod1.jpg'),
          title: 'Product Photoshoot',
          price: '250€',
          includes: ['2 hours', '50 pictures', '10 edited pictures', 'Extra edited picture 5€', 'Price of studio not included']
        },
        {
          image: require('../assets/images/nordic-garden.webp'),
          title: 'Architecture / Real Estate',
          price: '250€',
          includes: ['2 hours', '50 pictures', '10 edited pictures', 'Extra edited picture 5€', 'Price of studio not included']
        },
        // Add more services as needed
      ]
    }
  }
}
</script>

<style scoped>
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
  /* border: 1px solid #ccc; */
}
.service-card img {
  display: flex;
  width: 350px;
  height: 400px;
  object-fit: cover;
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


/* li::marker {
  color: #fbd8d8;
  font-size: 13px;
  font-weight: 600;
} */
.button-container {
  display: flex;
  justify-content: center;
  margin: 1rem;
  align-self: flex-end;
}

</style>


<!-- <template>
  <div class="container">
    <h2>Prices</h2>
    <div class="content">
      <p>
        Hello there! I'm Tatiana, a passionate photographer hailing from Russia
        and currently based in the beautiful Costa Brava region of Spain.
      </p>
      <p>
        Photography has always been my true calling, and I feel incredibly
        fortunate to be able to pursue my passion every single day. I specialize
        in capturing the beauty and essence of women, maternity, family, and
        newborns.
      </p>
    </div>
    <img src="../assets/images/tanya.jpg" :alt="name" />
    <p>
      These subjects hold a special place in my heart, as I am also a proud
      mother of twin girls. This personal experience has given me a deep
      understanding of the value of preserving precious moments, and I strive to
      create timeless memories for every client.
    </p>
    <p>
      Beyond my specializations, I am also well-versed in shooting for fashion,
      e-commerce, food, architecture, and real estate. I truly believe that
      every subject and every project offers unique possibilities for creating
      stunning and evocative images.
    </p>
    <p>
      When you choose me as your photographer, you can expect a commitment to
      excellence and a meticulous attention to detail. I believe in capturing
      the true essence of every subject and using my artistic eye to bring out
      the best in every photograph. I pour my heart and soul into my work, and
      my aim is to create visually captivating images that leave a lasting
      impression.
    </p>
    <p>
      Feel free to explore my portfolio to get a sense of my style and approach.
      If you're looking for a dedicated and skilled photographer who can
      beautifully capture your special moments, do not hesitate to reach out. I
      can't wait to create lasting memories with you!
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "Tatiana Martelli",
    };
  },
};
</script>

<style scoped>
.container {
  width: 80%;
  margin: 0 auto; /* Center the container */
  padding: 20px; /* Add some padding for spacing */
}

h2 {
  text-align: center;
  padding-bottom: 1rem;
}

img {
  max-width: auto;
  max-height: 410px; /* Maintain aspect ratio */
  object-fit: cover;
  display: block; /* Prevent inline spacing issues */
  padding: .5rem 1rem .5rem 0;
  float: left;
}

/* media queries */
@media (max-width: 855px) {
  .container{
    width: 98%;
  }
  img{
    width: 100%;
    height: auto;
    float: none;
    object-fit: cover;
    padding: .5rem 0;
  }
}

</style> -->
