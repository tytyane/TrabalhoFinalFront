import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

/* Global Styles: Reset, Box Model, Font, etc */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box; /* Box Model */
  }
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: #f5f7fa;
    color: #222;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

/* Design Tokens */
const colors = {
  primary: '#4F8EF7',
  primaryDark: '#3a6dd0',
  secondary: '#6c757d',
  background: '#f5f7fa',
  cardBackground: '#ffffff',
  textPrimary: '#222222',
  textSecondary: '#555555',
  success: '#28a745',
  error: '#dc3545',
};

const spacing = {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px',
};

/* Layout Containers */
const AppContainer = styled.main`
  max-width: 900px;
  width: 90%;
  margin: ${spacing.xl} auto ${spacing.xl} auto;
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  @media (max-width: 640px) {
    width: 95%;
    margin: ${spacing.md} auto;
  }
`;

const Header = styled.header`
  text-align: center;
  padding-bottom: ${spacing.sm};
  border-bottom: 2px solid ${colors.primary};
`;

const Title = styled.h1`
  margin: 0;
  font-weight: 700;
  font-size: 2.5rem;
  color: ${colors.primaryDark};

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;


/* Form with Flexbox */
const RecipeFormContainer = styled.form`
  background: ${colors.cardBackground};
  padding: ${spacing.lg};
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

/* Inputs and textarea styled with box model */
const Input = styled.input`
  padding: ${spacing.sm};
  font-size: 1rem;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 5px ${colors.primary};
  }
`;

const Textarea = styled.textarea`
  padding: ${spacing.sm};
  font-size: 1rem;
  min-height: 100px;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 5px ${colors.primary};
  }
`;

const Button = styled.button`
  align-self: flex-start;
  padding: ${spacing.sm} ${spacing.lg};
  font-weight: 600;
  font-size: 1rem;
  color: white;
  background-color: ${colors.primary};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${colors.primaryDark};
  }
  &:disabled {
    background-color: ${colors.secondary};
    cursor: not-allowed;
  }
`;


/* List with CSS Grid */
const RecipeListContainer = styled.section`
  background: ${colors.cardBackground};
  padding: ${spacing.lg};
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing.lg};
`;

/* Individual Recipe Item with Box Model and Flexbox */
const RecipeItemCard = styled.article`
  background: #fff;
  border-radius: 10px;
  padding: ${spacing.md};
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  }
`;

const RecipeTitle = styled.h3`
  margin: 0;
  font-weight: 600;
  color: ${colors.primaryDark};
  font-size: 1.25rem;
  word-wrap: break-word;
`;

const RecipeIngredients = styled.p`
  color: ${colors.textSecondary};
  margin: 0;
  white-space: pre-wrap; /* Preserve line breaks */
  flex-grow: 1;
`;


/* Hook para gerenciar receitas com localStorage */
function useRecipes() {
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe) => {
    setRecipes(prev => [...prev, recipe]);
  };

  return { recipes, addRecipe };
}

/* Formulário de receita */
function RecipeForm({ onAddRecipe }) {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [errors, setErrors] = useState({title: false, ingredients: false});

  // Validação simples
  const validate = () => {
    const newErrors = {
      title: title.trim() === '',
      ingredients: ingredients.trim() === '',
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.ingredients;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onAddRecipe({ title: title.trim(), ingredients: ingredients.trim() });
    setTitle('');
    setIngredients('');
    setErrors({title: false, ingredients: false});
  };

  return (
    <RecipeFormContainer onSubmit={handleSubmit} noValidate>
      <Input
        type="text"
        value={title}
        placeholder="Título da Receita"
        onChange={(e) => setTitle(e.target.value)}
        aria-invalid={errors.title}
        aria-describedby="title-error"
      />
      {errors.title && <span id="title-error" style={{color: colors.error, fontSize: '0.85rem'}}>Por favor, insira o título da receita.</span>}

      <Textarea
        value={ingredients}
        placeholder="Ingredientes (separe por vírgula ou quebre linha)"
        onChange={(e) => setIngredients(e.target.value)}
        aria-invalid={errors.ingredients}
        aria-describedby="ingredients-error"
      />
      {errors.ingredients && <span id="ingredients-error" style={{color: colors.error, fontSize: '0.85rem'}}>Por favor, insira os ingredientes.</span>}

      <Button type="submit">Adicionar Receita</Button>
    </RecipeFormContainer>
  );
}

/* Lista de receitas */
function RecipeList({ recipes }) {
  if (recipes.length === 0) {
    return <p style={{textAlign: 'center', color: colors.secondary, fontSize: '1rem'}}>Nenhuma receita cadastrada ainda.</p>;
  }
  return (
    <RecipeListContainer aria-live="polite">
      {recipes.map((recipe, index) => (
        <RecipeItem key={index} recipe={recipe} />
      ))}
    </RecipeListContainer>
  );
}

/* Item individual da receita */
function RecipeItem({ recipe }) {
  return (
    <RecipeItemCard>
      <RecipeTitle>{recipe.title}</RecipeTitle>
      <RecipeIngredients>{recipe.ingredients}</RecipeIngredients>
    </RecipeItemCard>
  );
}

/* Componente principal */
export default function App() {
  const { recipes, addRecipe } = useRecipes();

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>Cadastro e Consulta de Receitas Culinárias</Title>
        </Header>
        <RecipeForm onAddRecipe={addRecipe} />
        <RecipeList recipes={recipes} />
      </AppContainer>
    </>
  );
}

