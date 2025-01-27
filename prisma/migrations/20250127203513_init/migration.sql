-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT[],

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientQuantity" (
    "id" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "value" REAL NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "Quantity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" INTEGER NOT NULL,
    "mealNumber" INTEGER NOT NULL,
    "picture" TEXT,

    CONSTRAINT "Recipee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" INTEGER NOT NULL,
    "îndex" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "RecipeStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IngredientQuantity" ADD CONSTRAINT "IngredientQuantity_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "IngredientQuantity" ADD CONSTRAINT "IngredientQuantity_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "IngredientQuantity" ADD CONSTRAINT "IngredientQuantity_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
