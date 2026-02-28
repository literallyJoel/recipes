-- ============================================================
-- STORES
-- ============================================================

create table "stores" (
  "id"        text not null primary key,
  "name"      text not null unique,
  "logoUrl"   text,
  "createdAt" timestamptz default current_timestamp not null,
  "updatedAt" timestamptz default current_timestamp not null
);

-- ============================================================
-- INGREDIENT TAGS
-- ============================================================

create table "ingredient_tags" (
  "id"        text not null primary key,
  "name"      text not null unique,
  "createdAt" timestamptz default current_timestamp not null,
  "updatedAt" timestamptz default current_timestamp not null
);

-- ============================================================
-- INGREDIENTS
-- ============================================================

create table "ingredients" (
  "id"                       text not null primary key,
  "storeId"                  text references "stores" ("id") on delete set null,
  "ingredientTagId"          text references "ingredient_tags" ("id") on delete set null,
  "name"                     text not null,
  "brand"                    text not null,
  "priceAmount"              integer,
  "priceCurrency"            char(3) not null default 'GBP',
  "packageSize"              numeric(10, 2),
  "packageUnit"              text,
  "url"                      text,

  "baseUnit"                 text not null default 'gram',
  "customUnitDefinition"     text,
  "energy"                   numeric(10, 5),
  "fat"                      numeric(10, 5),
  "saturates"                numeric(10, 5),
  "carbohydrates"            numeric(10, 5),
  "sugars"                   numeric(10, 5),
  "fibre"                    numeric(10, 5),
  "protein"                  numeric(10, 5),
  "salt"                     numeric(10, 5),

  "createdAt"                timestamptz default current_timestamp not null,
  "updatedAt"                timestamptz default current_timestamp not null,

  unique ("name", "brand")
);

-- ============================================================
-- RECIPES
-- ============================================================

create table "recipes" (
  "id"           text not null primary key,
  "userId"       text not null references "user" ("id") on delete cascade,
  "title"        text not null,
  "description"  text,
  "instructions" text,
  "servings"     integer not null default 1,
  "prepMins"     integer,
  "cookMins"     integer,
  "isPublic"     boolean not null default false,
  "deletedAt"    timestamptz,
  "createdAt"    timestamptz default current_timestamp not null,
  "updatedAt"    timestamptz default current_timestamp not null
);

create table "recipe_ingredients" (
  "id"           text not null primary key,
  "recipeId"     text not null references "recipes" ("id") on delete cascade,
  "ingredientId" text not null references "ingredients" ("id") on delete restrict,
  "quantity"     numeric(10, 3) not null,
  "quantityUnit" text not null default 'gram',
  "notes"        text,
  "order"        integer not null default 0,

  unique ("recipeId", "ingredientId")
);

create table "shared_recipes" (
  "id"           text not null primary key,
  "recipeId"     text not null references "recipes" ("id") on delete cascade,
  "sharedById"   text not null references "user" ("id") on delete cascade,
  "sharedWithId" text not null references "user" ("id") on delete cascade,
  "canEdit"      boolean not null default false,
  "createdAt"    timestamptz default current_timestamp not null,

  unique ("recipeId", "sharedWithId")
);

-- ============================================================
-- NUTRITIONAL TARGETS
-- ============================================================

create table "nutritional_targets" (
  "id"        text not null primary key,
  "userId"    text not null references "user" ("id") on delete cascade,
  "label"     text not null,
  "calories"  numeric(8, 2),
  "protein"  numeric(8, 2),
  "carbs"    numeric(8, 2),
  "fat"      numeric(8, 2),
  "fibre"    numeric(8, 2),
  "isDefault" boolean not null default false,
  "createdAt" timestamptz default current_timestamp not null,
  "updatedAt" timestamptz default current_timestamp not null,

  unique ("userId", "label")
);

-- ============================================================
-- MEAL PLANS
-- ============================================================

create table "meal_plans" (
  "id"                  text not null primary key,
  "userId"              text not null references "user" ("id") on delete cascade,
  "nutritionalTargetId" text references "nutritional_targets" ("id") on delete set null,
  "storeId"             text references "stores" ("id") on delete set null,
  "label"               text,
  "startDate"           date not null,
  "endDate"             date not null,
  "config"              jsonb not null default '{}',
  "createdAt"           timestamptz default current_timestamp not null,
  "updatedAt"           timestamptz default current_timestamp not null
);

create table "meal_plan_entries" (
  "id"              text not null primary key,
  "mealPlanId"      text not null references "meal_plans" ("id") on delete cascade,
  "recipeId"        text not null references "recipes" ("id") on delete restrict,
  "date"            date not null,
  "mealType"        text not null,
  "servings"        integer not null default 1,
  "order"           integer not null default 0,
  -- Snapshot of the recipe's nutritional info at the time of entry creation.
  -- Insulates historical entries from future ingredient/recipe changes.
  -- e.g. { "perServing": { "energy": 550, "protein": 42, ... } }
  "nutritionSnapshot" jsonb,

  unique ("mealPlanId", "date", "mealType", "order")
);

create table "food_log_entries" (
  "id"           text not null primary key,
  "userId"       text not null references "user" ("id") on delete cascade,
  "date"         date not null,
  "mealType"     text not null default 'snack',
  "loggedAt"     timestamptz not null default current_timestamp,

  "recipeId"     text references "recipes" ("id") on delete set null,
  "ingredientId" text references "ingredients" ("id") on delete set null,

  "servings"     integer,

  "quantity"     numeric(10, 3),
  "quantityUnit" text,

  "label"        text,

  "nutritionSnapshot" jsonb,

  "createdAt"    timestamptz default current_timestamp not null,
  "updatedAt"    timestamptz default current_timestamp not null
);