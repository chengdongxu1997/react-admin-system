import { Component } from "react";
import {Table, Input, Typogrphy, Popconfirm, Button, message} from 'antd'

export default class Permission extends Component{
    constructor(props){
        super(props)
        this.state = {
            data:[],
            editingKeys:'',
            currentRecord:'',
            clickAble:true,
            page:1,
            pageSize:10,
        }
    }

    isEditing = (record)=>record.id===this.state.editingKeys

    handleEdit=(record)=>{
        this.setState ({
            currentRecord:record,
            editingKeys:record.id
        })
    }

    handleAdd=()=>{
        let newData = {
            id:'',
            username:'',
            role:'',
            permission:'',
            comment:''
        }
        const data = this.state.data
        if (this.state.clickAble===fales) {
            return false
        }
        this.setState ({
            clickAble:false,
            page:1,
            data: data ? [newData, ...data] :[newData]
        })
    }

    handleChange=(key,e)=>{
        const index = this.state.data?.findIndex(item =>
            item.id===this.state.editingKeys
            )
            let newData =[...this.state.data]
            newData.splic(index, 1, {
                ...this.state.data[index],
                [key]:e.target.value
            })
            this.setState ({
                data:newData
            })
    }

    handleSave=(id)=>{
        if (!id||id==='') {
            const index = this.state.data?.findIndex(item =>
                item.id ===this.state.editingKeys
                )
                const data = this.state.data[index]
                fetch("url",{
                    method:"POST",
                    header:new Headers({
                        "Content-Type": "application/json;charset=UTF-8",
                    }),
                    body:JSON.stringify({
                        id:data.id,
                        username:data.username,
                        role:data.role,
                        permission:data.permission,
                        comment:data.comment
                    })
                }).then(response =>response.json(
                )).then(result =>{
                    if (result.code===200) {
                        message.success("????????????")
                        this.setState({
                            editingKeys:''
                        })
                        this.fetchData()
                    } else{
                        message.error("????????????"+result.msg)
                    }
                }).catch(function(error){
                    message.error("????????????"+error)
                })
        } else{
            index = this.state.data?.findIndex(item =>
                item.id===this.state.editingKeys
                )
                const data = this.state.data[index]
                fetch("url",{
                    method:"PUT",
                    body:JSON.stringify({
                        id:data.id,
                        username:data.username,
                        role:data.role,
                        permission:data.permission,
                        comment:data.comment 
                    })
                }).then(response =>response.json(
                )).then(result=>{
                    if (result.code===200) {
                        message.success("????????????")
                        this.setState({
                            editingKeys:''
                        })
                        this.fetchData()
                    } else{
                        message.error("????????????"+result.msg)
                    }
                }).catch(function(error){
                    message.error("????????????"+error)
                })
        }
    }

    handleCancel=()=>{
        this.setState ({
            editingKeys:''
        })
        this.fetchData()
    }

    handleDelete=(id)=>{
        if (!id||id==='') {
            const index = this.state.data?.findIndex(item =>{
                return item?.id === this.state.editingKeys
            })
            const data = this.state.data[index]
            fetch("url",{
                method:'DELETE',
                body:JSON.stringify({
                    id:data.id
                })
            }).then(response=>response.json(
            )).then(result=>{
                if (result.code===200) {
                    message.success("????????????")
                    this.setState ({
                        editingKeys:''
                    })
                    this.fetchData()
                } else{
                    message.error("????????????"+result.msg)
                }
            }).catch(function(error){
                message.error("????????????"+error)
            })
        }
    }

    fetchData=()=>{
        fetch("url")
        .then(response =>response.json())
        .then(res =>{
            this.setState({
                clickAble:true,
                data:res.data
            })
        })
    }

    // componentDidMount(){
    //     this.fetchData()
    // }

    render(){

        const filterList = []
        this.state.data?.cpsList.forEach(item =>{
            filterList.push({
                text:item.name,
                value:item.name
            })
        })

        const pagination ={
            showSizeChanger:true,
            current:this.state.page,
            pageSize:this.state.pageSize,
            onChange:(page,pageSize)=>{
                this.setState({
                    page:page,
                    pageSize:pageSize
                })
            }
        }

        const columns = [
            {
                title:"??????",
                dataIndex:"index",
                key:"index",
            },
            {
                title:"?????????",
                dataIndex:"username",
                key:"username",
                filters:filterList,
                onFilter:(value,record)=>record.username.indexOf(value)===0,
                render:(_,record)=>{
                    const editable = this.isEditing(record)
                    return editable ? (
                        <Input
                        style={{margin:-5}}
                        value={record.username}
                        onChange={(e)=>this.handleChange("username",e)}
                        >

                        </Input>
                    ):(
                        <span>{record.username}</span>
                    )
                }
            },
            {
                title:"??????",
                dataIndex:"role",
                key:'role',
                render:(_,record)=>{
                    const editable = this.isEditing(record)
                    return editable ? (
                        <Input
                        style={{margin:-5}}
                        value={record.role}
                        onChange={(e)=>this.handleChange("role",e)}>
                        </Input>
                    ):(
                        <span>{record.role}</span>
                    )
                }
            },
            {
                title:"?????????",
                dataIndex:"permission",
                key:"permission",
                render:(_,record)=>{
                    const editable = this.isEditing(record)
                    return editable ? (
                        <Input
                        style={{margin:-5}}
                        value={record.permission}
                        onChange={(e)=>this.handleChange("permission",e)}
                        >

                        </Input>
                    ):(
                        <span>{record.permission}</span>
                    )
                }
            },
            {
                title:"????????????",
                dataIndex:"comment",
                key:"comment",
                render:(_,record)=>{
                    const editable = this.isEditing(record)
                    return editable ? (
                        <Input
                        style={{margin:-5}}
                        value={record.comment}
                        onChange={(e)=>this.handleChange("comment",e)}
                        >

                        </Input>
                    ):(
                        <span>{record.comment}</span>
                    )
                }
            },
            {
                title:"??????",
                key:"operation",
                render:(_,record)=>{
                    const editable = this.isEditing(record)
                    return (
                        <div>
                            {
                                editable ? (
                                    <span>
                                    <a
                                    href="javascript:;"
                                    style={{marginRight:10}}
                                    onClick={this.handleSave(record.id)}
                                    >
                                        ??????
                                    </a>
                                    <a
                                    href="javascript:;"
                                    style={{marginRight:10}}
                                    onClick={this.handleCancel}
                                    >
                                        ??????
                                    </a>
                                </span>
                                ):(
                                    <Typogrphy.link
                                    disabled ={this.state.editingKeys!==''}
                                    style={{marginRight:10}}
                                    onClick={this.handleEdit(record)}
                                    >
                                        ??????
                                    </Typogrphy.link>
                                )
                            }
                            <Popconfirm
                            title="????????????????"
                            okText="??????"
                            cancelText="??????"
                            onConfirm={this.handleDelete(record.id)}>
                                ??????
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ]
        return(
            <div>
                <Button
                onClick={this.handleAdd}>
                    ??????
                </Button>
                <Table
                columns={columns}
                data={this.state.data}
                pagination={pagination}
                ></Table>
            </div>
        )
    }
}