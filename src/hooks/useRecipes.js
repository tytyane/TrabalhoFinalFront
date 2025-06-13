import { useState, useEffect } from 'react';

const useRecipes = () => {
    const [recipes, setRecipes] = useState(() => {
        const savedRecipes = localStorage.getItem('recipes');
        return savedRecipes ? JSON.parse(savedRecipes) : [];
    });

    useEffect(() => {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }, [recipes]);

    const addRecipe = (recipe) => {
        setRecipes((prevRecipes) => [...prevRecipes, recipe]);
    };

    return { recipes, addRecipe };
};

export default useRecipes;
