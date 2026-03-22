import type { Recipe } from "@jvrecipes/validation";

export const recipesMock: Recipe[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    createdAt: new Date("2026-03-18T09:30:00Z"),
    updatedAt: new Date("2026-03-18T09:30:00Z"),
    title: "Creamy Garlic Pasta",
    description: "Quick, comforting pasta with a silky garlic-parmesan sauce.",
    instructions:
      "Boil pasta, make the sauce with garlic, cream, and parmesan, then toss together.",
    servings: 2,
    prepMins: 10,
    cookMins: 15,
    isPublic: false,
    user: {
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      name: "Maya Patel",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    createdAt: new Date("2026-03-17T18:45:00Z"),
    updatedAt: new Date("2026-03-17T18:45:00Z"),
    title: "Spicy Chicken Rice Bowl",
    description:
      "A balanced bowl with tender chicken, rice, and a spicy sauce.",
    instructions:
      "Cook the rice, pan-fry seasoned chicken, and serve with vegetables and sauce.",
    servings: 3,
    prepMins: 15,
    cookMins: 20,
    isPublic: false,
    user: {
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      name: "Jordan Kim",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    createdAt: new Date("2026-03-16T12:10:00Z"),
    updatedAt: new Date("2026-03-16T12:10:00Z"),
    title: "Lemon Herb Salmon",
    description: "Fresh salmon baked with lemon, garlic, and soft herbs.",
    instructions:
      "Season the salmon, bake until flaky, and finish with lemon juice and herbs.",
    servings: 2,
    prepMins: 10,
    cookMins: 18,
    isPublic: false,
    user: {
      id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      name: "Sophie Turner",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    createdAt: new Date("2026-03-15T08:20:00Z"),
    updatedAt: new Date("2026-03-15T08:20:00Z"),
    title: "Veggie Fried Rice",
    description: "Fast and flexible fried rice packed with vegetables.",
    instructions:
      "Stir-fry vegetables, add cold rice and soy sauce, then toss until hot.",
    servings: 4,
    prepMins: 12,
    cookMins: 10,
    isPublic: false,
    user: {
      id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      name: "Alex Rivera",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    createdAt: new Date("2026-03-14T19:05:00Z"),
    updatedAt: new Date("2026-03-14T19:05:00Z"),
    title: "Tomato Basil Soup",
    description: "A smooth, cozy tomato soup finished with basil.",
    instructions:
      "Simmer tomatoes with onion and garlic, blend smooth, and stir in basil.",
    servings: 4,
    prepMins: 10,
    cookMins: 25,
    isPublic: false,
    user: {
      id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      name: "Hannah Lee",
      image:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    createdAt: new Date("2026-03-13T13:40:00Z"),
    updatedAt: new Date("2026-03-13T13:40:00Z"),
    title: "Beef Tacos",
    description:
      "Simple weeknight tacos with seasoned beef and fresh toppings.",
    instructions:
      "Brown the beef with spices, warm tortillas, and assemble with toppings.",
    servings: 4,
    prepMins: 15,
    cookMins: 15,
    isPublic: false,
    user: {
      id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      name: "Noah Wilson",
      image:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80",
    },
  },
];
