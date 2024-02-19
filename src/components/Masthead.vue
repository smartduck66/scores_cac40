<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { ref } from "vue";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();
const router = useRouter();

const menu = ref();
const app_title = "WebCheck'CAC40";
const app_release = "v1.1c";

const menuitems = ref([
  {
    items: [
      {
        label: "MESURES",
        command: () => {
          router.push("/");
        },
      },
      {
        label: "HISTORIQUE",
        command: () => {
          router.push("/historique");
        },
      },
      {
        label: "SPOT",
        command: () => {
          router.push("/spot");
        },
      },
      {
        label: "CHANGELOG",
        command: () => {
          router.push("/changelog");
        },
      },
      {
        label: "A PROPOS",
        command: () => {
          router.push("/about");
        },
      },
    ],
  },
]);

const toggleMenu = (event: any) => {
  menu.value.toggle(event);
};
</script>

<template>
  <div v-bind:class="{ FlexWrapperMobile: store.sm, FlexWrapper: !store.sm }">
    <img v-if="!store.sm" src="/img/phare.webp" alt="Phare" />
    <div>
      <div v-if="store.xxl || store.xxxl">
        <RouterLink to="/">
          <span class="titre">{{ app_title }}</span> /></RouterLink
        >
        <span :style="{ 'font-size': '14px', 'margin-left': '50px' }"> {{ app_release }}</span>
        <div class="sous-titre1">Performances Web des sites du CAC40</div>
        <div class="menu">
          <RouterLink to="/"><span class="ListItem"> MESURES </span></RouterLink>
          <RouterLink to="/historique"><span class="ListItem"> HISTORIQUE </span></RouterLink>
          <RouterLink to="/spot"><span class="ListItem"> SPOT </span></RouterLink>
          <RouterLink to="/changelog"><span class="ListItem"> CHANGELOG </span></RouterLink>
          <RouterLink to="/about"><span class="ListItem"> A PROPOS </span></RouterLink>
        </div>
      </div>
      <div v-else>
        <!-- Taille de l'écran inférieure à 1280px  -->
        <div class="my_grid">
          <div class="c-item-1">
            <RouterLink to="/">
              <span class="titre">{{ app_title }}</span></RouterLink
            >
            <span :style="{ 'font-size': '14px', 'margin-left': '3px', 'margin-top': '-2px' }"> {{ app_release }}</span>
          </div>
          <div class="c-item-2">
            <button class="button_burger" type="button" @click="toggleMenu">
              <img src="../assets/svg/align-justify.svg" alt="burger menu" />
            </button>
            <Menu ref="menu" :model="menuitems" :popup="true" style="padding-left: 0.5em" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <RouterView />
</template>

<style scoped>
a {
  outline: none;
  color: white;
  text-decoration: none;
  padding: 2px 1px 0;
}
.FlexWrapper {
  width: 900px;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
  gap: 30px;
  margin-bottom: 20px;
}

.FlexWrapperMobile {
  width: 220px;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  gap: 10px;
  margin-bottom: 20px;
}

.titre {
  font-size: 24px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #3b8624;
}
.sous-titre1 {
  font-size: 18px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: black;
  margin-top: 5px;
}

.ListItem {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: black;
}

.menu {
  width: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
  gap: 30px;
  margin-top: 50px;
  margin-left: 0px;
}

.button_burger {
  width: 50px;
  height: 50px;
  background-color: transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
}


.my_grid {
  display: grid;
  grid-template-columns: 300px auto;
  grid-template-rows: 10px;
  margin-bottom: 40px;
}

[class^="c-item"] {
  display: inline-grid;
}

.c-item-1 {
  grid-column: 1;
  justify-content: left;
}
.c-item-2 {
  grid-column: 2;
  justify-content: right;
  margin-top: -5px;
}
</style>
