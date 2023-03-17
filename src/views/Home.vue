<template>
    <div>
        <h1 class="text-center">Home</h1>
        <p>{{ userStore.userData?.email }}</p>

        <add-form></add-form>

        <p v-if="databaseStore.loadingDoc">Loading docs...</p>

        <a-space direction="vertical" v-if="!databaseStore.loadingDoc" style="width: 100%;">
            <a-card v-for="data in databaseStore.documents" :key="data.id" :title="data.short">
                <template #extra>
                    <a-space>
                        <a-popconfirm title="¿Estas seguro de eliminarlo?" ok-text="Si" cancel-text="No" @confirm="confirm(data.id)" @cancel="cancel">
                            <a-button danger :loading="databaseStore.loading" :disabled="databaseStore.loading" shape="circle">
                                <template #icon>
                                    <DeleteOutlined/>
                                </template>
                            </a-button>
                        </a-popconfirm>
                        <a-button type="primary" ghost @click="router.push(`/editar/${data.id}`)" shape="circle">
                            <template #icon>
                                <EditOutlined/>
                            </template>
                        </a-button>
                        <a-button @click="copiarPortapeles(data.id)" shape="circle">
                            <template #icon>
                                <CopyOutlined/>
                            </template>
                        </a-button>
                    </a-space>
                </template>
                <p>{{ data.name }}</p>
            </a-card> 
        </a-space>
    </div>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useDatabaseStore } from '../stores/database';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons-vue';

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

databaseStore.getUrls();

const confirm = async(id) => {
    const result = await databaseStore.deleteUrl(id)

    if (!result) {
        return message.success('Se eliminó con éxito');
    }
    return message.error(result);
};

const cancel = () => {
    message.error('No se elimino');
};

const copiarPortapeles = async (id) => {
    if (!navigator.clipboard) {
        return message.error('No tiene portapapeles');
    }

    const path = `${window.location.origin}/${id}` 

    const err = await navigator.clipboard.writeText(path);

    if (err) {
        message.error("Ocurrio un error");
    } else {
        message.success("Url copiada");    
    }

    // navigator.clipboard.writeText(path)
    //     .then(() => {
    //         message.success("Url copiada");
    //     })
    //     .catch((err) => {
    //         message.error("Ocurrio un error");
    //     });
    
}
</script>
