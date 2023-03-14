<template>
    <h1 class="text-center">Login</h1>
    <a-row>
        <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
            <a-form name="basicLogin" autocomplete="off" layout="vertical" :model="formState" @finish="onFinish"
                @finishFailed="onFinishFailed">
                <a-form-item name="email" label="Ingresa tu correo"
                    :rules="[{ required: true, whitespace: true, message: 'Ingresa un email', type: 'email' }]">
                    <a-tooltip placement="bottom">
                        <template #title>
                            <span>j********@gmail.com.mx</span>
                        </template>
                        <a-input v-model:value="formState.email" placeholder="Email">
                            <template #prefix>
                                <UserOutlined style="color: rgba(0,0,0,0.25)" />
                            </template>
                        </a-input>
                    </a-tooltip>
                </a-form-item>
                <a-form-item name="password" label="Ingrese su contraseña"
                    :rules="[{ required: true, min: 6, whitespace: true, message: 'Ingresa una contraseña ' }]">
                    <a-tooltip placement="bottom">
                        <template #title>
                            <span>Tiene que ser minimo de 6 caracteres</span>
                        </template>
                        <a-input-password v-model:value="formState.password" placeholder="Password">
                            <template #prefix>
                                <LockOutlined style="color: rgba(0,0,0,0.25)" />
                            </template>
                        </a-input-password>
                    </a-tooltip>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit" :loading="userStore.loadingUser"
                        :disabled="userStore.loadingUser || formState.email === '' || formState.password === ''">Ingresar</a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { reactive } from 'vue';
import { useUserStore } from '../stores/user';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
// import { useRouter } from 'vue-router';

const userStore = useUserStore();
const formState = reactive({
    email: '',
    password: ''
});

const onFinish = async () => {
    // console.log('Success: ', value)
    const result = await userStore.loginUser(formState.email, formState.password)

    if (!result) {
        return message.success('Bienvenido');
    }

    switch (result) {
        case "auth/user-not-found":
            message.error('El usuario o la contraseña estan mal')
            break;
        case "auth/wrong-password":
            message.error('El usuario o la contraseña estan mal')
            break;
        default:
            message.error('Hubo un error en el servidor ')
            break;
    }
};

const onFinishFailed = errorInfo => {
    console.log('Failed: ', errorInfo)
};

</script> 