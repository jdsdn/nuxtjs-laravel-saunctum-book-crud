<template>
  <nav class="navbar is-light">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">Nuxt JS</nuxt-link>
        <button class="button navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <template v-if="$store.state.authUser">
            <nuxt-link class="navbar-item" to="/authors/authors"> Authors </nuxt-link>
            <nuxt-link class="navbar-item" to="/books/books"> Books </nuxt-link>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                My Profile
              </a>
              <div class="navbar-dropdown">
                <nuxt-link class="navbar-item" to="/user/account">My Profile</nuxt-link>
                <hr class="navbar-divider"/>
                <a class="navbar-item" @click="logout">Logout</a>
              </div>
            </div>
          </template>
          <template v-else>
            <nuxt-link class="navbar-item" to="/auth/register">Register</nuxt-link>
            <nuxt-link class="navbar-item" to="/auth/login">Log In</nuxt-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    async logout () {
      try {
        await this.$store.dispatch('logout')

        this.$router.push('/')
      } catch (e) {
        this.error = e.message
      }
    }
  }
}
</script>