<script setup lang="ts">
import type { BlockReferenceField } from "../../data/block-reference.data";

defineProps<{
  fields: BlockReferenceField[];
}>();
</script>

<template>
  <div class="schema-fields">
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="field in fields" :key="field.name">
          <td>
            <code>{{ field.name }}</code>
            <span
              class="field-requirement"
              :class="{ required: field.required }"
            >
              {{ field.required ? "required" : "optional" }}
            </span>
          </td>
          <td>
            <code>{{ field.type }}</code>
          </td>
          <td>
            <p v-if="field.description">{{ field.description }}</p>
            <ul v-if="field.details.length > 0" class="field-details">
              <li v-for="detail in field.details" :key="detail">
                {{ detail }}
              </li>
            </ul>
            <details v-if="field.fields.length > 0">
              <summary>Nested fields</summary>
              <SchemaFields :fields="field.fields" />
            </details>
            <details v-if="field.variants.length > 0">
              <summary>Variants</summary>
              <section
                v-for="variant in field.variants"
                :key="variant.label"
                class="schema-variant nested"
              >
                <h4>
                  <code>{{ variant.label }}</code>
                </h4>
                <SchemaFields :fields="variant.fields" />
              </section>
            </details>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
