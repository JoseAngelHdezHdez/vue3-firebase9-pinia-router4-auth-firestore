<template>
    <div>
        <h1>Home</h1>
        <p>{{ userStore.userData?.email }}</p>

        <form @submit.prevent="handelSubmit">
            <input type="text" placeholder="Ingrese URL" v-model="url">
            <button type="submit">Agregar</button>
        </form>

        <p v-if="databaseStore.loadingDoc">Loading docs...</p>
        <ul v-else>
            <li v-for="data in databaseStore.documents" :key="data.id">
                {{ data.id }}
                <br>
                {{ data.short }}
                <br>
                {{ data.name }}
                <button @click="databaseStore.deleteUrl(data.id)">Eliminar</button>
                <button @click="router.push(`/editar/${data.id}`)">Editar</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useDatabaseStore } from '../stores/database';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

databaseStore.getUrls();

const url = ref('')

const handelSubmit = () => {
    databaseStore.addUrl(url.value);
}


</script>
