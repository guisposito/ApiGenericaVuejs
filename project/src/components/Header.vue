<template>
    <header>
        <nav class="container">
            <a href="/"><img alt="Gsistema" id="logo" src="../assets/logo_g.jpg"></a>
            
            <img v-on:click="openMenu" alt="Abrir menu" id="menu-button" src="../assets/menu.svg">
            
            <div v-on:click="closeMenu" v-if="menuActive" id="menu-overlay"></div>
            <div id="menu-items" :class="{active:menuActive}">
                <img alt="Gsistema" id="menu-logo" src="../assets/logo_g.jpg">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/contato">Contato</a></li>
                </ul>
            </div>
        </nav>    
    </header>
</template>

<script>
export default {
    name: 'Header',

    data(){
        return{
            menuActive: false,
        }
    },
    methods:{
        openMenu(){
            this.menuActive = true;
        },
        closeMenu(){
            this.menuActive = false;
        }

    }
    
}
</script>


<style scoped>

    header{
        background-color: var(--color-background-nav);
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    nav{
        display: flex;
        justify-content: space-between;
        height: 60px;
        align-items: center;
    }

    #logo{
        width: 50px;
    }

    #menu-button{
        width: 30px;
    }
    #menu-overlay{
        position: fixed;
        top: 0;
        left: 0;
        width: 60%;
        height: 100vh;
        background-color: #000000;
        opacity: 0.8;
    }

    #menu-logo{
        width: 50px;
        margin-top: 50px;
        margin-bottom: 10px;
        
    }
    #menu-items{
        position: fixed;
        margin-top: 2px;
        top: 0;
        right: 0;
        display: none;
        background-color: var(--color-background-nav);
        width: 40%;
        height: 100%;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    #menu-items.active{
        display: flex;
    }
    ul{
        list-style: none;
        text-align: center;
        height: 60px;
        align-items: center;
    }

    ul li{
        margin: 20px 0px;
    }

    ul li a{
        color: var(--color-text-light);
        font-weight: bold;
    }

    @media (min-width:700px) {
        #menu-button,
        #menu-logo,
        #menu-overlay{
            display:none;
        }

        #menu-items{
            display: flex;
            position: static;
            height: 50px;
            width: auto;
        }

        ul{
            display: flex;
        }
        ul li{
            margin: 0;
            margin-right: 20px;
        }
        
    }

</style>