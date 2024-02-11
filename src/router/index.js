// Boilerplate from https://github.com/richardevcom
import { createRouter, createWebHistory } from "vue-router";
import Mesures from "../views/Mesures.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 }; // Pour bien se repositionner en haut de la page
    }
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: Mesures,
    },
    {
      path: "/historique",
      name: "Historique",
      // When building apps with a bundler, the JavaScript bundle can become quite large, and thus affect the page load time.
      // It would be more efficient if we can split each route's components into separate chunks, and only load them when the route is visited.
      component: () => import("../views/Historique.vue"),
    },
    {
      path: "/spot",
      name: "Spot",
      component: () => import("../views/Spot.vue"),
    },
    {
      // dynamic segments start with a colon
      path: "/changelog",
      name: "Changelog",
      component: () => import("../views/Changelog.vue"),
    },
    {
      path: "/about",
      name: "A propos",
      component: () => import("../views/Apropos.vue"),
    },
    
    // will match everything and put it under `$route.params.pathMatch` -> Gestion 404
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/404.vue"),
    },
  ],
});

export default router;
