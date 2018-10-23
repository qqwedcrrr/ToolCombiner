export default {
    namespace:'nespresso',
    state:{
        bgcolor:'#e6a23c',
        alias:[
            {
                name:'null',
                id:0,
                num:1
            }
        ]
    },
    reducers:{
        'reduceNum'(state,{payload:id}){
            return state.alias.filter(data =>data.id !== id)
        },
        'addNum'(state,{payload:id}){
            return state.alias.find(data =>{data.id ===id}).num+1
        },
        'addAlias'(state,{payload:alias}){
            return state.alias.push(alias)
        }
    }
}