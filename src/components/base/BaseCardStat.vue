<script setup>
const props = defineProps({
    icon: {
        type: String,
    },
    icon_position: {
        default: "left",
        required: false,
    },
    color1: {
        type: String,
    },
    color2: {
        type: String,
    },
    value: {
        type: Number
    },
    title: {
        type: String
    }
});
</script>
<template>
    <div>
        <q-item class="q-pa-none" :style="`background-color: ${props.color1}`">
            <q-item-section v-if="icon_position === 'left'" side :style="`background-color: ${props.color2}`" class="q-pa-lg q-mr-none text-white">
                <q-icon :name="props.icon" color="white" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class="q-pa-md q-ml-none text-white">
                <q-item-label class="text-white text-h6 text-weight-bolder">
                    {{ props.value }}
                </q-item-label>
                <q-item-label>
                    {{ props.title }}
                </q-item-label>
            </q-item-section>
            <q-item-section v-if="icon_position === 'right'" side class="q-mr-md text-white">
              <q-icon :name="props.icon" color="white" size="44px"></q-icon>
            </q-item-section>
        </q-item>
    </div>
</template>
