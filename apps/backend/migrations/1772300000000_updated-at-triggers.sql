create or replace function set_updated_at()
returns trigger as $$
begin
  new."updatedAt" = current_timestamp;
  return new;
end;
$$ language plpgsql;

create trigger set_stores_updated_at
before update on "stores"
for each row
execute function set_updated_at();

create trigger set_ingredient_tags_updated_at
before update on "ingredient_tags"
for each row
execute function set_updated_at();

create trigger set_ingredients_updated_at
before update on "ingredients"
for each row
execute function set_updated_at();

create trigger set_recipes_updated_at
before update on "recipes"
for each row
execute function set_updated_at();

create trigger set_nutritional_targets_updated_at
before update on "nutritional_targets"
for each row
execute function set_updated_at();

create trigger set_meal_plans_updated_at
before update on "meal_plans"
for each row
execute function set_updated_at();

create trigger set_food_log_entries_updated_at
before update on "food_log_entries"
for each row
execute function set_updated_at();
