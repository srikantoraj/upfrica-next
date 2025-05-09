import { createSlice } from '@reduxjs/toolkit'

const countries = [
    { name: 'Ghana', code: 'GHS', symbol: '₵', region:'gh' },
    { name: 'United Kingdom', code: 'GBP', symbol: '£', region:'uk' },
    { name: 'Bangladesh', code: 'BDT', symbol: '৳', region:'bd' },
]

const initialState = {
    list: countries,
    // ← default to the first entry (Ghana)
    selected: countries[0],
}

const countrySlice = createSlice({
    name: 'country',
    initialState,
    reducers: {
        setSelectedCountry(state, action) {
            state.selected = action.payload
        },
    },
})

export const { setSelectedCountry } = countrySlice.actions
export const selectCountryList = (state) => state.country.list
export const selectSelectedCountry = (state) => state.country.selected
export default countrySlice.reducer
