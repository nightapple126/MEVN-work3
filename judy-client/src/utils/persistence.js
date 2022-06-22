export default {
    set(name, object) {
        window.localStorage.setItem(name, JSON.stringify(object))
    },
    get(name) {
        return JSON.parse(window.localStorage.getItem(name))
    },
    remove(name) {
        window.localStorage.removeItem(name)
    }
}