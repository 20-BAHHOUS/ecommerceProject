import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '../../../services/categoryService';

const MultiLevelNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Starting to fetch categories...');
        
        const response = await getCategories();
        console.log('Categories response:', response);

        if (!response) {
          throw new Error('No response received from server');
        }

        if (!response.success) {
          throw new Error(response.error || 'Failed to load categories');
        }

        if (!Array.isArray(response.data)) {
          throw new Error('Invalid categories data received');
        }

        setCategories(response.data);
      } catch (err) {
        console.error('Error in fetchCategories:', err);
        setError(err.message || 'Failed to load categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    if (!categorySlug) {
      console.error('No category slug provided');
      return;
    }
    navigate(`/category/${categorySlug}`);
  };

  const handleSubcategoryClick = (categorySlug, subcategorySlug) => {
    if (!categorySlug || !subcategorySlug) {
      console.error('Missing category or subcategory slug');
      return;
    }
    navigate(`/category/${categorySlug}/${subcategorySlug}`);
  };

  if (loading) {
    return (
      <div className="h-16 bg-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-16 bg-gray-800 text-white flex items-center justify-center">
        <span className="text-red-400">⚠️</span>
        <span className="ml-2">{error}</span>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="h-16 bg-gray-800 text-white flex items-center justify-center">
        No categories available
      </div>
    );
  }

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-teal-300 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            {categories.map((category) => (
              <div key={category._id || category.id} className="relative group">
                <button
                  onClick={() => handleCategoryClick(category.slug)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {category.name}
                </button>
                
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="absolute z-10 hidden group-hover:block w-48 bg-white rounded-md shadow-lg py-1">
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory._id || subcategory.id}
                        onClick={() => handleSubcategoryClick(category.slug, subcategory.slug)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MultiLevelNavbar;
