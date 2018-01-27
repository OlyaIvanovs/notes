<template>
  <div>
    <v-alert 
        :color="color" 
        :icon="icon" 
        @input="onClose" 
        dismissible 
        :value="true">
        {{ text }}
    </v-alert>
  </div>
</template>

<script>
    export default {
        props: ['text', 'color', 'icon'],
        data () {
            return {
            }
        },
        methods: {
            onClose () {
                this.$emit('dismissed')
            }
        }
    }

</script>