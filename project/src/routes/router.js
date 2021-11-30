import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);

import Home from '@/pages/Home';
import Contato from '@/pages/Contato';

const routes = [
    {
        path:'/',
        component:Home
    },
    {
        path:'/contato',
        component:Contato
    }

];

const router = new VueRouter ({

    routes,
    //permite mostrar as rotas exemplo site/categoria/produto.js
    mode:'history'

});

export default router;