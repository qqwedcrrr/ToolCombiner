export default {
    namespace: 'nespresso',
    state: {
        bgcolor: '#e6a23c',
        alias: [
            {
                name: 'null',
                id: 0,
                num: 1
            }
        ]
    },
    reducers: {
        reduceNum(state, { payload: id }) {
            let alias = state.alias.find(data => data.id === id);
            let index = state.alias.indexOf(alias)
            if (alias.num === 0)
                return state
            else {
                alias.num -= 1
                return {
                    ...state,
                    alias: state.alias.splice(index, 1, alias)
                }
            }
        },
        addNum(state, { payload: id }) {
            let alias = state.alias.find(data => data.id === id);
            let index = state.alias.indexOf(alias)
            alias.num += 1
            return {
                ...state,
                alias: state.alias.splice(index, 1, alias)
            }
        },
        addAlias(state, { payload: alias }) {
            return {
                ...state,
                alias: state.alias.push(alias)
            }
        },
        changeColor(state, { payload: color }) {
            return {
                ...state,
                bgcolor: color
            }
        }
    }
}