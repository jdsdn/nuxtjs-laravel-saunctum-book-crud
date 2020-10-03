<template>
  <section class="section">
    <div class="container">
      <h5 class="title is-6">Name: {{ $store.state.authUser.name }} </h5>
      <h5 class="title is-6">Email: {{ $store.state.authUser.email }} </h5>
      <h5 class="title is-6">Token: {{ $store.state.authUser.token }} </h5>
    </div>
  </section>
</template>

<script>
  export default {
    middleware: 'guess',
  };
</script>
