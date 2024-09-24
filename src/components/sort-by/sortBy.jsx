import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeSortAction } from '../../redux/actions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { valueOptions } from '../../utils/options'

const SortBy=()=> {
  const dispatch = useDispatch()
  const value = useSelector((state) => state.sort.value)

  const handleChange = (newValue) => {
    dispatch(changeSortAction({ value: newValue }))
  }

  return (
    <div className="w-[100px]">
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          {valueOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SortBy