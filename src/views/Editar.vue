<template>
    <h1>Editar id: {{ route.params.id }}</h1>
    <a-form name="editForm" autocomplete="off" layout="vertical" :model="formState" @finish="onFinish">
        <!-- Expresiones regulares -->
        <a-form-item name="url" label="Ingrese una url"
            :rules="[{ required: true, whitespace: true, pattern: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/, message: 'Ingresa una url válido' }]">
            <a-input v-model:value="formState.url" placeholder="https://antdv.com/components/icon" enter-button>
                <template #prefix>
                    <ChromeOutlined />
                </template>
            </a-input>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" html-type="submit" :loading="databaseStore.loading"
                :disabled="databaseStore.loading">Editar url</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDatabaseStore } from '../stores/database';
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { ChromeOutlined } from '@ant-design/icons-vue';



const route = useRoute();
const databaseStore = useDatabaseStore();
const formState = reactive({
    url: ''
})

const onFinish = async () => {
    const result = await databaseStore.updateUrl(route.params.id, formState.url);

    if (!result) {
        formState.url = '';
        return message.success('Se cambio correctamente ');
    }

    message.error('Ocurrio un error en el servidor');
}

onMounted(async () => {
    formState.url = await databaseStore.leerUrl(route.params.id);
})
</script>

<style scoped></style>