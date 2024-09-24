import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchCategories, fetchPostsCategory } from '../../redux/actions'
import SortBy from '../sort-by/sortBy'
import { Button } from "@/components/ui/button"

const Menu= () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const receiveCategories = useSelector((state) => state.receiveCategories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleCategoryClick = (category) => {
    dispatch(fetchPostsCategory(category))
    navigate(`/${category}`)
  }

  return (
    <div className="categories">
      <div className="hidden md:grid grid-cols-6 gap-2">
        <div>
          <Button
            
            size="sm"
            className="w-full"
            onClick={() => navigate('/')}
          >
            All
          </Button>
        </div>
        {receiveCategories.length > 0 &&
          receiveCategories.map((category) => (
            <div key={category.path}>
              <Button
               
                size="sm"
                className="w-full"
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </Button>
            </div>
          ))}
        <div>
          <SortBy />
        </div>
      </div>
      <div className="md:hidden">
        <SortBy />
      </div>
    </div>
  )
}

export default Menu