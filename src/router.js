import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from './stores/user';
import { useDatabaseStore } from './stores/database';

import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Editar from './views/Editar.vue';
import Perfil from './views/Perfil.vue';
import NotFound from './views/NotFound.vue';


const requireAuth = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const user = await userStore.currentUser();
    if (user) {
        next();
    } else {
        next('/login');
    }
    userStore.loadingSession = false;
}

const redireccion = async (to, from, next) => {
    const databaseStore = useDatabaseStore();
    const userStore = useUserStore();
    userStore.loadingSession = true;
    // console.log(to.params.pathMatch[0]);
    const name = await databaseStore.getUrl(to.params.pathMatch[0]);
    if (!name) {
        next();
        userStore.loadingSession = false;
    } else {
        window.location.href = name;
        userStore.loadingSession = true;
        next();
    }
}

const routes = [
    {
        path: '/',
        component: Home,
        beforeEnter: requireAuth,
        name: 'home'
    },
    {
        path: '/editar/:id',
        component: Editar,
        beforeEnter: requireAuth,
        name: 'editar'
    },
    ,
    {
        path: '/perfil',
        component: Perfil,
        beforeEnter: requireAuth,
        name: 'perfil'
    },
    {
        path: '/login',
        component: Login,
        name: 'login'
    },
    {
        path: '/register',
        component: Register,
        name: 'register'
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound,
        beforeEnter: redireccion,
        name: '404'
    }
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

export default router;