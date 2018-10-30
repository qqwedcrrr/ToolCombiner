export default {
    namespace: 'nespresso',
    state: {
        bgcolor: '#e6a23c',
        cover: true,
        alias: [
            {
                aliasName: 'null',
                id: 0,
                num: 1,
                link:'null'
            }
        ]
    },
    reducers: {
        reduceNum(state, { payload: id }) {
            let alias = state.alias.find(data => data.id === id);
            let index = state.alias.indexOf(alias)
            let newAlias = state.alias.slice()
            newAlias.splice(index, 1, alias)
            if (alias.num === 0)
                return state
            else {
                alias.num -= 1
                return {
                    ...state,
                    alias:newAlias
                }
            }
        },
        addNum(state, { payload: id }) {
            let alias = state.alias.find(data => data.id === id);
            let index = state.alias.indexOf(alias)
            alias.num += 1
            let newAlias = state.alias.slice()
            return {
                ...state,
                alias:newAlias
            }
        },
        setAlias(state, { payload: alias }) {
            return {
                ...state,
                alias: alias
            }
        },
        changeColor(state, { payload: color }) {
            return {
                ...state,
                bgcolor: color
            }
        },
        maskRemove(state){
            return{
                ...state,
                cover: !state.cover
            }
        }
    }
}