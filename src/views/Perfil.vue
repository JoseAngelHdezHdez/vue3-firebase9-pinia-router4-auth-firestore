<template>
    <h1 class="text-center">Mi Perfil</h1>
    <!-- <p>{{ userStore.userData }}</p> -->
    <div class="text-center">
        <a-avatar :src="userStore.userData.photoUrl" :size="150"></a-avatar>
    </div>
    <a-row>
        <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
            <a-form name="basicPerfil" autocomplete="off" layout="vertical" :model="userStore.userData" @finish="onFinish"
                @finishFailed="onFinishFailed">
                <a-form-item name="email" label="Tú correo">
                    <a-input disabled v-model:value="userStore.userData.email" placeholder="Email">
                        <template #prefix>
                            @
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item name="displayName" label="Ingrese su nombre"
                    :rules="[{ required: true, whitespace: true, message: 'Ingresa nombre valido' }]">
                    <a-input v-model:value="userStore.userData.displayName" placeholder="Nombre">
                        <template #prefix>
                            <UserOutlined />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-upload v-model:file-list="fileList" list-type="picture" :before-upload="beforeUpload"
                        @change="handleChange">
                        <a-button>
                            <UploadOutlined />
                            Subir imagen
                        </a-button>
                    </a-upload>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit" :loading="userStore.loadingUser"
                        :disabled="!userStore.userData.email">Actualizar Información</a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { UserOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue'
import { ref } from 'vue';

const userStore = useUserStore();
const fileList = ref([]);

const beforeUpload = (file) => {
    fileList.value = [...fileList.valuem, file];
    return false;
}

const handleRemove = file => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
};

const handleChange = info => {
    //valida tipos de imagenes
    if (info.file.status !== 'uploading') {
        // console.log(info.file)
        const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Solo puede ser JPG o PNG');
            handleRemove(info.file);
            return;
        }
        const isLt2M = info.file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Maximo 2MB!');
            handleRemove(info.file);
            return;
        }
    }
    
    //Se valida que sea una imagen pero la remplaza
    let resFileList = [...info.fileList];
    
    resFileList = resFileList.slice(-1);
    
    resFileList = resFileList.map(file => {
        if (file.response) {
            file.url = file.response.url;
        }
        return file;
    });
    fileList.value = resFileList;
};

const onFinish = async () => {
    const result = await userStore.updateUser(userStore.userData.displayName, fileList.value[0]);
    
    if (!result) {
        console.log(userStore.userData.photoURL)
        return message.success('Se actualizo tu informacion');
    }
    message.error('Ocuerrio un error')
}

const onFinishFailed = () => {

}
</script>
<style></style>     