<template>
  <div class="flex-center">
    <!-- to grab the id thas was passed in to the route, the syntax is like so -->
    The id passed in is: {{ $route.params.id }}
  </div>
</template>