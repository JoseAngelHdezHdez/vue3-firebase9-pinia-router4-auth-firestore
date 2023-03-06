<template>
    <div>
        <h1>Editar id:  {{ route.params.id }}</h1>
        <form @submit.prevent="handelSubmit">
            <input type="text" placeholder="Ingrese URL" v-model="url">
            <button type="submit">Actualizar</button>
        </form>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDatabaseStore } from '../stores/database';
import { ref } from 'vue';

const route = useRoute();
const databaseStore = useDatabaseStore();

const handelSubmit = () => {
    databaseStore.updateUrl(route.params.id, url.value);
}

const url = ref('');

onMounted(async() => {
    url.value = await databaseStore.leerUrl(route.params.id);
})
</script>

<style scoped>

</style>