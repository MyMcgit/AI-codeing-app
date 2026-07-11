import {SAVE_TITLE} from '../actions_types'
export const createSaveTitleAction = (value) => {
    return { type: SAVE_TITLE, data: value }
}