import {SAVE_CATEGORY_LIST} from '../actions_types'
export const createSaveCategoryAction = (value) => {
    return { type: SAVE_CATEGORY_LIST, data: value }
}