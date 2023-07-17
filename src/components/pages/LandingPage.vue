<template>
  <div class="container">
    <div class="hero">
      <transition-group name="fade" tag="div">
        <div
          v-for="(image, index) in images"
          :key="image.id"
          class="image-container"
          v-show="index === currentImageIndex"
        >
          <img :src="image.src" :alt="image.alt" />
        </div>
      </transition-group>
    </div>
    <p>
      Welcome! I'm Tatiana, a passionate photographer based in Spain. From
      family portraits to fashion shots, I specialize in capturing life's most
      precious moments. Take a look at my portfolio and let's create beautiful
      memories together.
    </p>
    <p>
      Book a session or reach out for more information. Let's capture the magic
      together.
    </p>
  </div>
</template>

<script>
import preg1 from "@/assets/images/pregnancy/preg1.jpg";
import newborn1 from "@/assets/images/newborn/newborn1.jpg";
import newborn2 from "@/assets/images/newborn/newborn2.jpg";
import fam3 from "@/assets/images/family/fam3.jpg";

export default {
  data() {
    return {
      images: [
        { id: 1, src: preg1, alt: "Image 1" },
        { id: 2, src: newborn1, alt: "Image 2" },
        { id: 3, src: newborn2, alt: "Image 3" },
        { id: 4, src: fam3, alt: "Image 4"}
      ],
      currentImageIndex: 0,
    };
  },
  methods: {
    changeImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.images.length;
    },
  },
  created() {
    setInterval(this.changeImage, 5000); // Change image every 3 seconds
  },
};
</script>

<style scoped>
.hero {
  position: relative;
  height: 500px;
  overflow: hidden; /* Adjust this value to fit your images */
}

.image-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 1s ease-in-out;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-leave-active {
  transition: all 1s ease-in-out;
}

.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .hero {
    height: 300px;
  }
}
</style>
