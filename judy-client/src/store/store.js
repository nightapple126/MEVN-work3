import Vue from "vue";
import Vuex from "vuex";
import { stat } from "fs";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    token: window.localStorage.getItem("token"),
    user: JSON.parse(window.localStorage.getItem("user")),
    isUserLoggedIn: window.localStorage.getItem("user") != null,
    locked: window.localStorage.getItem("locked"),
    feedback:
      JSON.parse(window.localStorage.getItem("feedback")) == null
        ? []
        : JSON.parse(window.localStorage.getItem("feedback")),
    events:
      JSON.parse(window.localStorage.getItem("events")) == null
        ? []
        : JSON.parse(window.localStorage.getItem("events"))
  },
  getters: {
    locked: ctx => {
      if (ctx.locked == null) {
        return false;
      }
      return ctx.locked;
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      if (token != null) {
        state.isUserLoggedIn = true;

        window.localStorage.setItem("token", token);
      } else {
        state.isUserLoggedIn = false;
      }
    },
    setUser(state, user) {
      state.user = user;
      window.localStorage.setItem("user", JSON.stringify(state.user));
    },
    toggleLock(state, value) {
      state.locked = value;
      window.localStorage.setItem("locked", state.locked);
    },
    setFeedback(state, feedback) {
      state.feedback.push(feedback);
      console.log(state.feedback);
      window.localStorage.setItem("feedback", JSON.stringify(state.feedback));
    },
    addEvent(state, event) {
      state.events.push(event);
      window.localStorage.setItem("events", JSON.stringify(state.events));
    },
    removeEvent(state, event) {
      state.events.splice(state.events.indexOf(event), 1);
      window.localStorage.setItem("events", JSON.stringify(state.events));
    },
    updatePicture(state, picture) {
      state.user.picture = picture;
      window.localStorage.setItem("user", JSON.stringify(state.user));
    },
    addEventWhishlist(state, event) {
      if (state.user.whishlist) {
        if (!state.user.whishlist.includes(event._id)) {
          state.user.whishlist.push(event._id);
          window.localStorage.setItem("user", JSON.stringify(state.user));
        }
      } else {
        state.user.whishlist = [];
        state.user.whishlist.push(event._id);
        window.localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    addEventParticipation(state, event) {
      if (state.user.participations) {
        if (!state.user.participations.includes(event._id)) {
          state.user.participations.push(event._id);
          window.localStorage.setItem("user", JSON.stringify(state.user));
        }
      } else {
        state.user.participations = [];
        state.user.participations.push(event._id);
        window.localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    removeEventParticipation(state, event) {
      if (state.user.participations) {
        if (state.user.participations.includes(event._id)) {
          state.user.participations = state.user.participations.filter(e => !e.includes(event._id));
          window.localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
      
    },
    removeEventWhishlist(state, event) {
      if (state.user.whishlist) {
        if (state.user.whishlist.includes(event._id)) {
          state.user.whishlist = state.user.whishlist.filter(e => !e.includes(event._id));
          window.localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit("setToken", token);
    },
    setUser({ commit }, user) {
      commit("setUser", user);
    },
    logout({ commit }) {
      commit("setUser", null);
      commit("setToken", null);
      window.localStorage.clear();
    },
    setFeedback({ commit }, feedback) {
      commit("setFeedback", feedback);
    }
  }
});
