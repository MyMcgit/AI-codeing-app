import { SAVE_TITLE } from '../actions_types'

let initState = ''

export default function test(preState = initState, action) {
    const { type, data } = action
    switch (type) {
        case SAVE_TITLE:
            return data
        default:
            return preState
    }
}