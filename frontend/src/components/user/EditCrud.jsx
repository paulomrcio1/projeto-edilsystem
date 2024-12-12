import React, {Component } from "react";

import Main from "../template/Main";
import axios from 'axios'
import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
//import { format } from 'date-fns';


const headerProps ={
    icon : "users",
    title: "Editando Dados",
    subtitle: "Voce está alterando os dados"
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

      //  const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || [];
        //    this.setState(clientesSalvos);
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

            alert("Dados do cliente editado com sucesso!!!")
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
            const list = this.getUpdatedList(user, false) //this.state.filter(u => u !== user)
            this.setState({list})

            localStorage.removeItem("usuarios");

            alert("Cliente removido com sucesso!!!")
          })


          window.location.reload();   //apenas para atualizar a pagina pois deu um bug e nao estava atualizando
    }


    renderForm() {
        return (

            
            <form>
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <TextField required 
                                type="text"  size="small" className="form-control" 
                                name="name"
                                value={this.state.user.name}
                                onChange={e => {
                                    
                                    const user = {...this.state.user} //clona o usuario na constante
                                    user[e.target.name] = e.target.value
                                    this.setState({user})
                                  
                                    if(e.target.validity.valid){
                                        
                                        this.setState({nameError: false})
                                        
                                    }else{
                                        this.setState({nameError: true})
                                    }
                                    this.updateField(e)}

                                }
                                error={this.state.nameError}
                                helperText={this.state.nameError ? "Nome é obrigatório" : ""}
                                placeholder="Digite o nome..." /> 
                               
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <TextField required 
                                type="text"  size="small" className="form-control" 
                                name="email"
                                value={this.state.user.email}
                                onChange={e => {
                                    
                                    const user = {...this.state.user} //clona o usuario na constante
                                    user[e.target.name] = e.target.value
                                    this.setState({user})
                                  
                                    if(e.target.validity.valid){
                                        
                                        this.setState({nameError: false})
                                        
                                    }else{
                                        this.setState({nameError: true})
                                    }
                                    this.updateField(e)}

                                }
                                error={this.state.nameError}
                                helperText={this.state.nameError ? "Email é obrigatório" : ""}
                                placeholder="Digite o email..." /> 
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Telefone</label>

                            <TextField  
                                type="text"  size="small" className="form-control" 
                                name="telefone"
                                value={this.state.user.telefone}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o telefone..." /> 

                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Data de Nascimento</label>
                            
                            <TextField  
                                type="date"  size="small" className="form-control" 
                                name="date"
                                value={this.state.user.date}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a Data de Nascimento..." /> 

                        </div>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                    <Button className="btn btn-primary"
                            onClick={e =>{ 

                                if(this.state.user.name === ""){
                                    return alert("Campo nome obrigatorio")
                                }if(this.state.user.email === ""){
                                    return alert("Campo email obrigatorio")
                                }
                                this.save(e)       
                            }
                            
                        }>
                            Salvar
                        </Button>
                          
                        <Button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar/Limpar
                        </Button>

                    </div> 

                </div>

                
            </div>
         
            </form>

        )

    
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
        return this.state.list.map(user =>{
            return(
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.telefone}</td>
                    <td>{user.date}</td> 
                    
                    <td>
                    <Button className="btn btn-warming" 
                        onClick={() => this.load(user)}>
                            <EditIcon style={{ color: "black" }}/>
                        </Button>
                        
                    </td>
                </tr>
            )
        })
    }

    

    
    render(){
        
        return(
            <Main {...headerProps}>
               {this.renderForm()}  
               {this.renderTable()}  
            </Main>
        )
    }

   
}