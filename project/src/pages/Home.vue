<template>
    <main>
        <div>
            <h2>Cadastro de Alunos</h2>
            <hr>

        </div>
        <div class="row">
        <div class="container">
            <b-form class="form-all">
                <h5 class="box-title">{{ formTitle }}</h5>
                <b-form-group class="form-group" label="Nome:">
                    <b-form-input v-model="aluno.nome" type="text" placeholder="Digite seu nome"></b-form-input>
                </b-form-group>
                <b-form-group class="form-group" label="Email:">
                    <b-form-input v-model="aluno.email" type="email" placeholder="Digite seu e-mail"></b-form-input>
                </b-form-group>
                <b-form-group class="form-group" label="CPF:">
                    <b-form-input v-model="aluno.cpf" v-mask="'###.###.###-##'" type="text" placeholder="Digite seu CPF"></b-form-input>
                </b-form-group>
                <div class="buttons">
                    <b-button v-if="!editing" size="sm" type="submit" variant="primary" class="m-1" @click.prevent="save">Cadastrar</b-button>
                    <b-button v-if="editing" size="sm" variant="primary" class="btn-cadastrar" @click="update(aluno)">Editar</b-button>
                    <b-button class="m-1" size="sm" variant="dark" @click="clean">Limpar</b-button>
                </div>
            </b-form>
        </div>
        
        <div id="card-consulta" class="col-12 col-md-8">
            <div id="card" class="card">
                <div class="box-header m-2">
                    <h5 class="box-title">Lista de Alunos</h5>
                </div>
                <div class="box-body ">
                    <b-table-simple striped small caption-top responsive>
                        <b-thead head-variant="dark">
                            <b-tr>
                                <b-th>#</b-th>
                                <b-th>Nome</b-th>
                                <b-th>Email</b-th>
                                <b-th>CPF</b-th>
                                <b-th class="text-center">Ações	</b-th>
                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="(aluno, index) in alunos" :key="index">
                                <b-th>{{ aluno.id }}</b-th>
                                <b-th>{{ aluno.nome }}</b-th>
                                <b-td>{{ aluno.email }}</b-td>
                                <b-td>{{ aluno.cpf }}</b-td>
                                <b-td class="text-center">
                                    <b-button-group size="sm" class="mr-1">
                                        <b-button v-b-tooltip.hover :title="aluno.length > 1 ? 'Editar' : ''" @click="onEdit(aluno)">
                                            <b-icon icon="tools" aria-hidden="true"></b-icon>
                                        </b-button>
                                        <b-button v-b-tooltip.hover :title="aluno.length > 1 ? 'Deletar' : ''" @click="remove(aluno)">
                                            <b-icon icon="X" aria-hidden="true"></b-icon>
                                        </b-button>
                                    </b-button-group>
                                </b-td>
                            </b-tr>
                        </b-tbody>
                    </b-table-simple>
                    <b-pagination v-model="page" align="center" :total-rows="rows" :per-page="perPage" aria-controls="my-table"></b-pagination>
                </div>
                <!-- /.box-body -->
            </div>
        </div>
        </div>
        
    </main>
</template>

<script>
import api from '@/services/api.js';

export default {
    name:'Home',
    
    data(){
        return{
            formTitle: 'Novo Aluno',
            editing: false,
            rows: 0,
            page: 1,
            perPage: 8,
            studentList: [],
            alunos: [],
            aluno: {
                nome: '',
                email: '',
                cpf: '',
            },

        }
    },
    async mounted(){
        await this.getAlunos();
    },
    watch: {
        page: async function (val){
            await this.getAlunos(val);
        }
    },
    methods:{
        async init(){
            await this.getList();
            await this.getAlunos();
            this.clean();
        },
        async makeRequest (path = '', method = 'get', data = null) {
            return api[method.toLocaleLowerCase()](path, data)
            .then( res => {
    
                return res.data;					
            })
            .catch( e => {
                this.$alert(`Ocorreu um erro, tente mais tarde!`, 'Error', 'warning');
                console.error(e);
                return false;
            })
        },

        async getAlunos (currentPage = this.page, update = false) {
            if ((!this.studentList || !this.studentList.length) || update)
                await this.getList();
        
            await this.filterList(currentPage);
        },

        async getList () {
            this.studentList = await this.makeRequest('./aluno/consultar', 'get');
        },

        async filterList (currentPage) {
            this.rows       = this.studentList.length;      // Dados totais para paginação
            this.alunos     = [];                           // Dados da listagem que vão aparecer
            let maxIndex    = currentPage * this.perPage;   // Index máximo da paginação. Ou seja, até qual registro vai pegar do backup(this.studentList)
            let minIndex    = maxIndex - this.perPage;      // Index minimo da paginação. Ou seja, até qual registro vai pegar do backup(this.studentList)
            this.alunos     = this.studentList.filter((val, index) => {
                return index < maxIndex && index >= minIndex 
            });

            // for (let index in this.studentList){
            //     if (){
            //         this.alunos.push(this.studentList[index]);
            //     }           
            // }
        },

        async save (){
            if(!this.validateField(this.aluno) || this.validateEmail())
                return false;
            await this.makeRequest('./aluno/inserir', 'post', this.aluno);
            await this.getAlunos(this.page, true);
            this.$alert('Aluno criado com sucesso', 'Success', 'info');
            await this.clean();
        },
        onEdit(data){
            this.formTitle = `Editando: ${data.id} - ${data.nome}`;
            this.editing = true;
            Object.assign(this.aluno, data);
        },
        async update(data){
            this.$confirm('Deseja editar os dados deste aluno?')
            .then(async() => {
                await this.makeRequest(`./aluno/editar/${data.id}`, 'post', this.aluno);
                await this.init();
                this.$alert('Alterado com sucesso', "Success", 'success');
            });

        },
        async remove(data){
            this.$confirm('Deseja realmente deletar este aluno?')
            .then(async () =>{
                await this.makeRequest(`./aluno/excluir/${data.id}`, 'delete');
                await this.init();
                this.$alert('Aluno deletado com sucesso', 'Sucesso', 'success');
            });
        },
        clean (){
            this.formTitle = "Novo Aluno",
            this.editing = false;
            this.aluno = {
                nome: '',
                email: '',
                cpf: '',
            };
        },
        validateField (data){
            let isValid = true;
            let invalid = [];
            let _fn = (field) => {
                invalid.push(field);
                isValid = false;
            };
    
            if (data.nome.length > 0){
                let upperName = data.nome.toLowerCase().replace(/(?:^|\s)\S/g, function(a){
                   return a.toUpperCase();
                })
                return data.nome = upperName;
            }  else{
                _fn('Nome');
            }
            if (!data.email.length) 
                _fn('Email');
            if (!data.cpf.length)
                _fn('CPF');
            
            if (invalid.length)
                this.$alert(
                    `Os campos: (${invalid.join(', ')}) estão inválidos ou vazios. `,
                    'Error',
                    'warning'
                );
            return isValid;
        },
        validateEmail(){
            for(var i=0; i < this.studentList.length; i++){
                if(this.studentList[i].email === this.aluno.email){
                    return this.$alert('E-mail já cadastrado', 'Error', 'warning');
                } 
            }
        },
        validateCpf(data){
            if(typeof data.cpf !== "string") return this.$alert(`1- O CPF: (${data.cpf}) não é válido tente novamente!`, 'Error', 'warning');
            let cpf = data.cpf.replace(/[\s.-]*/igm, '');
            if( cpf.length !== 11 || !Array.from(cpf).filter(e => e !== cpf[0]).length
            ) {
                return this.$alert(`2- O CPF: (${data.cpf}) não é válido tente novamente!`, 'Error', 'warning');
            }
            var sum = 0;
            var rest;
            for (var i = 1; i <= 9; i++)
                sum = sum + parseInt(cpf.substring(i-1, i) * (11 - 1))
            rest = (sum * 10) % 11;
            if ((rest == 10) || (rest == 11)) rest = 0
            if (rest != parseInt(cpf.substring(9, 10)) ) return this.$alert(`3- O CPF: (${data.cpf}) não é válido tente novamente!`, 'Error', 'warning');
            sum = 0
            for (var c = 1; c <= 10; c++)
                sum = sum + parseInt(cpf.substring(10, 11))
            rest = (sum * 10) % 11;
            if ((rest == 10) || (rest == 11)) rest = 0
            if (rest != parseInt(cpf.substring(10, 11))) return this.$alert(`4-  O CPF: (${data.cpf}) não é válido tente novamente!`, 'Error', 'warning');
            return true;
        },

    }
}
</script>

<style scoped>

    h1,h2{
        margin: 10px;
        margin-left: 30px;
    }

    main {
        background-color: var(--color-background-home);
    }

    .form-group{
        margin: 5px;
    }

    .buttons{
        margin-top: 10px;
        margin-left: 5px;
        margin-bottom: 20px;
    }
    #card-consulta{
        margin-right: 50px;
        margin-left: 50px;
        align-self: left;
        width: 600px;
        position:relative;
        display:block;
        }

    .container{
        width: 400px;
    }
    .row{
        width: 100%;
    }

    @media (max-width: 700px) {
        #card-consulta{
            margin-bottom: 50px;
            margin-left: 10px;
            width: 500px;
            align-items: center;
        }
    
    }

</style>