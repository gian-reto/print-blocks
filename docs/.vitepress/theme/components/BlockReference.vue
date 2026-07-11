<script setup lang="ts">
import { computed } from "vue";
import { data } from "../../data/block-reference.data";
import SchemaFields from "./SchemaFields.vue";

const props = defineProps<{
  type: string;
}>();

const block = computed(() => {
  const reference = data.blocks[props.type];

  if (reference === undefined) {
    throw new Error(`Unknown block reference type: ${props.type}`);
  }

  return reference;
});

const example = computed(() => JSON.stringify(block.value.example, null, 2));
</script>

<template>
  <section class="block-reference">
    <h2>Example</h2>
    <pre class="block-example"><code>{{ example }}</code></pre>

    <h2>Fields</h2>
    <SchemaFields v-if="block.fields.length > 0" :fields="block.fields" />

    <section
      v-for="variant in block.variants"
      :key="variant.label"
      class="schema-variant"
    >
      <h3>
        <code>{{ variant.label }}</code>
      </h3>
      <SchemaFields :fields="variant.fields" />
    </section>
  </section>
</template>
