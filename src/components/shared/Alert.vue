<template>
  <div>
    <v-alert color="warning" @input="onClose" dismissible icon="warning" :value="true">
        {{ text }}
    </v-alert>
  </div>
</template>

<script>
    export default {
        props: ['text'],
        data () {
            return {}
        },
        methods: {
            onClose () {
                this.$emit('dismissed')
            }
        }
    }

</script>