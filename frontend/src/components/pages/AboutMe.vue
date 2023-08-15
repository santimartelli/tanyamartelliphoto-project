<template>
  <div class="container">
    <div class="description">
      <h2>Who I am?</h2>
      <p>
        Hello there! I'm Tatiana, a passionate photographer hailing from Russia
        and currently based in the beautiful Costa Brava region of Spain.
      </p>
      <p>
        Photography has always been my true calling, and I feel incredibly
        fortunate to be able to pursue my passion every single day. I specialize
        in capturing the beauty and essence of women, maternity, family, and
        newborns. These subjects hold a special place in my heart, as I am also
        a proud mother of twin girls. This personal experience has given me a
        deep understanding of the value of preserving precious moments, and I
        strive to create timeless memories for every client.
      </p>
      <img src="../../assets/images/tanya.jpg" :alt="name" />

      <p>
        Beyond my specializations, I am also well-versed in shooting for
        fashion, e-commerce, food, architecture, and real estate. I truly
        believe that every subject and every project offers unique possibilities
        for creating stunning and evocative images.
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
        Feel free to explore my portfolio to get a sense of my style and
        approach. If you're looking for a dedicated and skilled photographer who
        can beautifully capture your special moments, do not hesitate to reach
        out. I can't wait to create lasting memories with you!
      </p>
    </div>
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
.about-me {
  width: 60%;
  margin: 0 auto;
}

h2 {
  text-align: center;
}

img {
  padding: 1rem 0;
  width: 100%;
  height: auto;
  opacity: 0.95;
}
</style>
