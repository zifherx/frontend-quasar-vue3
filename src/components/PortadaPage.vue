<script setup>
import { ref } from "vue";

const props = defineProps({
    urlImages: {
        type: Array,
    },
});

let autoplay = ref(true);
let fullscreen = ref(false);
const slide = ref(1);
</script>
<template>
    <div>
        <q-carousel
            v-model="slide"
            v-model:fullscreen="fullscreen"
            height="550px"
            animated
            arrows
            infinite
            :autoplay="autoplay"
            transition-prev="slide-right"
            transition-next="slide-left"
            @mouseenter="autoplay = false"
            @mouseleave="autoplay = true"
        >
            <q-carousel-slide v-for="(item, index) in props.urlImages" :key="index" :name="item.name" :img-src="item.src" />

            <template v-slot:control>
                <q-carousel-control>
                    <q-btn push round dense color="white" text-color="primary" :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="fullscreen = !fullscreen" />
                </q-carousel-control>
            </template>
        </q-carousel>
    </div>
</template>
