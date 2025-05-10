'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCountryList, setSelectedCountry } from '@/app/store/slices/countrySlice'

export default function RegionSetter({ region }) {
    const dispatch = useDispatch()
    const countryList = useSelector(selectCountryList)

    useEffect(() => {
        const match = countryList.find(
            c =>
                c.region.toLowerCase() === region.toLowerCase() 
        )
        dispatch(setSelectedCountry(match || countryList[0]))
    }, [region, countryList, dispatch])

    return null
}
