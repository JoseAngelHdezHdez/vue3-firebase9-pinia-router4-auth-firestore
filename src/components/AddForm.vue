<template>
    <a-form name="addForm" autocomplete="off" layout="vertical" :model="formState" @finish="onFinish">
        <!-- Expresiones regulares -->
        <a-form-item name="url" label="Ingrese una url"
            :rules="[{ required: true, whitespace: true, pattern: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/, message: 'Ingresa una url válida' }]">
            <a-input v-model:value="formState.url" placeholder="https://antdv.com/components/icon" enter-button>
                <template #prefix>
                    <ChromeOutlined/>
                </template>
            </a-input>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" html-type="submit" :loading="databaseStore.loading"
                :disabled="databaseStore.loading">Agregar url</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { reactive } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { message } from 'ant-design-vue';
import { ChromeOutlined } from '@ant-design/icons-vue';


const databaseStore = useDatabaseStore();

const formState = reactive({
    url: ''
})

const onFinish = async (value) => {
    const result = await databaseStore.addUrl(formState.url);

    if (!result) {
        formState.url = '';
        return message.success('Se ha agregado la url');
    }

    message.error('Ocurrio un error en el servidor');
}

</script>