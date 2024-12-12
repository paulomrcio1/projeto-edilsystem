import React, {Component} from "react";

import Main from "../template/Main";
import axios from 'axios'
import { Button, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format, parse  } from "date-fns";


const headerProps ={
    icon : "users",
    title: "Relatório de Clientes",
    subtitle: ""
}


//criando estado inicial

const baseUrl = 'http://localhost:3001/users'  //caminho back
const initialState = {
    user: {name: '', email:'', telefone: '', date:''},
    list:[]
}



export default class UserCrud extends Component{


    state = {...initialState} 

    

    componentWillMount(){
        axios(baseUrl).then(resp => {
            this.setState({list: resp.data})
        })
            // Carregar clientes do localStorage
            const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
            this.setState(clientesSalvos);
          
    }


    //para limpar formulario do usuario
    clear(){ 
        this.setState({user: initialState.user})
    };

    //adiciona e altera
    save(){
        const user = this.state.user
        const method = user.id ? 'put' : 'post'  //se usuario possuir ID, vai alterar se não vai inserir, put altera, post insere
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl 
        axios[method](url,user).then(resp =>{
            const list = this.getUpdatedList(resp.data)
            this.setState({user: initialState.user, list})
            
            localStorage.setItem("clientes",JSON.stringify(list)); //sempre vai passar como chave o id do cliente
        })

    }


    getUpdatedList(user, add = true){
        const list = this.state.list.filter(u => u.id !== user.id)
       //if(user) list.unshift(user) //adicionando o usuario na primeira posicao da lista usando unshift
       if(user) list.push(user) // adicionando o usuario na ultima posicao da lista usando push
       return list
    }

    updateField(event){
        const user = {...this.state.user} //clona o usuario na constante
        user[event.target.name] = event.target.value
        this.setState({user})

    }

    
    load(user){
        
        this.setState({user})
    }


    remove(user){
        axios.delete(`${baseUrl}/${user.id}`)
            .then(resp =>{
            const novosClientes = this.getUpdatedList(user, false) //this.state.filter(u => u !== user)
            this.setState({novosClientes})
            localStorage.setItem("clientes",JSON.stringify(novosClientes));
          }) //para remover no back

          //para remover no localstorage
               const novosClientes = this.state.list.filter(cliente => cliente.id !== user.id);
               this.setState({novosClientes});
               localStorage.setItem('clientes', JSON.stringify(novosClientes));
            
          window.location.reload();   //apenas para atualizar a pagina pois deu um bug e nao estava atualizando
          alert("Cliente removido com sucesso!!!")
    }

    renderTable(){
        return(
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Codigo</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Data de Nascimento</th>
                        <th>Açoes</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }



    renderRows(){
        //return this.state.list.map(user =>{
        //return clientesStorage.map(user =>{
        //PEGO INFORMACAO DO SETSTORAGE 
       // const clientesStorage = JSON.parse(localStorage.getItem('clientes')) || [];


        return this.state.list.map(user =>{

          

            return(
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.telefone}</td>
                    <td>{user.date}</td>
                    
                    <td>
                    <a href='/edit'>
                        <Button className="btn btn-warming" 
                        onClick={() => this.load(user)}>
                            <EditIcon style={{ color: "black" }}/>
                        </Button>
                    </a>

                        <IconButton 
                        onClick={() => this.remove(user)}>
                            <DeleteIcon style={{ color: "red" }}/>
                        </IconButton>

                    </td>
                </tr>

                
            )
        })
    }

    
    render(){
        
        return(
            <Main {...headerProps}>
                
               {this.renderTable()} 
            </Main>
        )
    }
}