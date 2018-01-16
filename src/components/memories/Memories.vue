<template>
    <v-content>
        <v-layout row>
            <v-flex xs12 md8>
                <v-form v-model="valid">
                    <v-text-field
                    label="E-mail"
                    v-model="email"
                    required
                    ></v-text-field>
                </v-form>
            </v-flex>
        </v-layout>
    </v-content>
</template>

<script>
export default {
  
}
</script>