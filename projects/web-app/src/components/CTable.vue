<template>
  <div class="table-wrapper">
    <table class="forge-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="index"
          :class="{ clickable: !!onRowClick }"
          @click="onRowClick && onRowClick(row)"
        >
          <td v-for="col in columns" :key="col.key">
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CTable',
  props: {
    columns: {
      type: Array,
      required: true,
      validator: cols => cols.every(c => c.key && c.label),
    },
    data: { type: Array, required: true },
    onRowClick: { type: Function, default: null },
  },
};
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  border-radius: var(--forge-card-radius);
}

.forge-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', system-ui, sans-serif;
}

.forge-table th {
  text-align: left;
  padding: 0.875rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--forge-text3);
  border-bottom: 1px solid var(--forge-glass-border);
  background: var(--forge-glass);
}

.forge-table td {
  padding: 0.875rem 1rem;
  font-size: 0.9rem;
  color: var(--forge-text);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.forge-table tbody tr {
  transition: background var(--transition-fast);
}

.forge-table tbody tr:hover {
  background: var(--forge-glass-hover);
}

.forge-table tbody tr.clickable {
  cursor: pointer;
}

.forge-table tbody tr:last-child td {
  border-bottom: none;
}
</style>
