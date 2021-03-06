import React, { Component } from "react";
import { Table, Input, Typography, Popconfirm, message, Button } from 'antd';
export default class CommondityManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
          data:[],
          currentRecord:'',
          editingKeys:'',
          clickAble:true,
          page:1,
          pageSize:10,
        }
    }

    isEditing = (record) => record.id === this.state.editingKeys

    handleEdit = (record) => {
      this.setState ({
        currentRecord:record,
        editingKeys:record.id
      })
    }
    handleAdd =()=>{
      let newData = {
        id:'',
        commodityType:'',
        commodityName:''
      }
      const data = this.state.data
      if (this.state.clickAble===false) {
        return false
      }
      this.setState({
        clickAble:false,
        page:1,
        data: data ? [newData,...data]:[newData]

      })
    }

    handleSave = (id) => {
      if(!id || id===''){
        // const index = this.state.data?.findIndex((item) => {
        //   return item?.id === this.state.editingKeys
        // })
        const index = this.state.data?.findIndex(item => 
          item?.id === this.state.editingKeys
          )
          const data = this.state.data[index]
          fetch("url",{
            method:"POST",
            header:new Headers ({
              "Content-Type": "application/json;charset=UTF-8",
            }),
            body:JSON.stringify({
              id:data.id,
              commodityType:data.commodityType,
              commodityName:data.commodityName
            })
          }).then(result => result.json(
          )).then(result =>{
            if(result.code===200){
              message.success("添加成功")
              this.setState ({
                editingKeys:''
              })
              this.fetchData()
            } else{
              message.error("添加错误"+result.msg)
            }
          }).catch(function(error){
            message.error("添加失败"+error)
          })
      } else{
        const index = this.state.data?.indexOf(item =>{
          return item?.id === this.state.editingKeys
        })
        const data = this.state.data[index]
        fetch('url',{
          method:"PUT",
        })
      }
    }

    fetchData=()=>{
      fetch("url")
      .then(responser =>responser.json())
      .then(res =>{
        this.setState({
          data:res.data
        })
      })
    }

    // componentDidMount(){
    //   this.fetchData()
    // }

    render() {

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
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '商品类别',
      dataIndex: 'commodityType',
      key: 'commodityType',
      render: (_,record) =>{
        const editable = this.isEditing(record)
        return editable ? (
          <Input 
          style={{margin:-5}}
          value={record.commodityType}
          onChange={(e)=>this.handleChange("commodityType",e)}
          ></Input>
        ):(
          <span>{record.commodityType}</span>
        )
      }
    },
    {
      title: '商品名称',
      dataIndex: 'commodityName',
      key: 'commodityName',
      render:(_,record) =>{
        const editable = this.isEditing(record)
        return editable ? (
          <Input
          value={record.commodityName}
          style={{margin:-5}}
          onChange={(e)=>this.handleChange("commodityName",e)}
          >
          </Input>
        ):(
          <span>{record.commodityName}</span>
        )
      }
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => { 
        const editable = this.isEditing(record)
        return  (
        <div>
          {
            editable ? (
              <span>
              <a
              href="javascript:;"
              onClick={()=>this.handleSave(record.id)}
              style={{marginRight:10}}
              >
                保存
              </a>
              <a
              href="javascript:;"
              onClick={()=>this.handleCancel}
              style={{marginRight:10}}
              >
                取消
              </a>
              </span>
            ):(
              <Typography.Link
              disabled={this.state.editingKeys!==''}
              onClick={()=>this.handleEdit(record)}
              style={{marginRight:10}}
              >
                编辑</Typography.Link>
            )
          }
          <Popconfirm
          title="确认删除?"
          okText="确认"
          cancelText="取消"
          onConfirm={()=>this.handleDelete(record.id)}
          >
            <span
            style={{color:"red"}}>
            删除
            </span>
            </Popconfirm>
        </div>
        )
      }
    }
    ];
    return (
      <div>
      <Button
      onClick={()=>this.handleAdd}
      >
        添加
        </Button>
        <Table
         columns={columns}
         dataSource={this.state.data}
         pagination={pagination}
         >
         </Table>
         </div>
    )
}
}