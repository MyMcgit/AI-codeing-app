import { SAVE_CATEGORY_LIST } from '../actions_types'

let initState = []

export default function test(preState = initState, action) {
    const { type, data } = action
    switch (type) {
        case SAVE_CATEGORY_LIST:
            return JSON.parse(JSON.stringify(data))
        default:
            return preState
    }
}